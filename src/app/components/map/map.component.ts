import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Marcador } from '../../interfaces/ListaMarcadores';
import { MarkersService } from '../../services/markers.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})


export class MapComponent implements OnInit {

  constructor(private MarkersService: MarkersService) { }

  /*
  {coordinate: number[], description: string}[]
  */

  private vectorSource: any = new VectorSource({
    features: []
  });

  private vectorLayer = new VectorLayer({
    source: this.vectorSource
  });


  ngOnInit(): void {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: [311158.68373997946, 5157606.481663526],
        zoom: 14,
      }),
    });

    map.on('singleclick', (evt) => {
      this.addMarker(evt.coordinate);
      this.MarkersService.inicializar(evt.coordinate)



    });

    map.addLayer(this.vectorLayer);

    this.recoverMarkers()


  }



  private addMarker = (coordinate: number[] | undefined): void => {

    if (!coordinate) return;


    //this.markers.push(coordinate);
    // this.MarkersService.obtenerMarkers()


    const startMarker = new Feature({
      type: 'point',
      geometry: new Point(coordinate),
    });

    startMarker.setStyle(new Style({
      image: new Icon({
        anchor: [0.6, 0.5],
        src: './assets/marker.png',
        scale: 0.3
      })
    }))

    this.vectorSource.addFeature(startMarker);
    //console.log('Marcadores:', this.markers);
  }



  recoverMarkers(): void {

    const markersRecuperados = this.MarkersService.obtenerMarkers();

    markersRecuperados.forEach((marker: Marcador) => {
      // this.MarkersService.inicializar(marker.coordinate)
      this.addMarker(marker.coordinate);
    })

  }

}
