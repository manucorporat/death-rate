import { Source } from "./model";

export const SOURCES: Source[] = [
  {
    name: 'volcanes',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-volcano-mortality-risks-distribution'
  },
  {
    name: 'corrimiento',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-landslide-mortality-risks-distribution'
  },
  {
    name: 'Inundaciones',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-flood-mortality-risks-distribution',
  },
  {
    name: 'Terremotos',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-earthquake-mortality-risks-distribution'
  },
  {
    name: 'Sequías',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-drought-mortality-risks-distribution'
  },
  {
    name: 'Ciclones',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'ndh:ndh-cyclone-mortality-risks-distribution'
  },
  {
    name: 'Malnutricion infantil',
    url: 'http://sedac.ciesin.org/geoserver/ows',
    coverage: 'povmap:povmap-global-subnational-prevalence-child-malnutrition'
  },
  {
    name: 'Mortalidad infantil',
    url: 'http://sedac.ciesin.org/geoserver/ows',
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