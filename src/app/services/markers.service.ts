import { Injectable } from '@angular/core';
import { Dibujo } from '../interfaces/dibujo.interface';
import { Subject } from 'rxjs';
import { Coordinates } from '../interfaces/coordinates.interface';


@Injectable({
  providedIn: 'root'
})
export class MarkersService {

  public marcadorBorrador: Dibujo= {id : 0};

  private marcadorBorradorSubject = new Subject<Dibujo>();
  private dibujosSubject = new Subject<Dibujo[]>();

  constructor() { }



  generateUniqueId(){
    let date = new Date();
    return date.getTime();

  }


/*
++ No duplicas codigo. Preparado para crecer más.
-- Puede ser confuso que solo tengas que definir 1 de las propiedades
Op 3 - Crear nueva interficie de tipo Coordinates
coordinatePoint
coordinateLineString
Dibujo -> Coordinates

patata(a:number, b: string, a:number, b: string, a:number, b: string, a:number, b: string)
patata(objecte: interficie)
*/

  inicializar( id: number,coordinates: Coordinates, typeGeometry:string): void {

    //contemplar el caso typeGeometry LineString
    const newMarker: Dibujo = {
      id: id,
      coordinates: coordinates,
      typeGeometry,
      description: '',
      isEditMode:false
    };
    this.marcadorBorradorSubject.next(newMarker);

  }


  obtenerMarkers(): Dibujo[] {
    return JSON.parse(localStorage.getItem('markers') || "[]");
  }

  guardarMarkers(markers:Dibujo[]):void{

    //se guarda en el localstorage
    localStorage.setItem('markers', JSON.stringify(markers));

    //actualitza el subject para que los observers se enteren del cambio
    this.dibujosSubject.next(markers);

  }

  obtenerSubscripcionMarcador(){
    return this.marcadorBorradorSubject.asObservable();
  }

  obtenerSubscripcionDibujos() {
    return this.dibujosSubject.asObservable(); // Observable para los cambios en la lista de marcadores
  }


  guardarMarcador(marker:Dibujo){

    let marcadores = this.obtenerMarkers();
    marcadores.push(marker);
    this.guardarMarkers(marcadores);

  }






}
