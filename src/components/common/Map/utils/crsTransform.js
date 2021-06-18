import bboxPolygon from '@turf/bbox-polygon';
import proj4 from 'proj4';
import area from '@turf/area';
import intersect from '@turf/intersect';
import { addWarningAlert } from '../../../../store/alert';
import { CRS } from '../../../../utils/const/constMap';

export const getAreaFromGeometry = (geometry) => {
  if (isBbox(geometry)) {
    return area(bboxPolygon(geometry));
  } else {
    return area(geometry);
  }
};

const getIntersection = (geo1, geo2) => {
  if (isBbox(geo1) && isBbox(geo2)) {
    return intersect(bboxPolygon(geo1), bboxPolygon(geo2));
  }
  if (isBbox(geo1)) {
    return intersect(bboxPolygon(geo1), geo2);
  }
  if (isBbox(geo2)) {
    return intersect(geo2, bboxPolygon(geo1));
  }
  return intersect(geo1, geo2);
};

export const getAreaCoverPercentage = (selectedGeometry, coverGeometry) => {
  const intersection = getIntersection(selectedGeometry, coverGeometry);
  if (intersection === null) {
    return 0;
  }
  return getAreaFromGeometry(intersection) / getAreaFromGeometry(selectedGeometry);
};

export const focusMap = () => {
  document.getElementById('map').focus();
};

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
    addWarningAlert("Couldn't transform geometry, check the console for more details");
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

const getBboxFromCoords = (coords) => {
  const actualCoords = coords[0];
  //bbox = min Longitude , min Latitude , max Longitude , max Latitude
  return [actualCoords[0][0], actualCoords[0][1], actualCoords[1][0], actualCoords[2][1]];
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

export const isPolygon = (geometry) => geometry?.type === 'Polygon' ?? false;
export const isMultiPolygon = (geometry) => geometry?.type === 'MultiPolygon' ?? false;
export const isBbox = (geometry) => geometry.length === 4;
export const getLatLngFromBbox = (bbox) => {
  const [minX, minY, maxX, maxY] = bbox;
  return [
    [minY, minX],
    [maxY, maxX],
  ];
};
