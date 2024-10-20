import { Marcadores } from './../../interfaces/ListaMarcadores';
import { Component, OnInit } from '@angular/core';
import { MarkersService } from '../../services/markers.service';




@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

public isSidebarVisible: boolean = true;

//public recogerMarcadores: number[][] = [];

public markers:Marcadores[]=[];
//public textAreaValue: string="";



constructor( private MarkersService: MarkersService){



}
  ngOnInit(): void {
    this.sacarMarcadores()


  }



sacarMarcadores(){
 this.markers = this.MarkersService.obtenerMarkers()

 //console.log(this.markers)

}

guardarLocal(){

let marcadorCompleto = localStorage.setItem('markers', JSON.stringify(this.markers));

 console.log(this.markers)
this.isSidebarVisible = true;

}



recogerComentario(){

let comentario = JSON.parse(localStorage.getItem('markers') || "[]");
 console.log(comentario);

}


eliminarMarcador(index:number){
this.markers.splice(index, 1);
this.guardarLocal();

}


}



