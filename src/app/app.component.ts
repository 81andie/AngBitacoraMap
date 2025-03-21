import { Component } from '@angular/core';
import { Dibujo } from './interfaces/dibujo.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngBitacoraMap';

  public temporaryDibujoToRemove:Dibujo = {id:0};
  public dibujoACentrar: Dibujo = {id:0};



  closeHandler(marcador: Dibujo){
    this.temporaryDibujoToRemove = marcador;
  }

  changeCenterOfMapHandler(dibujo: Dibujo){
    this.dibujoACentrar= dibujo;
  }





}


