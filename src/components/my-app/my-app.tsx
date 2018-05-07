import '@ionic/core';
import '@pro-webcomponents/core';

import { Component } from '@stencil/core';

@Component({
  tag: 'my-app',
  styleUrl: 'my-app.scss'
})
export class MyApp {

  render() {
    return (
      <ion-app>

        <ion-menu>
          <ion-header>
            <ion-toolbar color="danger">
              <ion-title>hola</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content main>
            <ion-list>
              <ion-menu-toggle>
                <ion-item href="/death">Death Rate</ion-item>
              </ion-menu-toggle>

              <ion-item href="/mapa">Mapa</ion-item>
            </ion-list>
            hola
          </ion-content>
        </ion-menu>

        <ion-router useHash={false}>
          <ion-route-redirect from='/' to='/death'></ion-route-redirect>
          <ion-route url='/death' component='death-page'></ion-route>
          <ion-route url='/mapa' component='map-page'></ion-route>
          <ion-route url='/perfil' component='profile-page'></ion-route>
        </ion-router>

        <ion-nav></ion-nav>

      </ion-app>
    );
  }
}
