import { Component, Element, State } from '@stencil/core';
import { process, getCurrentCoord, insertQuery, Coord } from '../../helpers/model';
// @ts-ignore
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';
import { User } from '../../helpers/model';

declare var ol: any;

@Component({
  tag: 'death-page',
  styleUrl: 'death-page.scss'
})
export class DeathPage {
  @Element() el: HTMLElement;

  @State() time = 0;
  @State() y = 10;
  @State() score = 0;
  @State() address: any;

  async componentDidLoad() {
    const coord = await getCurrentCoord(0.1, 2);
    const raster = await process(SOURCES, coord, reduce);
    const media = average(raster);
    this.setScore(Math.floor(media));
    this.insertDeathRate(coord, media);
    this.updateAddress(coord);

    new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      controls: [],
      target: this.el.querySelector('.mapa'),
      view: new ol.View({
        center: ol.proj.fromLonLat([coord.log, coord.lat]),
        zoom: 15
      })
    });
  }

  async updateAddress(coord: Coord) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${coord.lat}&lon=${coord.log}&zoom=18`);
    const json = await res.json();
    this.address = json.address;
  }

  setScore(score: number) {
    this.score = score;
    this.y = score;
  }

  async insertDeathRate(coord : Coord, deathRate : number){
    const USER: User = {
      name: 'prueba',
      deathRate: deathRate,
      coord: coord
    }
    insertQuery("/geoserver", USER);
  }

  render() {
    requestAnimationFrame((t) => {
      this.time = t;
    });
    const a = Math.sin(this.time*0.001)*20.0 + this.y;

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
          <ion-title>Tu localización</ion-title>
        </ion-toolbar>
        {this.address && <ion-toolbar color='danger'>
          <div class='address'>
              <p>{this.address.road}</p>
              <p>{this.address.county}, {this.address.postcode}</p>
              <p>{this.address.country}</p>
          </div>
        </ion-toolbar>}
      </ion-header>,

      <ion-content scrollEnabled={false}>
        <div class="mapa"></div>
        <pro-glshader
          class="blood-shader"
          frag={WAVE_SHADER}
          uniforms={{
              '1f:u_time': this.time,
              '1f:u_y': this.y
          }}>
          <div class='rate' style={{transform: `translateY(-${a}px`}}>
            <div class="line"></div>
            <div class="score">{this.score}</div>
          </div>
        </pro-glshader>
      </ion-content>
    ];
  }
}

export function average(raster: Float32Array) {
  return raster.reduce((v, acum) => acum + v, 0) / raster.length
}

const WAVE_SHADER = `
precision highp float;
uniform float u_time;
uniform float u_y;

void main() {
    float a = sin(u_time*0.001 + gl_FragCoord.x * 0.004)*20.0 + u_y;
    if(gl_FragCoord.y < a) {
      gl_FragColor = vec4(0.945, 0.255, 0.251, 0.8);
    } else {
      gl_FragColor = vec4(0.945, 0.255, 0.251, 0.5);
    }
}
`;
