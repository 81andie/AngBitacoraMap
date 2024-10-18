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


 this.markers = this.MarkersService.obtenerMarkers()

 if(this.markers.length > 0){
  this.isSidebarVisible = false;
 }else{
  this.isSidebarVisible = true;
 }



}


}



