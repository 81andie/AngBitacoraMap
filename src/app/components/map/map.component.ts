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
import { DibujosService } from '../../services/dibujos.service';
import { noModifierKeys, primaryAction } from 'ol/events/condition';
import { Coordinates } from '../../interfaces/coordinates.interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})


export class MapComponent implements OnInit, OnChanges {

  constructor(private DibujosService: DibujosService) { }
  ngOnChanges(changes: SimpleChanges): void {
    /*la variable changes puede contener o bien  temporaryMarkerToRemove o bien
   dibujoACentrar
    */
    if (changes['dibujoACentrar'] && this.map) {

      let dibujo = changes['dibujoACentrar'].currentValue
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

    } else if (changes['temporaryDibujoToRemove'] && this.map) {

      let dibujo = changes['temporaryDibujoToRemove'].currentValue;
      let features = this.vectorSource.getFeatures()

      features.forEach((feature: Feature) => {
        let featureId = feature.getProperties()["id"];
        if (featureId === dibujo.id) {
          this.vectorSource.removeFeature(feature);
        }
      })
    }
  }


  @Input() public temporaryDibujoToRemove: Dibujo = { id: 0 };
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

    this.recoverDibujos()

    this.dibujoSubscription = this.DibujosService
      .obtenerSubscripcionDibujos()
      .subscribe((dibujosActualizados) => {
        //recuperar las features
        let features = this.vectorSource.getFeatures()
        //por cada feature, actualizar la description

        dibujosActualizados.forEach((dibujoActualizado: Dibujo) => {
          this.actualizarDescripcionDeFeature(features, dibujoActualizado)

        })
      });
  }

  private actualizarDescripcionDeFeature = (features: Feature[], dibujoActualizado: Dibujo): void => {
    features.forEach((feature: Feature) => {
      let featureId = feature.getProperties()["id"];
      if (featureId === dibujoActualizado.id) {
        feature.set("description", dibujoActualizado.description)
      }
    })
  }



  private addDibujo = (dibujo: Dibujo): void => {

    if (!dibujo.coordinates?.coordinatePoint) return;

    //contemplar el caso de marker.typeGeometry === LineString
    const startDibujo = new Feature({
      type: 'point',
      geometry: new Point(dibujo.coordinates.coordinatePoint),
      id: dibujo.id,
      description: dibujo.description
    });

  
    startDibujo.setStyle(new Style({
      image: new Icon({
        anchor: [0.6, 0.5],
        src: './assets/marker.png',
        scale: 0.3
      })
    }))

    this.vectorSource.addFeature(startDibujo);

  }

  private addLineString = (lineString: Dibujo): void => {

    if (!lineString.coordinates?.coordinateLineString) return;


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

        let dibujos = this.DibujosService.obtenerDibujos();

        dibujos.forEach(dibujo => {

          if (dibujo.id === idModified) {
            dibujo.coordinates = coordinates;

          }


        })

        this.DibujosService.guardarDibujos(dibujos)


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

      let id = this.DibujosService.generateUniqueId();
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

      this.DibujosService.inicializar(id, coordinates, typeDraw);

    })
    this.map.addInteraction(this.drawInteraction);
    this.activeTool = typeDraw
  }



  recoverDibujos(): void {
    const dibujosRecuperados = this.DibujosService.obtenerDibujos();
    console.log(dibujosRecuperados);
    dibujosRecuperados.forEach((dibujo: Dibujo) => {
      /*
      ++ codigo mas corto, mas claro, separado por funcionalidad
      > cuidado de no replicar codigo: si hay cosas comunes, reutilitzarles
      op 2 - 1 metodo para cada dibujo. addMarker, addLinestring, ...


      */

      console.log(dibujo.description)
      if (dibujo.typeGeometry === "Point") {
        this.addDibujo(dibujo);
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


  upLoadGeoJSON(event: Event) {

    let contingut = "";

    //Objeto FileReader
    let fileReader = new FileReader();

    //Nos quedamos esperando que se ejecute el "load" del fichero.
    //Se ejecutará esta funcion.
    fileReader.onload = (e) => {
      contingut = (fileReader.result as string)//se ejecuta cuando se ha hecho "load"
      this.procesarFicheroJson(contingut)

    }


    if (event.target) {
      let target = (event.target as HTMLInputElement)
      if (target.files) {
        fileReader.readAsText(target.files[0])// aqui es donde le dices: este es el archivo a leer.
      }
    }

  }

  procesarFicheroJson(archivo: string) {
    this.vectorSource.clear();
    console.log(this.vectorSource.features)

    const featuresImportadas = new GeoJSON().readFeatures(archivo)
    this.vectorSource.addFeatures(featuresImportadas);

    let dibujos = featuresImportadas.map((feature) => {
      return this.transformarFeatureADibujo(feature)
    })

    this.DibujosService.guardarDibujos(dibujos)


  }

  transformarFeatureADibujo(feature: Feature) {


    let geometry = feature.getGeometry();

    let coordinates: Coordinates = {};
    let typeGeometry: "Point" | "LineString" | "Polygon" | "" = ""
    // typeGeometry se infiere que es de tipo string.
    // typeGeometry debe contener 1 de las 3 palabras siguientes: Point, LineString, Polygon

    if (geometry instanceof Point) {
      coordinates.coordinatePoint = geometry.getCoordinates()
      typeGeometry = "Point"
    }

    if (geometry instanceof LineString) {
      coordinates.coordinateLineString = geometry.getCoordinates()
      typeGeometry = "LineString"
    }

    if (geometry instanceof Polygon) {
      coordinates.coordinatePolygon = geometry.getCoordinates()
      typeGeometry = "Polygon"
    }
    //
    const dibujo: Dibujo = {
      id: feature.getProperties()["id"],
      coordinates: coordinates,
      typeGeometry: typeGeometry,
      description: feature.getProperties()["description"],
    };

    return dibujo;
  }
}
