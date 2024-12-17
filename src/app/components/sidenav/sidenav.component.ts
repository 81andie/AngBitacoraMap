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

  public marcadores: Marcador[] = [];
  private markersSubscription!: Subscription;
  @Output() public centerMapToCoordinateEmitter = new EventEmitter<number[]>();

  constructor(private MarkersService: MarkersService) { }

  ngOnInit(): void {

    this.getMarkers();
  }


  getMarkers() {

    this.marcadores = this.MarkersService.obtenerMarkers();
    this.markersSubscription = this.MarkersService
      .obtenerSubscripcionMarkers()
      .subscribe((marcador) => {
        this.marcadores = marcador;
      });

    this.isSidebarVisible = true

  }

  centerMapToCoordinate(coordinate: number[] | undefined) {
    this.centerMapToCoordinateEmitter.emit(coordinate);
  }


  deleteMarker(id: number) {
    console.log("delete")
    let storageMarkers = this.MarkersService.obtenerMarkers();
    //fem veure que storageMarkers té 5 markers
    let indexMarkerDelete = 0;
    storageMarkers.forEach((marker, index) => {

      indexMarkerDelete= index;

      if (marker.id === id ) {
        //console.log(marker.id);
        //console.log(id);
       return
      }
    })
    storageMarkers.splice(indexMarkerDelete, 1)
    this.MarkersService.guardarMarkers(storageMarkers)

  }

}



