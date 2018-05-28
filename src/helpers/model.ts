// @ts-ignore
import { getCoverageURL } from 'libcoverage/src/kvp';
// @ts-ignore
import { parse } from 'geotiff';

const HOSTNAME = 'http://itastdevserver.tel.uva.es';
const AUTH = 'Basic Z3J1cG8yMDE4QTpncjE4QXh6';

export interface Source {
  name: string;
  url: string;
  coverage: string;
}

export interface User {
  username: string;
  deathRate: number;
  coord: Coord;
}

export interface Coord {
  lat: number;
  log: number;
  angle: number;
  resolution: number;
}

export function getUser(deathRate: number, coord: Coord): User {
  return {
    username: getSetting('nombre') || 'unknown',
    deathRate,
    coord: coord
  }
}

export async function getCurrentCoord(angle: number, resolution: number): Promise<Coord> {
  if (!("geolocation" in navigator)) {
    throw new Error('geolocation not available')
  }
  const prop = new Promise<Coord>(resolve => {
    navigator.geolocation.getCurrentPosition(function(position) {
      resolve({
        lat: position.coords.latitude,
        log: position.coords.longitude,
        angle,
        resolution
      });
    });
  });

  try {
    return await prop;
  } catch(e) {
    return {
      angle: 0.1,
      lat: 41.662351099999995,
      log: -4.7061376,
      resolution: 2
    };
  }
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


export async function calculateCoverage(sources: Source[], coord: Coord, reduceFunction: Function) {
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
  const response = await fetch(src.url, {
    method: 'POST',
    body: getBodyRequest(src.coverage, coord)
  });
  const data = await response.arrayBuffer();
  const tiff = parse(data);

  return tiff;
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

export async function insertQuery(user : User){
  const body = getInsertQuery(user);
  const url = `${HOSTNAME}/geoserver/ide2018a/ows`;

  await fetch(url, {
    method: 'POST',
    body: body,
    headers: new Headers({
      'Authorization': AUTH
    })
  });
}


function getInsertQuery(user: User) {
  const date = '2018-12-12'; // TODO
  return `
  <wfs:Transaction service="WFS" version="1.0.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:DeathRate="http://itastdevserver.tel.uva.es/IDE2018A"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://itastdevserver.tel.uva.es/IDE2018A https://itastdevserver.tel.uva.es/geoserver/wfs/DescribeFeatureType?typename=ide2018a:table_history">
  <wfs:Insert>
    <DeathRate:table_history>
      <DeathRate:position>
          <gml:Point><gml:coordinates>${user.coord.log},${user.coord.lat}</gml:coordinates></gml:Point>
      </DeathRate:position>
      <DeathRate:username>${user.username}</DeathRate:username>
   	  <DeathRate:deathRate>${user.deathRate}</DeathRate:deathRate>
   	  <DeathRate:date>${date}</DeathRate:date>
    </DeathRate:table_history>
  </wfs:Insert>
</wfs:Transaction>`;
}

export async function queryQuery(user: User){
  const body = getQueryQuery(user);
  const url = `${HOSTNAME}/geoserver/ide2018a/ows`;
  const request = await fetch(url, {
    method: 'POST',
    body: body,
    headers: new Headers({
      'Authorization': AUTH
    })
  });
  const text = await request.text();

  const xml = (new DOMParser()).parseFromString(text, 'text/xml');
  return Array.from(xml.querySelectorAll('featureMember')).map(node => {
    const [log, lat] = node.querySelector('position coordinates').textContent.split(',');
    return {
      username: node.querySelector('username').textContent,
      deathRate: parseFloat(node.querySelector('deathRate').textContent),
      coord: {
        lat: parseFloat(lat),
        log: parseFloat(log),
        angle: 0.1,
        resolution: 2,
      }
    } as User;
  });
}

export function getQueryQuery(user: User){
  return  `<wfs:GetFeature service="WFS" version="1.0.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:DeathRate="http://itastdevserver.tel.uva.es/IDE2018A"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:ogc="http://www.opengis.net/ogc"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd http://itastdevserver.tel.uva.es/IDE2018A https://itastdevserver.tel.uva.es/geoserver/wfs/DescribeFeatureType?typename=ide2018a:table_history">
    <wfs:Query typeName="ide2018a:table_history">
      <ogc:Filter>
        <ogc:PropertyIsEqualTo>
          <ogc:PropertyName>ide2018a:username</ogc:PropertyName>
          <ogc:Literal>${user.username}</ogc:Literal>
        </ogc:PropertyIsEqualTo>
      </ogc:Filter>
    </wfs:Query>
  </wfs:GetFeature>
  `
}

export function getSetting(name: string) {
  try {
    return JSON.parse(localStorage.getItem(name));
  } catch {
    return undefined;
  }
}

export function setSetting(name: string, value: any) {
  localStorage.setItem(name, JSON.stringify(value));
}


export function getExtends(coord: Coord) {
  return [
    coord.log - coord.angle, coord.lat - coord.angle,
    coord.log + coord.angle, coord.lat + coord.angle
  ];
}

export function average(raster: Float32Array) {
  return raster.reduce((v, acum) => acum + v, 0) / raster.length
}