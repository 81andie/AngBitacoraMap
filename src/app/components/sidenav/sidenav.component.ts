import { Dibujo } from '../../interfaces/dibujo.interface';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DibujosService } from '../../services/dibujos.service';
import { Subscription } from 'rxjs';





@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

  public isSidebarVisible: boolean = false;
  public editMode: boolean = false;
  public textToFilter: string = '';
  public dibujos: Dibujo[] = [];

  private dibujosSubscription!: Subscription;
  @Output() public centerMapToCoordinateEmitter = new EventEmitter<Dibujo>();
  @Output() public removeMapDibujo = new EventEmitter<Dibujo>();

  constructor(private DibujosService: DibujosService) { }

  ngOnInit(): void {
    this.dibujosSubscription = this.DibujosService
    .obtenerSubscripcionDibujos()
    .subscribe((dibujosActualizados) => {
      this.dibujos = dibujosActualizados;
    });
    this.getDibujos();
  }


  getDibujos() {
    this.dibujos = this.DibujosService.obtenerDibujos();
    this.isSidebarVisible = true
  }

  centerMapToCoordinate(dibujo:Dibujo) {
    this.centerMapToCoordinateEmitter.emit(dibujo);
    this.isSidebarVisible = false;
  }


  deleteDibujo(dibujoToRemove: Dibujo) {
    let storageDibujos = this.DibujosService.obtenerDibujos();
    let indexDibujoDelete = -1;
    storageDibujos.forEach((dibujo, index) => {
      if (dibujo.id === dibujoToRemove.id) {
        indexDibujoDelete = index;
      }
    })
    storageDibujos.splice(indexDibujoDelete, 1)
    this.DibujosService.guardarDibujos(storageDibujos)
    this.removeMapDibujo.emit(dibujoToRemove)
  }

  editDescription(dibujoToEdit: Dibujo) {
    dibujoToEdit.isEditMode = true;
    dibujoToEdit.oldDescription = dibujoToEdit.description;
  }

  cancelEdit(dibujoToCancel: Dibujo) {
    dibujoToCancel.isEditMode = false;
    dibujoToCancel.description = dibujoToCancel.oldDescription;
  }


  saveToLocal(dibujoToSave: Dibujo) {
    dibujoToSave.isEditMode = false;
    this.DibujosService.guardarDibujos(this.dibujos)
  }

  filterDibujos() {
    if (this.textToFilter.length > 0) {
      return this.dibujos.filter(dibujo => dibujo.description?.includes(this.textToFilter))
    }
    return this.dibujos;
  }

}



