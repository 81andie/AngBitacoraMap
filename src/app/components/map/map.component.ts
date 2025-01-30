import { Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Modify, Snap, } from 'ol/interaction.js';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { Feature } from 'ol';
import { Geometry, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Dibujo } from '../../interfaces/dibujo.interface';
import { MarkersService } from '../../services/markers.service';
import { noModifierKeys, primaryAction } from 'ol/events/condition';



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

      let marker = changes['temporaryMarkerToRemove'].currentValue;
      console.log(marker)

      let pixel = this.map.getPixelFromCoordinate(marker.coordinate)

      let features = this.map.getFeaturesAtPixel(pixel, { hitTolerance: 50 })

      features.forEach((feature) => {
        let properties = feature.getProperties();
        console.log(properties['geometry'].flatCoordinates);

        if (properties['geometry'].flatCoordinates[0] === marker.coordinate[0] && properties['geometry'].flatCoordinates[1] === marker.coordinate[1]) {
          this.vectorSource.removeFeature(feature);
        }


      })

    }
  }



  @Input() public temporaryMarkerToRemove: Dibujo = { id: 0 };
  @Input() public newCenter: number[] = [];
  private drawInteraction: any = null;

  private vectorSource: any = new VectorSource({
    features: []
  });





  private vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': 'rgba(255,0,0, 0.8)',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
      'icon-src': './assets/marker.png',
      'icon-anchor': [0.6, 0.5],
      'icon-scale': 0.3

    }

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





    const snap = new Snap({ source: this.vectorSource });
    this.map.addInteraction(snap);

    this.addInteractions('Point');

    this.map.addLayer(this.vectorLayer);

    console.log(this.map)

    this.recoverMarkers()


  }


  //A: number[] | undefined
  //B: number[]
  //if(A !== undefined)
  //A: number[]

  private addMarker = (marker: Dibujo): void => {

    if (!marker.coordinates?.coordinatePoint) return;

    //contemplar el caso de marker.typeGeometry === LineString
    const startMarker = new Feature({
      type: 'point',
      geometry: new Point(marker.coordinates.coordinatePoint),
      id: marker.id
    });

    //https://openlayers.org/en/latest/apidoc/module-ol_geom_LineString-LineString.html

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




  addInteractions(typeDraw: any) {
    if (!this.map) return
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction)
    } else {
      const modify = new Modify({ source: this.vectorSource });
      modify.on('modifyend', (evt) => {


        let featureModified: Feature<Geometry> = evt.features.getArray()[0];
        console.log(this.vectorSource.getFeatures());
        let coordinate = featureModified.getGeometry()?.getExtent().slice(0, 2)
        console.log(coordinate)
        //console.log(featureModified.getProperties()["id"]);
        let idModified = featureModified.getProperties()["id"];

        let markers = this.MarkersService.obtenerMarkers();

        markers.forEach(dibujo => {
          if (dibujo.coordinates) {
            if (dibujo.id === idModified) {
              switch (dibujo.typeGeometry) {
                case "Point": {
                  dibujo.coordinates.coordinatePoint = coordinate;
                  break;
                }

                case "LineString": {
                  dibujo.coordinates.coordinateLineString = coordinate
                  break;

                }

              }

            }


          })

        this.MarkersService.guardarMarkers(markers)


      });
      this.map.addInteraction(modify);

    }





    this.drawInteraction = new Draw({
      source: this.vectorSource,
      type: typeDraw,
      stopClick: true,
      condition: (e) => noModifierKeys(e) && primaryAction(e),

    });

    this.drawInteraction.on('drawend', (evt: DrawEvent) => {
      console.log(evt)
      let drawnFeature = evt.feature

      let id = this.MarkersService.generateUniqueId();
      drawnFeature.set("id", id);

      let properties = drawnFeature.getProperties();
      this.MarkersService.inicializar(id, properties['geometry'].flatCoordinates, typeDraw);

    })
    this.map.addInteraction(this.drawInteraction);
  }



  recoverMarkers(): void {

    const markersRecuperados = this.MarkersService.obtenerMarkers();
    console.log(markersRecuperados);
    markersRecuperados.forEach((dibujo: Dibujo) => {
      /*
      ++ codigo mas corto, mas claro, separado por funcionalidad
      > cuidado de no replicar codigo: si hay cosas comunes, reutilitzarles
      op 2 - 1 metodo para cada dibujo. addMarker, addLinestring, ...
      */
      if (dibujo.typeGeometry === "Point") {
        this.addMarker(dibujo);

      }




    })

  }





}
