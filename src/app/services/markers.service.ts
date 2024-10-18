import { Injectable } from '@angular/core';
import { Marcadores } from '../interfaces/ListaMarcadores';


@Injectable({
  providedIn: 'root'
})
export class MarkersService {



 // private markers: number[][]= [];

  private markers:Marcadores[]=[];




  /*
  Objetivo:
    dispensador de marcadores.
    comunicar los marcadores con los componentes que lo quieran.
  */
  constructor() {}

 /*inicializar(markers:number[]):void{

   this.markers = markers;
   this.markers.push(markers)

  }*/

  /*obtenerMarkers(): number[][] {
    //console.log(this.markers)
   return this.markers;

  }*/

 inicializar (coordinate:number[]):void{
  const newMarker: Marcadores ={
    coordinate: coordinate,
    description: ''
  };
  this.markers.push(newMarker);
 }


 obtenerMarkers(): Marcadores[]{

  return this.markers



 }





}
