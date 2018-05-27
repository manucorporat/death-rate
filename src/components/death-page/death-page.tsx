import { Component, Element, State, Prop } from '@stencil/core';
import { calculateCoverage, getCurrentCoord, insertQuery, Coord, average, getSetting } from '../../helpers/model';
import { SOURCES } from '../../helpers/sources';
import { reduce } from '../../helpers/formula';
import { User } from '../../helpers/model';
import { WAVE_SHADER } from '../../helpers/shader';

@Component({
  tag: 'death-page',
  styleUrl: 'death-page.scss'
})
export class DeathPage {
  private map: any;
  private proj: any;

  @Element() el: HTMLElement;

  @State() time = 0;
  @State() y = 10;
  @State() score = 0;
  @State() address: any;

  @Prop({connect: 'ion-loading-controller'}) loadingCtrl: HTMLIonLoadingControllerElement;

  async componentDidLoad() {
    const loading = await this.loadingCtrl.create({
      content: 'localizando...'
    });

    await loading.present();

    const {Map, Tile, OSM, View, proj} = await import('../../helpers/maps');
    this.proj = proj;
    this.map = new Map({
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      controls: [],
      target: this.el.querySelector('.mapa'),
      view: new View({
        center: proj.fromLonLat([
          -4.7061376,
          41.662351099999995
        ]),
        zoom: 15
      })
    });

    const coord = await getCurrentCoord(0.1, 2);
    const raster = await calculateCoverage(SOURCES, coord, reduce);
    const media = average(raster);
    this.setScore(media);
    this.insertDeathRate(coord, media);
    this.updateAddress(coord);

    await loading.dismiss();
  }

  async updateAddress(coord: Coord) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${coord.lat}&lon=${coord.log}&zoom=18`);
    const json = await res.json();
    this.address = json.address;
    const view = this.map.getView();
    view.setCenter(this.proj.fromLonLat([
      coord.log,
      coord.lat
    ]));
  }

  setScore(score: number) {
    this.y = this.score = Math.floor(score);
  }

  async insertDeathRate(coord : Coord, deathRate : number){
    const USER: User = {
      name: getSetting('nombre') || 'unknown',
      deathRate: deathRate,
      coord: coord
    }
    insertQuery("/geoserver", USER);
  }

  render() {
    if(this.score > 0) {
      requestAnimationFrame((t) => {
        this.time = t;
      });
    }

    const a = Math.sin(this.time*0.001)*20.0 + this.y;

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
          <ion-title>Tu localización</ion-title>
        </ion-toolbar>
        {this.address && <ion-toolbar color='dark'>
          <div class='address'>
              <p>{this.address.road}</p>
              <p>{this.address.county}, {this.address.postcode}</p>
              <p>{this.address.country}</p>
          </div>
        </ion-toolbar>}
      </ion-header>,

      <ion-content scrollEnabled={false}>
        <div class="mapa"></div>
        {this.score > 0 &&
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
          </pro-glshader>}
      </ion-content>
    ];
  }
}
