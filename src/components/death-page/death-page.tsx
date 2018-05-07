import { Component, Element, State } from '@stencil/core';
import { process, getCurrentCoord, insertQuery, Coord } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';
import { SOURCES } from '../../helpers/sources';
import { setGoogleMaps } from '../../helpers/google-maps';
import { reduce } from '../../helpers/formula';
import { User } from '../../helpers/model';
// declare var google: any;

@Component({
  tag: 'death-page',
  styleUrl: 'death-page.scss'
})





export class DeathPage {
  @Element() el: HTMLElement;

  @State() time = 0;
  @State() y = 350;
  @State() score = 0;

  async componentDidLoad() {
    const coord = await getCurrentCoord(20, 2);
    setGoogleMaps(this.el.querySelector('.map-canvas'), coord);

    const raster = await process(SOURCES, coord, reduce);
    const media = average(raster);
    const min = Math.min(...raster);
    const max = Math.max(...raster);

    const render = new plotty.plot({
      canvas: this.el.querySelector('canvas'),
      data: raster,
      width: 2, height: 2,
      domain: [min, max],
      colorScale: "greys"
    });
    render.render();
    this.score = Math.floor(media);
    console.log(media);
    this.insertDeathRate(coord, media);
  }

  async insertDeathRate(coord : Coord, deathRate : number){
    const USER: User = {
      name: 'prueba',
      deathRate: deathRate,
      coord: coord
    }
    insertQuery("https://itastdevserver.tel.uva.es/geoserver/", USER);
  }

  render() {
    requestAnimationFrame((t) => {
      this.time = t;
    });
    return [
      <ion-header>
        <ion-toolbar color='danger'>
          <ion-title>Tu localización</ion-title>
        </ion-toolbar>
        <ion-toolbar color='danger'>
          <div class='address'>
              <p>Paseo del Cauce</p>
              <p>Valladoid, 47003</p>
              <p>España</p>
          </div>
        </ion-toolbar>
      </ion-header>,

      <ion-content scrollEnabled={false}>
        <div class="map-canvas"></div>
        <pro-glshader
          class="blood-shader"
          frag={WAVE_SHADER}
          uniforms={{
              '1f:u_time': this.time,
              '1f:u_y': this.y
          }}>
          <div class='rate'>
            <div class="line"></div>
            <div class="score">{this.score}</div>
            <div class="line"></div>
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
      gl_FragColor = vec4(0.6, 0, 0, 0);
    }
}
`;
