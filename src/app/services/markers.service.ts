import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MarkersService {



  private markers: number[][] = [];


  /*
  Objetivo:
    dispensador de marcadores.
    comunicar los marcadores con los componentes que lo quieran.
  */
  constructor() {}

  inicializar(markers:number[]):void{

  //this.markers = markers;

   this.markers.push(markers)

  }

  obtenerMarkers(): number[][] {
    console.log(this.markers)
    return this.markers;
  }



}
