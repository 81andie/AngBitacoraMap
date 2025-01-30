import { Coordinates } from "./coordinates.interface";

//añadir nueva propiedad geometria lineas
export interface Dibujo {
  id:number;
  coordinates?:Coordinates,
  typeGeometry?: string,
  description?: string,
  isEditMode?:boolean,
  oldDescription?: string



  /*
  opcion 2
  ++ mas claro (lo lees mejor programando)
  -- por cada tipo de geometria que añadas, es una propiedad mas

  coordinatePoint?: number[],
  coordinateLineString?: number[][],
  typeGeometry

  */
}
