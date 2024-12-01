import { Marcador } from './../../interfaces/ListaMarcadores';
import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';






@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

  public isSidebarVisible: boolean = false;

  //public recogerMarcador: number[][] = [];



  public sidenavMarcador: Marcador = {};
  public marker: Marcador[]=[];



  constructor(private MarkersService: MarkersService) {


  }

  ngOnInit(): void {
    console.log(this.sidenavMarcador)
    this.recogerComentario()
    this.getMarkers();

  }





  guardarLocal() {
    this.isSidebarVisible = false;
    this.MarkersService.guardarMarcador(this.sidenavMarcador)
  }



  recogerComentario() {

    this.isSidebarVisible = true;
    const marcadorCompleto = this.MarkersService.obtenerMarkers()

  }


  getMarkers(){
   this.marker= this.MarkersService.obtenerMarkers();
   console.log(this.marker);

  }

  /*eliminarMarcador(index:number){
  this.markers.splice(index, 1);
  this.guardarLocal();

  }*/


}



