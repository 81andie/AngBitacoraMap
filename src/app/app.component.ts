import { Component } from '@angular/core';
import { Marcador } from './interfaces/ListaMarcadores';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngBitacoraMap';

  public temporaryMarkerToRemove:Marcador = {id:0};
  public newCoordinateCenter: number[]=[];

  closeHandler(marcador: Marcador){
    this.temporaryMarkerToRemove = marcador;
  }

  changeCenterOfMapHandler(coordinate:number[]){
    this.newCoordinateCenter = coordinate;

  }
}


