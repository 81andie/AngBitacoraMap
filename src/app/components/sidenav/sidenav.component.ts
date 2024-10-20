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



constructor( private MarkersService: MarkersService){
  this.MarkersService.obtenerSubscripcionMarcador().subscribe((marcador: Marcador )=> {
    console.log("ha cambiado el marcador", marcador);

    this.sidenavMarcador = marcador;
    this.isSidebarVisible = true;
  })


}
  ngOnInit(): void {

  }





guardarLocal(){

// this.MarkersService.guardarMarkers(this.markers);

 //console.log(this.markers)
this.isSidebarVisible = false;

this.MarkersService.guardarMarcador(this.sidenavMarcador)

}



recogerComentario(){


const marcadorCompleto = this.MarkersService.obtenerMarkers()
console.log(marcadorCompleto)
}


/*eliminarMarcador(index:number){
this.markers.splice(index, 1);
this.guardarLocal();

}*/


}



