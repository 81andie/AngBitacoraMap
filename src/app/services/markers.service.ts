import { Injectable } from '@angular/core';
import { Dibujo } from '../interfaces/dibujo.interface';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  public marcadorBorrador: Dibujo= {id : 0};

  private marcadorBorradorSubject = new Subject<Dibujo>();
  private markersSubject = new Subject<Dibujo[]>();

  constructor() { }



  generateUniqueId(){
    let date = new Date();
    return date.getTime();

  }




  inicializar( id: number,coordinate: number[]): void {

    const newMarker: Dibujo = {
      id: id,
      coordinate: coordinate,
      description: '',
      isEditMode:false
    };
    this.marcadorBorradorSubject.next(newMarker);

  }


  obtenerMarkers(): Dibujo[] {
    return JSON.parse(localStorage.getItem('markers') || "[]");

  }

  guardarMarkers(markers:Dibujo[]):void{

    localStorage.setItem('markers', JSON.stringify(markers));
    this.markersSubject.next(markers);

  }

  obtenerSubscripcionMarcador(){
    return this.marcadorBorradorSubject.asObservable();
  }

  obtenerSubscripcionMarkers() {
    return this.markersSubject.asObservable(); // Observable para los cambios en la lista de marcadores
  }


  guardarMarcador(marker:Dibujo){

    let marcadores = this.obtenerMarkers();
    marcadores.push(marker);
    this.guardarMarkers(marcadores);

  }






}
