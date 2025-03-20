import { Component, EventEmitter, Output } from '@angular/core';
import { DibujosService } from '../../services/dibujos.service';
import { Dibujo } from '../../interfaces/dibujo.interface';

@Component({
  selector: 'app-bottomnav',
  templateUrl: './bottomnav.component.html',
  styleUrl: './bottomnav.component.css'
})
export class BottomnavComponent {

  public isBottomNavVisible: boolean = false;
  public dibujo: Dibujo = {id:0};
  @Output() public closeEventEmitter= new EventEmitter<Dibujo>();


  constructor(private MarkersService: DibujosService){

    this.MarkersService.obtenerSubscripcionDibujoBorrador().subscribe((marcador:Dibujo)=>{
      this.dibujo= marcador;
      console.log(this.dibujo)
      this.isBottomNavVisible = true;
    })
  }

  save() {

    this.isBottomNavVisible= false;
    this.MarkersService.guardarDibujo(this.dibujo)
  }
  close(){
    this.isBottomNavVisible= false;
    this.closeEventEmitter.emit(this.dibujo)

  }



}
