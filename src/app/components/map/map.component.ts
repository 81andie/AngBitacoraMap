import { Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Modify, Snap } from 'ol/interaction.js';
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


export class MapComponent implements OnInit, OnChanges {

  constructor(private MarkersService: MarkersService) { }


  ngOnChanges(changes: SimpleChanges): void {
    /*
    la variable changes puede contener o bien  temporaryMarkerToRemove o bien
    newCenter

    si viene newCenter, printar por consola "hola"


    si viene el otro, printar por consola "adios"

    y otra diferente si viene temporaryMarkerToRemove

    */

    if (changes['newCenter'] && this.map) {
      console.log(changes['newCenter'])
      this.map.getView().setCenter(changes['newCenter'].currentValue)
    } else if (changes['temporaryMarkerToRemove'] && this.map) {
      console.log(changes['temporaryMarkerToRemove'])

      /**
       * guardar pixeles de ejecutar map.getPixelFromCoordinate(coordinate del marcador a borrar)
       * ejecutar la function map.getFeaturesAtPixel(pixelAnterior, {hitTolerance: 50})
       * la funcion te da una array de features que estan cerca de la coordenada del marcador
       * por cada feature
       *  comprovar si la feature es la misma que el marcador
       *  una vez sabes sin ninguna duda que la feature es el marcador
       *  vectorSource.removeFeature(feature);
      */

      let coordinates = changes['temporaryMarkerToRemove'].currentValue;
      console.log(coordinates)

      let pixel = this.map.getPixelFromCoordinate(coordinates.coordinate)

      let features = this.map.getFeaturesAtPixel(pixel, { hitTolerance: 50 })

      features.forEach((feature) => {
      let coordinate = feature.getProperties();
       console.log(coordinate['geometry'].flatCoordinates);

      if(coordinate['geometry'].flatCoordinates[0] === coordinates.coordinate[0] && coordinate['geometry'].flatCoordinates[1] === coordinates.coordinate[1]){
        this.vectorSource.removeFeature(feature);
      }


      })

    }
  }

  @Input() public temporaryMarkerToRemove: Marcador = {};
  @Input() public newCenter: number[] = [];

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




  addInteractions() {

    if (!this.map) return
    const modify = new Modify({ source: this.vectorSource });

    modify.on('modifyend', (evt) => {
      let marcadoresPorGuardar: Marcador[] = []
      let markers = [];
      console.log(evt);
      console.log(this.vectorSource.getFeatures());

      this.vectorSource.getFeatures().forEach((feature: Feature<Point>) => {
        let coordinate = feature.getGeometry()?.getCoordinates()
        marcadoresPorGuardar.push({ coordinate: coordinate, description: '' })
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
