import { Injectable } from '@angular/core';
import { Marcador } from '../interfaces/ListaMarcadores';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  public marcadorBorrador: Marcador= {};

  private marcadorBorradorSubject = new Subject<Marcador>();
  private markersSubject = new Subject<Marcador[]>();

  constructor() { }


  inicializar(coordinate: number[]): void {
    const newMarker: Marcador = {
      coordinate: coordinate,
      description: ''
    };
    this.marcadorBorradorSubject.next(newMarker);
  }


  obtenerMarkers(): Marcador[] {
    return JSON.parse(localStorage.getItem('markers') || "[]");

  }

  guardarMarkers(markers:Marcador[]):void{

    localStorage.setItem('markers', JSON.stringify(markers));
    this.markersSubject.next(markers);

  }

  obtenerSubscripcionMarcador(){
    return this.marcadorBorradorSubject.asObservable();
  }

  obtenerSubscripcionMarkers() {
    return this.markersSubject.asObservable(); // Observable para los cambios en la lista de marcadores
  }


  guardarMarcador(marker:Marcador){

    let marcadores = this.obtenerMarkers();
    marcadores.push(marker);
    this.guardarMarkers(marcadores);

  }






}
