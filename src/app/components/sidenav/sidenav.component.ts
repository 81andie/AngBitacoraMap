import { Dibujo } from '../../interfaces/dibujo.interface';
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
  public textToFilter: string = '';

  public marcadores: Dibujo[] = [];

  private markersSubscription!: Subscription;
  @Output() public centerMapToCoordinateEmitter = new EventEmitter<Dibujo>();
  @Output() public removeMapMarker = new EventEmitter<Dibujo>();

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



  centerMapToCoordinate(dibujo:Dibujo) {
    //todo, cambiarlo para que pueda contemplar point o lineString
    this.centerMapToCoordinateEmitter.emit(dibujo);
    this.isSidebarVisible = false;

  }


  deleteMarker(markerToRemove: Dibujo) {
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

  editDescription(markerToEdit: Dibujo) {
    console.log("editando")
    markerToEdit.isEditMode = true;
    markerToEdit.oldDescription = markerToEdit.description;


  }

  cancelEdit(markerToCancel: Dibujo) {
    markerToCancel.isEditMode = false;
    markerToCancel.description = markerToCancel.oldDescription;
  }


  saveToLocal(markerToSave: Dibujo) {

    markerToSave.isEditMode = false;

    this.MarkersService.guardarMarkers(this.marcadores)

  }


  filterMarkers() {

    if (this.textToFilter.length > 0) {
      return this.marcadores.filter(marcador => marcador.description?.includes(this.textToFilter))
    }
    return this.marcadores;
  }


}



