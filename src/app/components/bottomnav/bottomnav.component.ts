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


  constructor(private DibujosService: DibujosService){

    this.DibujosService.obtenerSubscripcionDibujoBorrador().subscribe((dibujo:Dibujo)=>{
      this.dibujo= dibujo;
      console.log(this.dibujo)
      this.isBottomNavVisible = true;
    })
  }

  save() {

    this.isBottomNavVisible= false;
    this.DibujosService.guardarDibujo(this.dibujo)
  }
  close(){
    this.isBottomNavVisible= false;
    this.closeEventEmitter.emit(this.dibujo)

  }



}
