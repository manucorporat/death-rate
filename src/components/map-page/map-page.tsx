import { Component, Element, Prop, Listen, State } from '@stencil/core';
// @ts-ignore
import { plot } from 'plotty';
import { getCurrentCoord, process, getExtends, Coord } from '../../helpers/model';
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';

declare var ol: any;

const SIZE = 300;
@Component({
  tag: 'map-page',
  styleUrl: 'map-page.scss'
})
export class MapPage {

  private map: any;
  private layer: any;
  @State() hiddenRefresh = false;

  @Prop({connect: 'ion-loading-controller'}) loadingCtrl: HTMLIonLoadingControllerElement;
  @Element() el: HTMLElement;

  async componentDidLoad() {
    const coord = await getCurrentCoord(20, SIZE);
    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: this.el.querySelector('.mapa'),
      view: new ol.View({
        center: ol.proj.fromLonLat([coord.log, coord.lat]),
        zoom: 5
      })
    });
    this.map.on('movestart', () => {
      this.hiddenRefresh = false;
    })
  }

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
        const extend = ol.proj.transformExtent(box, 'EPSG:4326', 'EPSG:3857');
        view.fit(extend, {duration: 300});
      }
    }
  }

  async updateMap() {
    const view = this.map.getView();
    const center = ol.proj.toLonLat(view.getCenter());
    const extend = view.calculateExtent(this.map.getSize());
    const box = ol.proj.transformExtent(extend, 'EPSG:3857', 'EPSG:4326');

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
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const canvas = this.el.querySelector('canvas');
    const raster = await process(SOURCES, coord, reduce);
    const min = Math.min(...raster);
    const max = Math.max(...raster);

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
      const imageLayer = new ol.layer.Image({
        source: new ol.source.ImageStatic({
          url: dataURL,
          projection: 'EPSG:4326',
          imageExtent: extent
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

  render() {
    return [
      <ion-header>
        <ion-toolbar color='danger'>
          <ion-buttons slot="start">
            <ion-menu-toggle>
              <ion-button>
                <ion-icon name="menu" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-menu-toggle>
          </ion-buttons>
          <ion-title>Heat Map</ion-title>
        </ion-toolbar>
        <ion-toolbar color="danger">
          <ion-searchbar/>
        </ion-toolbar>
      </ion-header>,

      <ion-content scrollEnabled={false}>
        <div class="mapa"/>
        <canvas/>
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
