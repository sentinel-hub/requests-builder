import area from '@turf/area';
import bboxPolygon from '@turf/bbox-polygon';
import intersect from '@turf/intersect';

export const getFeatureCollectionMultiPolygon = (featureCollection) => {
  const { features } = featureCollection;
  let currentGeo = features[0].geometry;
  for (let feature of features.slice(1)) {
    currentGeo = appendPolygon(currentGeo, feature.geometry);
  }
  return currentGeo;
};

// currentGeometry: GeoJson, newPolygon: GeoJson (Polygon)
export const appendPolygon = (currentGeometry, newPolygon) => {
  if (isPolygon(currentGeometry)) {
    return {
      type: 'MultiPolygon',
      coordinates: [currentGeometry.coordinates, newPolygon.coordinates],
    };
  }
  // multiPolygon
  return {
    type: 'MultiPolygon',
    coordinates: currentGeometry.coordinates.concat(newPolygon.coordinates),
  };
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

const areAllNumbers = (arr) =>
  Boolean(
    arr?.reduce((acc, cv) => {
      if (typeof cv !== 'number') {
        acc = false;
      }
      return acc;
    }, true),
  );
export const isValidBbox = (bbox) => bbox.length === 4 && areAllNumbers(bbox);

export const isValidGeometry = (geometry) =>
  (isPolygon(geometry) || isMultiPolygon(geometry)) && areAllNumbers(geometry.coordinates?.flat(Infinity));

export const getBboxFromCoords = (coords) => {
  const actualCoords = coords[0];
  //bbox = min Longitude , min Latitude , max Longitude , max Latitude
  return [actualCoords[0][0], actualCoords[0][1], actualCoords[1][0], actualCoords[2][1]];
};

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

export const getCoordsFromBbox = (bbox) => {
  if (bbox.length !== 4) {
    throw Error('Not valid bbox');
  }
  const polygonFromBbox = bboxPolygon(bbox);
  return polygonFromBbox.geometry.coordinates;
};
