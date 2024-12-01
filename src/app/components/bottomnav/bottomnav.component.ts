import { Component, EventEmitter, Output } from '@angular/core';
import { MarkersService } from '../../services/markers.service';
import { Marcador } from '../../interfaces/ListaMarcadores';

@Component({
  selector: 'app-bottomnav',
  templateUrl: './bottomnav.component.html',
  styleUrl: './bottomnav.component.css'
})
export class BottomnavComponent {

  public isBottomNavVisible: boolean = false;
  public marcador: Marcador = {};
  @Output() public closeEventEmitter= new EventEmitter<Marcador>();

  constructor(private MarkersService: MarkersService){

    this.MarkersService.obtenerSubscripcionMarcador().subscribe((marcador:Marcador)=>{
      this.marcador= marcador;
      this.isBottomNavVisible = true;
    })
  }

  save() {
    this.isBottomNavVisible= false;
    this.MarkersService.guardarMarcador(this.marcador)
  }
  close(){
    this.isBottomNavVisible= false;
    this.closeEventEmitter.emit(this.marcador)

  }



}
