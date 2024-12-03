import { Marcador } from './../../interfaces/ListaMarcadores';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() public centerMapToCoordinateEmitter= new EventEmitter<number[]>();

  constructor(private MarkersService: MarkersService) {}

  ngOnInit(): void {

    this.getMarkers();
  }


  getMarkers(){

   this.marcador = this.MarkersService.obtenerMarkers();
   this.markersSubscription = this.MarkersService
      .obtenerSubscripcionMarkers()
      .subscribe((marcador) => {
        this.marcador = marcador;
      });

      this.isSidebarVisible = true

  }

  centerMapToCoordinate(coordinate: number[]|undefined) {
  this.centerMapToCoordinateEmitter.emit(coordinate);
  }



}



