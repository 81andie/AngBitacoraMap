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
  public editMode: boolean = false;

  public marcadores: Marcador[] = [];
  private markersSubscription!: Subscription;
  @Output() public centerMapToCoordinateEmitter = new EventEmitter<number[]>();
  @Output() public removeMapMarker = new EventEmitter<Marcador>();

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


  deleteMarker(markerToRemove: Marcador) {
    console.log("delete")
    let storageMarkers = this.MarkersService.obtenerMarkers();
    //fem veure que storageMarkers té 5 markers
    let indexMarkerDelete = -1;
    storageMarkers.forEach((marker, index) => {

      if (marker.id === markerToRemove.id) {
        indexMarkerDelete = index;

      }
    })


    storageMarkers.splice(indexMarkerDelete, 1)
    this.MarkersService.guardarMarkers(storageMarkers)
    this.removeMapMarker.emit(markerToRemove)

  }

  editDescription(){
    console.log("editando")
    this.editMode = true;
  }

  cancelEdit(){
    this.editMode=false;
  }









}



