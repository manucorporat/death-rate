import { Component, Element } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss'
})
export class LandingPage {

  @Element() el: HTMLElement;

  render() {
    return [
      <ion-header>
        <ion-toolbar color='danger'>
          <ion-title>Landing</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

      </ion-content>
    ];
  }
}
