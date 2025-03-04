
tarea 7 
Editar marcadores
- Millorar l'estil 


tarea 8 
buscador de marcadores(buscar la descripción)
-mejorar estilo


tarea 9
mejorar estilo del scroll


tarea 11
poder exportar en Geojson.
Hemos exportado el GeoJSon, pero sin la descripción.
Incoherencias en que se descargan todas las features, que no estan guardadas en el LocalStorage.
Uno que en el mapa no tiene dibujos que no esten guardados.

Funcionalidad 1- Descargar un geojson que contenga los dibujos del mapa
(OL) Generar string formato geojson dado unas features
  - Las Features se guardan en el VectorSource
(TS) Con el string, generar un fichero y permitir descargarlo automaticamente

Para que sirve - Te serviria para compartirlo con otra gente o para volver a cargarlos mas tarde

Falta añadir description cuando recuperamos los markers en recoverMarkers, que proviene del localStorage


tarea 12
poder importar en Geojson.


Funcionalidad 2- Cargar un geojson para visualizar dibujos en el mapa
(TS) Formulario para cargar un fichero y transformarlo a string
(OL) De un string -> features

Para que sirve- Serviria para volver a consultar dibujos de otros usuarios o previamente guardados


tarea 13 
poder abrir y cerrar el sidenav




objetivo: ser capaces de detectar si existe o no un elemento en la lista

let array = [ 1,20,35,45,60];
let indexTrobat = -1;

array.forEach((num, index)=>{
  if(num === 38){
    indexTrobat = index;
  }
})

console.log(indexTrobat);

----------------------


let index = GetIndexOfElementInArray(array, 11);

-1
index??

function GetIndexOfElementInArray(array, element) {

}





let noExiste = !NumeroExiste(array, 38);

// primera fase del bucle

num = 1
si el num1 existe


