import { Component, Element } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';

@Component({
  tag: 'login-page',
  styleUrl: 'login-page.scss'
})
export class LoginPage {

  @Element() el: HTMLElement;

  // async componentDidLoad() {
  //   const sources: Source[] = [
  //     {
  //       name: 'volcanes',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-volcano-mortality-risks-distribution'
  //     },
  //     {
  //       name: 'corrimiento',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-landslide-mortality-risks-distribution'
  //     },
  //     {
  //       name: 'Inundaciones',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-flood-mortality-risks-distribution',
  //     },
  //     {
  //       name: 'Terremotos',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-earthquake-mortality-risks-distribution'
  //     },
  //     {
  //       name: 'Sequías',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-drought-mortality-risks-distribution'
  //     },
  //     {
  //       name: 'Ciclones',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'ndh:ndh-cyclone-mortality-risks-distribution'
  //     },
  //     {
  //       name: 'Malnutricion infantil',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'povmap:povmap-global-subnational-prevalence-child-malnutrition'
  //     },
  //     {
  //       name: 'Mortalidad infantil',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'povmap:povmap-global-subnational-infant-mortality-rates_2000'
  //     },
  //     {
  //       name: 'Temp Max',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'sdei:sdei-global-summer-lst-2013_day-max-global'
  //     },
  //     {
  //       name: 'Temp Min',
  //       url: 'http://sedac.ciesin.org/geoserver/ows',
  //       coverage: 'sdei:sdei-global-summer-lst-2013_night-min-global'
  //     }
  //   ];

  //   const coord = {
  //     lat: 41.6623241,
  //     log: -4.7059912,
  //     angle: 20,
  //     resolution: 320
  //   };
  //   // const coord = {
  //   //   lat: -7,
  //   //   log: 112,
  //   //   angle: 2,
  //   //   resolution: 320
  //   // };
  //   // const coord = {
  //   //   lat: 0,
  //   //   log: 0,
  //   //   angle: 20,
  //   //   resolution: 320
  //   // };

  //   // const raster = await process(sources, coord, reduce);
  //   // const media = average(raster);

  //   // const min = Math.min(...raster);
  //   // const max = Math.max(...raster);

  //   // const render = new plotty.plot({
  //   //   canvas: this.el.querySelector('canvas'),
  //   //   data: raster,
  //   //   width: 320, height: 320,
  //   //   domain: [min, max], colorScale: "greys"
  //   // });
  //   // render.render();
  //   // console.log(media);
  // }

  render() {
    return [
        <ion-header>
          <ion-toolbar color='danger'>
            <ion-title>Death Rate</ion-title>
          </ion-toolbar>
        </ion-header>,

        <ion-content>
          <p>
            Welcome to the Ionic PWA Toolkit.
            You can use this starter to build entire PWAs all with
            web components using Stencil and ionic/core! Check out the readme for everything that comes in this starter out of the box and
            Check out our docs on <a href='https://stenciljs.com'>stenciljs.com</a> to get started.
          </p>

          <canvas></canvas>

          <ion-button href={'/profile/stencil'}>
            Profile page
          </ion-button>
        </ion-content>
    ];
  }
}

export function reduce(i,
  volcanes, corrimientos, inundaciones, terremotos, sequias, ciclones,
  malnutricion, mortalidad, tempMax, tempMin
) {
  return (
    Math.exp(volcanes[i] * 1.6 - 5) +
    Math.exp(corrimientos[i] * 1.6 - 5) +
    Math.exp(inundaciones[i] * 1.6 - 5) +
    Math.exp(terremotos[i] * 1.6 - 5) +
    Math.exp(sequias[i] * 1.6 - 5) +
    Math.exp(ciclones[i] * (16/3.0) - 5) +

    malnutricion[i] * 17000 +
    mortalidad[i] * 12500 +

    Math.abs(Math.pow((tempMax[i] - 24) / 1.7, 3)) +
    Math.abs(Math.pow((tempMin[i] - 15) / 1.7, 3))
  );
}


export function average(raster: Float32Array) {
  return raster.reduce((v, acum) => acum + v, 0) / raster.length
}
