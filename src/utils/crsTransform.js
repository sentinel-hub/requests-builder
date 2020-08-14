import bboxPolygon from '@turf/bbox-polygon';
import proj4 from 'proj4';
import { CRS } from '../utils/const';
import bbox from '@turf/bbox';
import { transformGeometryToWGS84IfNeeded } from '../components/input/MapContainer';

//parsed Geometry -> parsed geo in newCRS
export const transformGeometryToNewCrs = (geometry, toCrs, fromCrs) => {
  try {
    if (!fromCrs) {
      fromCrs = 'EPSG:4326';
    }
    //bbox
    if (geometry.length === 4) {
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

const getCoordsFromBbox = (bbox) => {
  if (bbox.length !== 4) {
    throw Error('Not valid bbox');
  }
  const polygonFromBbox = bboxPolygon(bbox);
  return polygonFromBbox.geometry.coordinates;
};

//cords [[[x,y],[x,y]]]
const transformArrayOfCoordinatesToNewCrs = (coords, toProj, fromProj) => {
  return [coords[0].map((c) => proj4(fromProj, toProj, c))];
};

export const transformBboxToNewCrs = (bboxToTransform, toProj, fromProj) => {
  const bboxCoords = getCoordsFromBbox(bboxToTransform);
  const transformedCoords = transformArrayOfCoordinatesToNewCrs(bboxCoords, toProj, fromProj);
  const polygon = {
    type: 'Polygon',
    coordinates: transformedCoords,
  };
  return bbox(polygon);
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

const transformCoordMultiPolygon = (coords, toProj, fromProj) => {
  return [coords[0].map((listOfPairs) => listOfPairs.map((c) => proj4(fromProj, toProj, c)))];
};

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
