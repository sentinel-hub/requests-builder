import proj4 from 'proj4';

import { CRS } from '../../../../utils/const/constMap';
import { isBbox, getBboxFromCoords, getCoordsFromBbox } from './geoUtils';

//parsed Geometry -> parsed geo in newCRS
export const transformGeometryToNewCrs = (geometry, toCrs, fromCrs) => {
  try {
    if (!fromCrs) {
      fromCrs = 'EPSG:4326';
    }
    //bbox
    if (isBbox(geometry)) {
      return transformBboxToNewCrs(geometry, CRS[toCrs].projection, CRS[fromCrs].projection);
    }
    //polygon
    else if (geometry.type === 'Polygon') {
      return transformPolygonToNewCrs(geometry, CRS[toCrs].projection, CRS[fromCrs].projection);
    } else if (geometry.type === 'MultiPolygon') {
      return transformMultiPolygonToNewCrs(geometry, CRS[toCrs].projection, CRS[fromCrs].projection);
    }
  } catch (err) {
    console.error('Invalid geometry', err);
  }
};

const toPrecision = (number, precision) => {
  return Math.floor(number * 10 ** precision) / 10 ** precision;
};

//cords [[[x,y],[x,y]]]
const transformArrayOfCoordinatesToNewCrs = (coords, toProj, fromProj) => {
  return [
    coords[0]
      .map((c) => proj4(fromProj, toProj, c))
      .map((pair) => [toPrecision(pair[0], 6), toPrecision(pair[1], 6)]),
  ];
};

export const transformBboxToNewCrs = (bboxToTransform, toProj, fromProj) => {
  const bboxCoords = getCoordsFromBbox(bboxToTransform);
  const transformedCoords = transformArrayOfCoordinatesToNewCrs(bboxCoords, toProj, fromProj);
  return getBboxFromCoords(transformedCoords);
};

export const transformPolygonToNewCrs = (polygonToTransform, toProj, fromProj) => {
  const transformedCoords = transformArrayOfCoordinatesToNewCrs(
    polygonToTransform.coordinates,
    toProj,
    fromProj,
  );
  const polygon = {
    type: 'Polygon',
    coordinates: transformedCoords,
  };
  return polygon;
};

const transformCoordMultiPolygon = (coords, toProj, fromProj) =>
  coords.map((polyCoords) =>
    polyCoords.map((listOfPairs) => listOfPairs.map((c) => proj4(fromProj, toProj, c))),
  );

const transformMultiPolygonToNewCrs = (multiPolygon, toProj, fromProj) => {
  const transformedCoords = transformCoordMultiPolygon(multiPolygon.coordinates, toProj, fromProj);
  const resultMultiPolygon = {
    type: 'MultiPolygon',
    coordinates: transformedCoords,
  };
  return resultMultiPolygon;
};

export const getTransformedGeometryFromBounds = (bounds) => {
  let geo;
  if (bounds.geometry) {
    geo = bounds.geometry;
  } else if (bounds.bbox) {
    geo = bounds.bbox;
  }
  const selectedCrs = Object.keys(CRS).find((key) => CRS[key].url === bounds.properties.crs);
  return transformGeometryToWGS84IfNeeded(selectedCrs, geo);
};

// Parsed Geo in whatever CRS -> Parsed Geo in WGS84
export const transformGeometryToWGS84IfNeeded = (selectedCRS, geometry) => {
  //transform if not in WGS84
  if (selectedCRS !== 'EPSG:4326') {
    try {
      const newGeo = transformGeometryToNewCrs(geometry, 'EPSG:4326', selectedCRS);
      return newGeo;
    } catch (err) {
      return geometry;
    }
  }
  return geometry;
};
