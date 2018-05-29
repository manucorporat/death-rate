import { Coord, Source, User } from "./model";
// @ts-ignore
import { parse } from 'geotiff';

const HOSTNAME = '';
const AUTH = 'Basic Z3J1cG8yMDE4QTpncjE4QXh6';

export async function requestAddressForCoord(coord: Coord) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse.php?format=json&lat=${coord.lat}&lon=${coord.log}&zoom=18`);
  const json = await res.json();
  return json.address;
}

export async function requestCoordForName(name: string) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search/${name}?format=json&addressdetails=1&limit=1`);
  const results = await res.json();
  if(results.length > 0) {
    return results[0];
  }
  return undefined;
}

export async function requestSource(src: Source, coord: Coord) {
  const response = await fetch(src.url, {
    method: 'POST',
    body: bodyRequestSource(src.coverage, coord)
  });
  const data = await response.arrayBuffer();
  const tiff = parse(data);

  return tiff;
}

function bodyRequestSource(coverage: string, coord: Coord, crs = 'EPSG:4326') {
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

export async function requestInsertUser(user : User){
  const body = bodyInsertUser(user);
  const url = `${HOSTNAME}/geoserver/ide2018a/ows`;

  await fetch(url, {
    method: 'POST',
    body: body,
    headers: new Headers({
      'Authorization': AUTH
    })
  });
}


function bodyInsertUser(user: User) {
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

export async function requestQueryUsers(user: User){
  const body = bodyQueryUsers(user);
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

export function bodyQueryUsers(user: User){
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