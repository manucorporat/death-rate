import { Component, Element, State, Listen } from '@stencil/core';

const TEAM = [
  {
    name: 'Juan de Castro',
    bio: 'Profesor de la universidad de Valladolid, nunca se da por vencido explicando la diferencia entre EPSG:4326 y EPSG:3857.',
    img1: 'assets/person-juan.jpg',
    img2: 'assets/person-juan.jpg',
  },
  {
    name: 'Manu Mtz.-Almeida',
    bio: '',
    img1: 'assets/person-juan.jpg',
    img2: 'assets/person-juan.jpg',
  },
  {
    name: 'Juan de Castro',
    bio: '',
    img1: 'assets/person-juan.jpg',
    img2: 'assets/person-juan.jpg',
  },
  {
    name: 'Juan de Castro',
    bio: '',
    img1: 'assets/person-juan.jpg',
    img2: 'assets/person-juan.jpg',
  },
  {
    name: 'Juan de Castro',
    bio: '',
    img1: 'assets/person-juan.jpg',
    img2: 'assets/person-juan.jpg',
  }
];

const MODES = ['mode1', 'mode2', 'mode3', 'mode4', 'mode5'];

@Component({
  tag: 'whoare-page',
  styleUrl: 'whoare-page.scss'
})
export class WhoArePage {

  @Element() el: HTMLElement;
  @State() users = [];

  @Listen('ionViewWillEnter')
  viewWillEnter() {
    const team = shuffle(TEAM.slice());
    const modes = shuffle(MODES.slice());

    this.users = team.map((user, i) => {
      return {
        ...user,
        mode: modes[i]
      }
    });
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
          <ion-title>Quienes somos</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {this.users.map(user => (
          <div class={{
            'grid-container': true,
            [user.mode]: true
          }}>
            <img class="img1" src={user.img1} />
            <img class="img2" src={user.img2} />
            <div class="title">{user.name}</div>
            <div class="bio">{user.bio}</div>
          </div>
        ))};
      </ion-content>
    ];
  }
}


function shuffle<T>(a: T[]): T[] {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}