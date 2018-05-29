import { Source } from "./model";

// const SRC = 'http://sedac.ciesin.org/geoserver/ows';
const SRC = '/proxysedac.php';

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
];