import { Component, Element } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';

@Component({
  tag: 'map-page',
  styleUrl: 'map-page.scss'
})
export class MapPage {

  @Element() el: HTMLElement;

  render() {
    return [
      <ion-header>
        <ion-toolbar color='danger'>
          <ion-title>Heat Map</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

      </ion-content>
    ];
  }
}
