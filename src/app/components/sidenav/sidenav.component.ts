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


constructor( private MarkersService: MarkersService){
 this.sacarMarcadores()
}



sacarMarcadores(){
 

  console.log(this.MarkersService.obtenerMarkers());
}


}



