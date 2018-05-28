import { Component, Element, State, Listen } from '@stencil/core';

const TEAM = [
  {
    name: 'Manu Mtz.-Almeida',
    bio: 'Litigante bachiller de meliflua elocuencia y resiliencia ante las perturbaciones',
    img1: 'assets/manu-1.jpg',
    img2: 'assets/manu-2.jpg',
  },
  {
    name: 'Pablo Eliseo',
    bio: 'Sempiterno educando de ideas nefelibatas que no se amedrenta ante ninguna limerencia',
    img1: 'assets/pablo-1.jpg',
    img2: 'assets/pablo-2.jpg',
  },
  {
    name: 'Dario Yuste',
    bio: 'Proactivo condiscípulo de caducifolio denuedo, siempre yuxtapuesto a la opinión más tangente',
    img1: 'assets/dario-1.jpg',
    img2: 'assets/dario-2.jpg',
  },
  {
    name: 'Javier Pérez',
    bio: 'Inmarcesible colegial de acendradas epifanías e inconmensurable ataraxia',
    img1: 'assets/javier-1.jpg',
    img2: 'assets/javier-2.jpg',
  }
];

const MODES = ['mode1', 'mode2', 'mode3', 'mode4'];

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