import { Component, Input, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Modify, Snap, } from 'ol/interaction.js';
import Draw, { DrawEvent } from 'ol/interaction/Draw';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { Feature } from 'ol';
import { Geometry, LineString, Point, Polygon } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Dibujo } from '../../interfaces/dibujo.interface';
import { MarkersService } from '../../services/markers.service';
import { noModifierKeys, primaryAction } from 'ol/events/condition';
import { Coordinates } from '../../interfaces/coordinates.interface';
import { Subscription } from 'rxjs';



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

    if (changes['dibujoACentrar'] && this.map) {
      console.log(changes['dibujoACentrar'])
      let dibujo = changes['dibujoACentrar'].currentValue

      //opcio 2
      //fit(geometry)
      //cal creare la geometry des d'un dibujo


      /*
      changes? -> changes['newCenter']
      changes -> changes['dibujo']!!!!!!
      */

      //dibujo?

      //new Point(dibujo.coordinates.coordinatePoint)


      //new LineString(dibujo.coordinates.coordinateLineString)

      //const geometry = Hem de fer codi per assignar geometria

      let geometry;

      if (dibujo.typeGeometry === "Point") {
        geometry = new Point(dibujo.coordinates.coordinatePoint)
      }

      if (dibujo.typeGeometry === "LineString") {
        geometry = new LineString(dibujo.coordinates.coordinateLineString)
      }

      if (dibujo.typeGeometry === "Polygon") {
        geometry = new Polygon(dibujo.coordinates.coordinatePolygon)
      }



      if (geometry) {
        this.map.getView().fit(geometry, { maxZoom: 18, padding: [120, 120, 120, 120] })
      }


      //  this.map.getView().fit()
    } else if (changes['temporaryMarkerToRemove'] && this.map) {

      let dibujo = changes['temporaryMarkerToRemove'].currentValue;
      let features = this.vectorSource.getFeatures()

      features.forEach((feature: Feature) => {
        let featureId = feature.getProperties()["id"];
        if (featureId === dibujo.id) {
          this.vectorSource.removeFeature(feature);
        }
      })

    }

    
  }


  @Input() public temporaryMarkerToRemove: Dibujo = { id: 0 };
  @Input() public dibujoACentrar: Dibujo = { id: 0 };



  public activeTool: string | null = null;
  private dibujoSubscription!: Subscription;

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

    this.dibujoSubscription = this.MarkersService
    .obtenerSubscripcionDibujos()
    .subscribe((dibujosActualizados) => {
      //recuperar las features
      let features = this.vectorSource.getFeatures()
      //por cada feature, actualizar la description

      dibujosActualizados.forEach((dibujoActualizado:Dibujo)=>{
        this.actualizarDescripcionDeFeature(features, dibujoActualizado)

      })
    });
  }

  private actualizarDescripcionDeFeature = (features: Feature[], dibujoActualizado: Dibujo): void => {
    features.forEach((feature: Feature)=>{
      let featureId = feature.getProperties()["id"];
      if(featureId === dibujoActualizado.id){
         feature.set("description", dibujoActualizado.description)
      }
    })
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
      id: marker.id,
      description: marker.description
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
    // console.log('Marcadores:', marker);
  }

  private addLineString = (lineString: Dibujo): void => {

    if (!lineString.coordinates?.coordinateLineString) return;

    //contemplar el caso de marker.typeGeometry === LineString
    const line = new Feature({
      type: 'lineString',
      geometry: new LineString(lineString.coordinates.coordinateLineString),
      id: lineString.id,
      description: lineString.description
    });

    //https://openlayers.org/en/latest/apidoc/module-ol_geom_LineString-LineString.html

    this.vectorSource.addFeature(line);
    //console.log('Marcadores:', this.markers);
  }


  private addPolygon = (polygon: Dibujo): void => {

    if (!polygon.coordinates?.coordinatePolygon) return;

    //contemplar el caso de marker.typeGeometry === LineString
    const polygonDraw = new Feature({
      type: 'polygon',
      geometry: new Polygon(polygon.coordinates.coordinatePolygon),
      id: polygon.id,
      description: polygon.description
    });

    //https://openlayers.org/en/latest/apidoc/module-ol_geom_LineString-LineString.html

    this.vectorSource.addFeature(polygonDraw);
    //console.log('Marcadores:', this.markers);
  }


  addInteractions(typeDraw: any) {
    if (!this.map) return
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction)
      this.activeTool = null
    } else {
      const modify = new Modify({ source: this.vectorSource });
      modify.on('modifyend', (evt) => {


        let featureModified: Feature<Geometry> = evt.features.getArray()[0];
        let geometry = featureModified.getGeometry();
        let coordinates: Coordinates = {};
        if (geometry instanceof Point) {
          coordinates.coordinatePoint = geometry.getCoordinates()
        }

        if (geometry instanceof LineString) {
          coordinates.coordinateLineString = geometry.getCoordinates()
        }

        if (geometry instanceof Polygon) {
          coordinates.coordinatePolygon = geometry.getCoordinates()
        }

        console.log(featureModified.getGeometry())
        //console.log(featureModified.getProperties()["id"]);
        let idModified = featureModified.getProperties()["id"];

        let markers = this.MarkersService.obtenerMarkers();

        markers.forEach(dibujo => {

          if (dibujo.id === idModified) {
            dibujo.coordinates = coordinates;

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

      let geometry = drawnFeature.getGeometry();

      let coordinates: Coordinates = {};

      if (geometry instanceof Point) {
        coordinates.coordinatePoint = geometry.getCoordinates()
      }

      if (geometry instanceof LineString) {
        coordinates.coordinateLineString = geometry.getCoordinates()
      }

      if (geometry instanceof Polygon) {
        coordinates.coordinatePolygon = geometry.getCoordinates()
      }

      this.MarkersService.inicializar(id, coordinates, typeDraw);

    })
    this.map.addInteraction(this.drawInteraction);
    this.activeTool = typeDraw
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

      console.log(dibujo.description)
      if (dibujo.typeGeometry === "Point") {
        this.addMarker(dibujo);
      }

      if (dibujo.typeGeometry === "LineString") {
        this.addLineString(dibujo);
      }

      if (dibujo.typeGeometry === "Polygon") {
        this.addPolygon(dibujo)
      }
    })

  }


  downloadGeoJSON() {

    const geoJSONGenerado = new GeoJSON().writeFeatures(this.vectorSource.getFeatures())

    const newBlob = new Blob([geoJSONGenerado], { type: "text/json" });
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement("a");
    link.href = data;
    link.download = "BitacoraMap.geojson"; // set a name for the file
    link.click();
    console.log(geoJSONGenerado);
  }

}
