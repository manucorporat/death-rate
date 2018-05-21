import { Component, Element, State, Watch } from '@stencil/core';

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
  @State() fumador: boolean = getSetting('fumador');
  @State() altura: number = getSetting('altura');
  @State() peso: number = getSetting('peso');

  @Watch('nombre')
  @Watch('apellidos')
  @Watch('genero')
  @Watch('fechaNacimiento')
  @Watch('fumador')
  @Watch('altura')
  @Watch('peso')
  valueChanged(newValue: any, _, propName: string) {
    setSetting(propName, newValue);
  }

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
          <ion-title>Ajustes</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label position="floating">Nombre</ion-label>
            <ion-input value={this.nombre} onIonChange={(ev) => this.nombre = ev.detail.value}></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Apellidos</ion-label>
            <ion-input value={this.apellidos} onIonChange={(ev) => this.apellidos = ev.detail.value}></ion-input>
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
            <ion-label>Fumador</ion-label>
            <ion-toggle checked={this.fumador} onIonChange={(ev) => this.fumador = ev.detail.checked}></ion-toggle>
          </ion-item>

          <ion-item>
            <ion-range min={100} max={230} pin={true} value={this.altura} onIonChange={(ev) => this.altura = ev.detail.value}>
              <div slot="start" class="range-label">Altura (cm)</div>
            </ion-range>
          </ion-item>

          <ion-item>
            <ion-range min={10} max={200} pin={true} value={this.peso} onIonChange={(ev) => this.peso = ev.detail.value}>
              <div slot="start" class="range-label">Peso (kg)</div>
            </ion-range>
          </ion-item>

        </ion-list>

      </ion-content>
    ];
  }
}

function getSetting(name: string) {
  return JSON.parse(localStorage.getItem(name));
}

function setSetting(name: string, value: any) {
  localStorage.setItem(name, JSON.stringify(value));
}