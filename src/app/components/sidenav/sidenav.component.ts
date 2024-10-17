import { Marcadores } from './../../interfaces/ListaMarcadores';
import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';




@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent{

  public isSidebarVisible: boolean = true;


  constructor( private MarkersService: MarkersService){}

 public recogerMarcadores: number[][] = [];



  sacarMarcadores(){

 this.recogerMarcadores = this.MarkersService.obtenerMarkers();

 console.log(this.recogerMarcadores);

  }






}
