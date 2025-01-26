import { Component } from '@angular/core';
import { Dibujo } from './interfaces/dibujo.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngBitacoraMap';

  public temporaryMarkerToRemove:Dibujo = {id:0};
  public newCoordinateCenter: number[]=[];

  closeHandler(marcador: Dibujo){
    this.temporaryMarkerToRemove = marcador;
  }

  changeCenterOfMapHandler(coordinate:number[]){
    this.newCoordinateCenter = coordinate;

  }
}


