import { Injectable } from '@angular/core';
import { Dibujo } from '../interfaces/dibujo.interface';
import { Subject } from 'rxjs';
import { Coordinates } from '../interfaces/coordinates.interface';


@Injectable({
  providedIn: 'root'
})
export class DibujosService {

  public dibujoBorrador: Dibujo= {id : 0};
  private dibujoBorradorSubject = new Subject<Dibujo>();
  private dibujosSubject = new Subject<Dibujo[]>();

  constructor() { }

  generateUniqueId(){
    let date = new Date();
    return date.getTime();
  }

  inicializar( id: number,coordinates: Coordinates, typeGeometry:string): void {
    //contemplar el caso typeGeometry LineString
    const newDibujo: Dibujo = {
      id: id,
      coordinates: coordinates,
      typeGeometry,
      description: '',
      isEditMode:false
    };
    this.dibujoBorradorSubject.next(newDibujo);
  }

  obtenerDibujos(): Dibujo[] {
    return JSON.parse(localStorage.getItem('markers') || "[]");
  }

  guardarDibujos(dibujos:Dibujo[]):void{
    //se guarda en el localstorage
    localStorage.setItem('markers', JSON.stringify(dibujos));
    //actualitza el subject para que los observers se enteren del cambio
    this.dibujosSubject.next(dibujos);
  }

  obtenerSubscripcionDibujoBorrador(){
    return this.dibujoBorradorSubject.asObservable();
  }

  obtenerSubscripcionDibujos() {
    return this.dibujosSubject.asObservable(); // Observable para los cambios en la lista de marcadores
  }

  guardarDibujo(dibujo:Dibujo){
    let dibujos = this.obtenerDibujos();
    dibujos.push(dibujo);
    this.guardarDibujos(dibujos);
  }

}
