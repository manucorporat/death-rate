import { Component, Element } from '@stencil/core';

@Component({
  tag: 'oss-page',
  styleUrl: 'oss-page.scss'
})
export class OSSPage {

  @Element() el: HTMLElement;

  render() {
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
          <ion-title>Open Source</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>

      </ion-content>
    ];
  }
}
