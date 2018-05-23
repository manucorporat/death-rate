// @ts-ignore
import { getCoverageURL } from 'libcoverage/src/kvp';
// @ts-ignore
import { parse } from 'geotiff';
//import { Url } from '@stencil/core/dist/declarations';

export interface Source {
  name: string;
  url: string;
  coverage: string;
}


export interface Coord {
  lat: number;
  log: number;
  angle: number;
  resolution: number;
}

const INVALID = 0;
function filterRaster(raster: Float32Array, invalid: number): Float32Array{

  for (let i = 0; i < raster.length; i++){
    if (raster[i] === invalid){
      raster[i] = INVALID;
    }
  }
  return raster;
}


export async function process(sources: Source[], coord: Coord, reduceFunction: Function) {
  const results = await Promise.all(
    sources.map(src => request(src, coord))
  )

  const rasters = results.map(tiff => {
    const image = tiff.getImage();
    const raster = image.readRasters()[0];
    const invalid = image.fileDirectory["GDAL_NODATA"];
    if (invalid) {
      return filterRaster(raster, parseFloat(invalid));
    }
    return raster;
  });


  const iterations = coord.resolution ** 2;
  const rasterFinal = new Float32Array(iterations);
  for (let i = 0; i < iterations; i++) {
    rasterFinal[i] = reduceFunction(i, ...rasters);
  }
  return rasterFinal;
}

async function request(src: Source, coord: Coord) {
  console.log(src.url);
  const response = await fetch(src.url, {
    method: 'POST',
    body: getBodyRequest(src.coverage, coord)
  });
  const data = await response.arrayBuffer();
  const tiff = parse(data);

  return tiff;
}

export async function insertQuery(hostname : string , user : User){
  const body = getInsertQuery(hostname, user);
  const url = `${hostname}/ide2018a/ows`;

  await fetch(url, {
    method: 'POST',
    body: body
  });

}

export function getCurrentCoord(angle: number, resolution: number): Promise<Coord> {
  if (!("geolocation" in navigator)) {
    throw new Error('geolocation not available')
  }
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(function(position) {
      resolve({
        lat: position.coords.latitude,
        log: position.coords.longitude,
        angle,
        resolution
      });
    });
  });
}
// const coord = {
//   lat: 41.6623241,
//   log: -4.7059912,
//   angle: 20,
//   resolution: 320
// };

export function getExtends(coord: Coord) {
  return [
    coord.log - coord.angle, coord.lat - coord.angle,
    coord.log + coord.angle, coord.lat + coord.angle
  ];
}

function getBodyRequest(coverage: string, coord: Coord, crs = 'EPSG:4326') {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <GetCoverage version="1.0.0" service="WCS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wcs" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xsi:schemaLocation="http://www.opengis.net/wcs http://schemas.opengis.net/wcs/1.0.0/getCoverage.xsd">

  <sourceCoverage>${coverage}</sourceCoverage>

  <domainSubset>
    <spatialSubset>
      <gml:Envelope srsName="${crs}">
        <gml:pos>${coord.log - coord.angle} ${coord.lat - coord.angle}</gml:pos>
        <gml:pos>${coord.log + coord.angle} ${coord.lat + coord.angle}</gml:pos>
      </gml:Envelope>
      <gml:Grid dimension="2">
        <gml:limits>
          <gml:GridEnvelope>
            <gml:low>0 0</gml:low>
            <gml:high>${coord.resolution} ${coord.resolution}</gml:high>
          </gml:GridEnvelope>
        </gml:limits>
        <gml:axisName>x</gml:axisName>
        <gml:axisName>y</gml:axisName>
      </gml:Grid>
    </spatialSubset>
  </domainSubset>
  <output>
    <crs>${crs}</crs>
    <format>GeoTIFF</format>
  </output>
</GetCoverage>`
}


export interface User {
  name: string;
  deathRate: number;
  coord: Coord;
}

// async function requestInsert() {
//   const response = await fetch(src.url, {
//     method: 'POST',
//     body: getBodyRequest(src.coverage, coord)
//   });
//   const data = await response.arrayBuffer();
//   const tiff = parse(data);

//   return tiff;
//   fetch('http://localhost:8080/geoserver/wfs',)
//   // http://localhost:8080/geoserver/wfs
// }

function getInsertQuery(hostname: string, user: User) {
  const date = '2018-12-12'; // TODO
  return `
  <wfs:Transaction service="WFS" version="1.0.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:DeathRate="http://itastdevserver.tel.uva.es/IDE2018A"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://itastdevserver.tel.uva.es/IDE2018A ${hostname}/wfs/DescribeFeatureType?typename=ide2018a:table_history">
  <wfs:Insert>
    <DeathRate:table_history>
      <DeathRate:position>
          <gml:Point><gml:coordinates>${user.coord.log} ${user.coord.lat}</gml:coordinates></gml:Point>
      </DeathRate:position>
      <DeathRate:username>${user.name}</DeathRate:username>
   	  <DeathRate:deathRate>${user.deathRate}</DeathRate:deathRate>
   	  <DeathRate:date>${date}/DeathRate:date>
    </DeathRate:table_history>
  </wfs:Insert>
</wfs:Transaction>`;
}