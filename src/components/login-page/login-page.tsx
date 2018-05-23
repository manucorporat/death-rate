import { Component, Element } from '@stencil/core';

@Component({
  tag: 'login-page',
  styleUrl: 'login-page.scss'
})
export class LoginPage {

  @Element() el: HTMLElement;

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

        <ion-button href={'#/profile/stencil'}>
          Profile page
        </ion-button>
      </ion-content>
    ];
  }
}
