import { Component, OnInit } from '@angular/core';
import { Modify, Snap} from 'ol/interaction.js';
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

  private map: Map | null = null;
  /*

   private map: Map | null = null;
   private map2: Map | null = map

  private variable_name : type_variable
  */


  ngOnInit(): void {
    this.map = new Map({
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

    this.map.on('singleclick', (evt) => {
      this.addMarker(evt.coordinate);
      this.MarkersService.inicializar(evt.coordinate)
    });

    this.addInteractions();

    this.map.addLayer(this.vectorLayer);

    this.recoverMarkers()


  }



  private addMarker = (coordinate: number[] | undefined): void => {

    if (!coordinate) return;


    //this.markers.push(coordinate);
    // this.MarkersService.obtenerMarkers()


    const startMarker = new Feature({
      type: 'point',
      geometry: new Point(coordinate)
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




  addInteractions(){

    if(!this.map) return
    const modify = new Modify({source: this.vectorSource});

    modify.on('modifyend', (evt) => {
      let marcadoresPorGuardar:Marcador[] = []
      let markers = [];
      console.log(evt);
      console.log(this.vectorSource.getFeatures());

      this.vectorSource.getFeatures().forEach((feature: Feature<Point>)=>{
       let coordinate = feature.getGeometry()?.getCoordinates()
       marcadoresPorGuardar.push({coordinate: coordinate, description: ''})
      })

      /*
      obtener las coordenadas de los markers
      this.vectorSource.getFeatures() esto es una array
        en cada elemento del array
        feature.getGeometry().getCoordinates() - esto devuelve un array de longitud latitud, coordinates
      */

      this.MarkersService.guardarMarkers(marcadoresPorGuardar)
    });

    this.map.addInteraction(modify);
  }



  recoverMarkers(): void {

    const markersRecuperados = this.MarkersService.obtenerMarkers();

    markersRecuperados.forEach((marker: Marcador) => {
      // this.MarkersService.inicializar(marker.coordinate)
      this.addMarker(marker.coordinate);
    })

  }



}
