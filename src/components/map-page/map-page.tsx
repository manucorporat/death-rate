import { Component, Element } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';
import { getCurrentCoord, process, getExtends, Coord } from '../../helpers/model';
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';

declare var ol: any;
// declare var OffscreenCanvas: any;
const SIZE = 300;
@Component({
  tag: 'map-page',
  styleUrl: 'map-page.scss'
})
export class MapPage {

  private map: any;

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

    this.recompute(coord);
  }

  async recompute(coord: Coord) {
    const canvas = this.el.querySelector('canvas');
    const raster = await process(SOURCES, coord, reduce);
    const min = Math.min(...raster);
    const max = Math.max(...raster);

    const render = new plotty.plot({
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
      this.map.addLayer(imageLayer);
    });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='danger'>
          <ion-title>Heat Map</ion-title>
        </ion-toolbar>
        <ion-toolbar color="danger">
          <ion-searchbar/>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <div class="mapa"/>
        <canvas/>
      </ion-content>
    ];
  }
}
