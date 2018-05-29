import { Component, Element, Prop, Listen, State } from '@stencil/core';
// @ts-ignore
import { plot } from 'plotty';
import { getCurrentCoord, calculateCoverage, getExtends, Coord, average, User, getUser } from '../../helpers/model';
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Vector from 'ol/source/Vector';
import {default as VectorLayer} from 'ol/layer/Vector';
import { requestQueryUsers, requestCoordForName } from '../../helpers/requests';

const SIZE = 300;

const ICON_STYLE = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: 'assets/skull.png'
  })
});

@Component({
  tag: 'map-page',
  styleUrl: 'map-page.scss'
})
export class MapPage {

  private map: any;
  private Image: any;
  private ImageStatic: any;
  private layer: any;
  private proj: any;
  private vectorSource: any;

  @Element() el: HTMLElement;

  @Prop({connect: 'ion-loading-controller'}) loadingCtrl: HTMLIonLoadingControllerElement;

  @State() time = 0;
  @State() y = 0;
  @State() score = 0;
  @State() address: any;
  @State() hiddenRefresh = false;

  @Listen('keydown.enter')
  async onSearch(ev: any) {
    const value = (ev.target.value as string).trim();
    if(value.length > 0) {
      const r = await requestCoordForName(value);
      if(r) {
        const view = this.map.getView();
        const [latMin, latMax, lonMin, lonMax] = r.boundingbox;
        const box = [parseFloat(lonMin), parseFloat(latMin), parseFloat(lonMax), parseFloat(latMax)];
        const extend = this.proj.transformExtent(box, 'EPSG:4326', 'EPSG:3857');
        view.fit(extend, {duration: 300});
      }
    }
  }

  async componentDidLoad() {
    const [coord] = await Promise.all([
      await getCurrentCoord(20, SIZE),
      await this.loadMap()
    ]);

    const view = this.map.getView();
    view.setCenter(this.proj.fromLonLat([
      coord.log,
      coord.lat
    ]));

    const user = getUser(100, coord);
    const markers = await requestQueryUsers(user);
    markers.forEach(mark => this.addMarker(mark));
  }

  async loadMap() {
    const element = this.el.querySelector('.mapa');
    const { Map, Tile, OSM, View, Image, ImageStatic, proj } = await import('../../helpers/maps');

    this.proj = proj;
    this.Image = Image;
    this.ImageStatic = ImageStatic;
    this.vectorSource = new Vector({features: []});

    const map = this.map = new Map({
      layers: [
        new Tile({ source: new OSM() }),
        new VectorLayer({ source: this.vectorSource })
      ],
      target: element,
      view: new View({
        center: proj.fromLonLat([
          -4.7061376,
          41.662351099999995
        ]),
        zoom: 5
      })
    });
    map.on('movestart', () => {
      this.hiddenRefresh = false;
      this.setScore(0);
    });
    map.on('click', (evt: any) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        this.setScore(feature.getProperties().deathRate);
      }
    });
  }

  async updateHeatmap() {
    const view = this.map.getView();
    const center = this.proj.toLonLat(view.getCenter());
    const extend = view.calculateExtent(this.map.getSize());
    const box = this.proj.transformExtent(extend, 'EPSG:3857', 'EPSG:4326');

    const angle = Math.max(
      box[2] - box[0],
      box[3] - box[1]
    );
    this.computeHeatmap({
      log: center[0],
      lat: center[1],
      angle: angle / 2.0,
      resolution: 300,
    });
    this.hiddenRefresh = true;
  }

  async computeHeatmap(coord: Coord) {
    const loading = await this.loadingCtrl.create({
      content: 'generando heatmap...'
    });
    await loading.present();
    const canvas = this.el.querySelector('canvas');
    const raster = await calculateCoverage(SOURCES, coord, reduce);
    const min = Math.min(...raster);
    const max = Math.max(...raster);
    this.setScore(average(raster));

    const render = new plot({
      canvas: canvas,
      data: raster,
      width: SIZE,
      height: SIZE,
      domain: [min, max],
      colorScale: 'magma'
    });
    render.render();

    requestAnimationFrame(() => {
      const dataURL = canvas.toDataURL();

      var extent = getExtends(coord)
      const imageLayer = new this.Image({
        source: new this.ImageStatic({
          url: dataURL,
          projection: 'EPSG:4326',
          imageExtent: extent as any
        }),
        opacity: 0.8
      });
      if (this.layer) {
        this.map.removeLayer(this.layer);
      }
      this.layer = imageLayer;
      this.map.addLayer(imageLayer);
      loading.dismiss();
    });
  }

  private addMarker(user: User) {
    const iconFeature = new Feature({
      geometry: new Point(this.proj.fromLonLat([user.coord.log, user.coord.lat])),
      name: user.username,
      deathRate: user.deathRate,
    });
    iconFeature.setStyle([ICON_STYLE]);

    this.vectorSource.addFeature(iconFeature);
  }

  private setScore(score: number) {
    this.y = this.score = Math.floor(score);
  }

  render() {
    const y = (this.y === 0) ? -100 : this.y;
    return [
      <ion-header>
        <ion-toolbar color='dark'>
          <ion-buttons slot="start">
            <ion-menu-toggle>
              <ion-button>
                <ion-icon name="menu" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-menu-toggle>
          </ion-buttons>
          <ion-title>Heat Map</ion-title>
        </ion-toolbar>
        <ion-toolbar color='dark'>
          <ion-searchbar/>
        </ion-toolbar>
      </ion-header>,

      <ion-content scrollEnabled={false}>
        <img class="wait-meme" src="assets/wait.svg"/>
        <div class="mapa"/>
        <canvas/>
        <div class='rate' style={{transform: `translateY(${-y}px`}}>
          <div class="line"></div>
          <div class="score">{this.score}</div>
        </div>
        <ion-fab horizontal="center" vertical="bottom" slot="fixed" class={{
          'refresh-fab': true,
          'hidden-fab': this.hiddenRefresh
          }}>
          <ion-fab-button color="light" onClick={this.updateHeatmap.bind(this)}>
            <ion-icon name="refresh"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    ];
  }
}
