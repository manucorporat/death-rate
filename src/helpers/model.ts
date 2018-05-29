// @ts-ignore
import { getCoverageURL } from 'libcoverage/src/kvp';
import { requestSource } from './requests';

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
    sources.map(src => requestSource(src, coord))
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