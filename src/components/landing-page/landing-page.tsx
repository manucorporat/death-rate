import { Component, Element, Listen, Prop } from '@stencil/core';
// import { Source } from '../../helpers/model';
// @ts-ignore
import plotty from 'plotty';
import { setSetting } from '../../helpers/model';

@Component({
  tag: 'landing-page',
  styleUrl: 'landing-page.scss'
})
export class LandingPage {

  @Element() el: HTMLElement;

  @Prop({connect: 'ion-menu-controller'}) menuCtrl: HTMLIonMenuControllerElement;

  @Listen('ionViewWillLeave')
  async ionViewWillLeave() {
    const menu = await this.menuCtrl.componentOnReady();
    menu.enable(true);
  }

  continue() {
    setSetting('logged_in', true);
    document.querySelector('my-app').forceUpdate();
  }

  render() {
    return [
      <ion-content scrollEnabled={false}>
        <img src="assets/landing.jpg"/>
        <h1 class="title">Death Rate</h1>
        <p class="message">
          Localiza a nivel global los lugares más peligrosos,
          averigua las micromuertes a tus al rededor y las de tus amigos!
        </p>
        <ion-button
          shape="round"
          fill="outline"
          size="large"
          color="light"
          expand="block"
          onClick={() => this.continue()}>Continuar</ion-button>
      </ion-content>
    ];
  }
}
