import { Component } from '@angular/core';
import { Marcador } from './interfaces/ListaMarcadores';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngBitacoraMap';

  public temporaryMarkerToRemove:Marcador = {};

  closeHandler(marcador: Marcador){

    this.temporaryMarkerToRemove = marcador;


  }
}


