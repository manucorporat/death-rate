import { Source } from "./model";

const SRC = '//sedac.ciesin.org/geoserver/ows';

export const SOURCES: Source[] = [
  {
    name: 'volcanes',
    url: SRC,
    coverage: 'ndh:ndh-volcano-mortality-risks-distribution'
  },
  {
    name: 'corrimiento',
    url: SRC,
    coverage: 'ndh:ndh-landslide-mortality-risks-distribution'
  },
  {
    name: 'Inundaciones',
    url: SRC,
    coverage: 'ndh:ndh-flood-mortality-risks-distribution',
  },
  {
    name: 'Terremotos',
    url: SRC,
    coverage: 'ndh:ndh-earthquake-mortality-risks-distribution'
  },
  {
    name: 'Sequías',
    url: SRC,
    coverage: 'ndh:ndh-drought-mortality-risks-distribution'
  },
  {
    name: 'Ciclones',
    url: SRC,
    coverage: 'ndh:ndh-cyclone-mortality-risks-distribution'
  },
  {
    name: 'Malnutricion infantil',
    url: SRC,
    coverage: 'povmap:povmap-global-subnational-prevalence-child-malnutrition'
  },
  {
    name: 'Mortalidad infantil',
    url: SRC,
    coverage: 'povmap:povmap-global-subnational-infant-mortality-rates_2000'
  }
  //{
  //   name: 'Temp Max',
  //   url: 'http://sedac.ciesin.org/geoserver/ows',
  //   coverage: 'sdei:sdei-global-summer-lst-2013_day-max-global'
  // },
  // {
  //   name: 'Temp Min',
  //   url: 'http://sedac.ciesin.org/geoserver/ows',
  //   coverage: 'sdei:sdei-global-summer-lst-2013_night-min-global'
  // }
];