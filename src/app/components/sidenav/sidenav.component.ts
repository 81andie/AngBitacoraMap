import { Marcador } from './../../interfaces/ListaMarcadores';
import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';
import { Subscription } from 'rxjs';





@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

  public isSidebarVisible: boolean = false;

  public marcador: Marcador[] = [];
  private markersSubscription!:Subscription;







  constructor(private MarkersService: MarkersService) {


  }

  ngOnInit(): void {

    //this.recogerComentario()
    this.getMarkers();


  }





  getMarkers(){

   /*this.marker= this.MarkersService.obtenerMarkers();
   this.isSidebarVisible = true;
   console.log(this.marker);*/

   this.marcador = this.MarkersService.obtenerMarkers();
   this.markersSubscription = this.MarkersService
      .obtenerSubscripcionMarkers()
      .subscribe((marcador) => {
        this.marcador = marcador;
      });

      this.isSidebarVisible = true

  }

  /*eliminarMarcador(index:number){
  this.markers.splice(index, 1);
  this.guardarLocal();

  }*/


}



