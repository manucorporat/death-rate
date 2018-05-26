import '@ionic/core';
import '@pro-webcomponents/core';

import { Component } from '@stencil/core';

@Component({
  tag: 'my-app',
})
export class MyApp {

  render() {
    return (
      <ion-app>
        <ion-router useHash={true}>
          <ion-route url='/death' component='death-page'></ion-route>
          <ion-route url='/mapa' component='map-page'></ion-route>
          <ion-route url='/quienes-somos' component='whoare-page'></ion-route>
          <ion-route url='/open-source' component='oss-page'></ion-route>
          <ion-route url='/ajustes' component='settings-page'></ion-route>
          <ion-route url='/intro' component='landing-page'></ion-route>
          <ion-route url='/data' component='settings-page'></ion-route>

        </ion-router>

        <ion-split-pane>
          <ion-menu type="overlay">
            <ion-header>
              <ion-toolbar color="danger">
                <ion-title>Death Rate</ion-title>
              </ion-toolbar>
            </ion-header>

            <ion-content main>
              <ion-list>
                <ion-menu-toggle autoHide={false}>
                  <ion-item href="#/death">Mi localización</ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle autoHide={false}>
                  <ion-item href="#/mapa">Mapa</ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle autoHide={false}>
                  <ion-item href="#/ajustes">Ajustes</ion-item>
                </ion-menu-toggle>
              </ion-list>

            </ion-content>
          </ion-menu>

          <ion-router-outlet main animated={false}></ion-router-outlet>
        </ion-split-pane>
      </ion-app>
    );
  }
}
