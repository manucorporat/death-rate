import { Component, Element, State } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';

// declare var google: any;

@Component({
  tag: 'death-page',
  styleUrl: 'death-page.scss'
})
export class DeathPage {
  @Element() el: HTMLElement;

  @State() time = 0;
  @State() y = 350;

  // async componentWillLoad() {
  //   await getGoogleMaps('AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw');
  // }

  async componentDidLoad() {
    requestAnimationFrame(async () => {
      const googleMaps = await getGoogleMaps('AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw');
      const mapEle = this.el.querySelector('.map-canvas');
      new googleMaps.Map(mapEle, {
        zoom: 15,
        disableDefaultUI: true,
        center: {lat: 41.652251, lng: -4.7245321},
        styles: [
          {
              "stylers": [
                  {
                      "hue": "#B61530"
                  },
                  {
                      "saturation": 60
                  },
                  {
                      "lightness": -40
                  }
              ]
          },
          {
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "water",
              "stylers": [
                  {
                      "color": "#B61530"
                  }
              ]
          },
          {
              "featureType": "road",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {}
              ]
          },
          {
              "featureType": "road.local",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {
                      "lightness": 6
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {
                      "lightness": -25
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {
                      "lightness": -10
                  }
              ]
          },
          {
              "featureType": "transit",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {
                      "lightness": 70
                  }
              ]
          },
          {
              "featureType": "transit.line",
              "stylers": [
                  {
                      "color": "#B61530"
                  },
                  {
                      "lightness": 90
                  }
              ]
          },
          {
              "featureType": "administrative.country",
              "elementType": "labels",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit.station",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "color": "#ffffff"
                  }
              ]
          }
      ]
      });
      // requestAnimationFrame(() => {
      //   const mapEle = this.el.querySelector('.map-canvas');
      //   new google.maps.Map(mapEle, {
      //     center: {lat: -25.363, lng: 131.044}
      //   });
      // });
    });
  }
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
              <div class="score">120</div>
              <div class="line"></div>
            </div>
          </pro-glshader>
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

export function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const google = win.google;
  if (google && google.maps) {
    return Promise.resolve(google.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      const win = window as any;
      const google = win.google;
      if (google && google.maps) {
        resolve(google.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}