import { Component, Element, Prop, Listen, State } from '@stencil/core';
// @ts-ignore
import { plot } from 'plotty';
import { getCurrentCoord, calculateCoverage, getExtends, Coord, average } from '../../helpers/model';
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';

const SIZE = 300;

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
      const res = await fetch(`https://nominatim.openstreetmap.org/search/${value}?format=json&addressdetails=1&limit=1`);
      const results = await res.json();
      if(results.length > 0) {
        const r = results[0];
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
  }

  async loadMap() {
    const { Map, Tile, OSM, View, Image, ImageStatic, proj } = await import('../../helpers/maps');
    this.proj = proj;
    this.Image = Image;
    this.ImageStatic = ImageStatic;
    this.map = new Map({
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      target: this.el.querySelector('.mapa'),
      view: new View({
        center: proj.fromLonLat([
          -4.7061376,
          41.662351099999995
        ]),
        zoom: 5
      })
    });
    this.map.on('movestart', () => {
      this.hiddenRefresh = false;
      this.setScore(0);
    });
  }

  async updateMap() {
    const view = this.map.getView();
    const center = this.proj.toLonLat(view.getCenter());
    const extend = view.calculateExtent(this.map.getSize());
    const box = this.proj.transformExtent(extend, 'EPSG:3857', 'EPSG:4326');

    const angle = Math.max(
      box[2] - box[0],
      box[3] - box[1]
    );
    this.recompute({
      log: center[0],
      lat: center[1],
      angle: angle / 2.0,
      resolution: 300,
    });
    this.hiddenRefresh = true;
  }

  async recompute(coord: Coord) {
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
      colorScale: "magma"
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

  setScore(score: number) {
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
          <ion-fab-button color="light" onClick={this.updateMap.bind(this)}>
            <ion-icon name="refresh"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    ];
  }
}
