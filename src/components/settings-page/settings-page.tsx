import { Component, Element, State, Watch } from '@stencil/core';
import { getSetting, setSetting } from '../../helpers/model';

@Component({
  tag: 'settings-page',
  styleUrl: 'settings-page.scss'
})
export class SettingsPage {

  @Element() el: HTMLElement;

  @State() nombre: string = getSetting('nombre');
  @State() apellidos: string = getSetting('apellidos');
  @State() genero: string = getSetting('genero');
  @State() fechaNacimiento: string = getSetting('fechaNacimiento');
  @State() altura: number = getSetting('altura');
  @State() peso: number = getSetting('peso');

  @Watch('nombre')
  @Watch('genero')
  @Watch('fechaNacimiento')
  @Watch('altura')
  @Watch('peso')
  valueChanged(newValue: any, _, propName: string) {
    setSetting(propName, newValue);
  }

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
          <ion-title>Ajustes</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label position="floating">Nombre Completo</ion-label>
            <ion-input value={this.nombre} onIonChange={(ev) => this.nombre = ev.detail.value}></ion-input>
          </ion-item>

          <ion-item>
            <ion-label>Genero</ion-label>
            <ion-select value={this.genero} onIonChange={(ev) => this.genero = ev.detail.value as string}>
              <ion-select-option>Hombre</ion-select-option>
              <ion-select-option>Mujer</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label>Fecha de nacimiento</ion-label>
            <ion-datetime></ion-datetime>
          </ion-item>

          <ion-item>
            <ion-range min={100} max={230} pin={true} value={this.altura} onIonChange={(ev) => this.altura = ev.detail.value}>
              <div slot="start" class="range-label">Altura</div>
              <div slot="end" class="range-value">{this.altura} cm</div>
            </ion-range>
          </ion-item>

          <ion-item>
            <ion-range min={20} max={200} pin={true} value={this.peso} onIonChange={(ev) => this.peso = ev.detail.value}>
              <div slot="start" class="range-label">Peso</div>
              <div slot="end" class="range-value">{this.peso} kg</div>
            </ion-range>
          </ion-item>

        </ion-list>

      </ion-content>
    ];
  }
}
