import { Component, Element } from '@stencil/core';

@Component({
  tag: 'whoare-page',
  styleUrl: 'whoare-page.scss'
})
export class WhoArePage {

  @Element() el: HTMLElement;

  render() {
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
          <ion-title>Quienes somos</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

      </ion-content>
    ];
  }
}
