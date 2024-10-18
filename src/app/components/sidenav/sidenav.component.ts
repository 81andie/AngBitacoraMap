import { Marcadores } from './../../interfaces/ListaMarcadores';
import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';





@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

public isSidebarVisible: boolean = true;

//public recogerMarcadores: number[][] = [];

public markers:Marcadores[]=[];
//public textAreaValue: string="";


constructor( private MarkersService: MarkersService){
 this.sacarMarcadores()

 this.recogerComentario()

}



sacarMarcadores(){

 this.markers = this.MarkersService.obtenerMarkers()

 //console.log(this.markers)


}

guardarLocal(){

let marcadorCompoleto = localStorage.setItem('markers', JSON.stringify(this.markers));
 console.log(marcadorCompoleto)

}


recogerComentario(){

  const markersRecuperados= JSON.parse(localStorage.getItem('markers') || "[]");

  this.markers = markersRecuperados;



}


}



