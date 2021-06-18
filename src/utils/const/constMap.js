import proj4 from 'proj4';
import { northenUtmCrs, southernUtmCrs } from './constUtmCrs';

// internal prevents its use on the Map container.
export const CRS = {
  'EPSG:3857': {
    url: 'http://www.opengis.net/def/crs/EPSG/0/3857',
    projection: proj4('EPSG:3857'),
    internal: false,
  },
  'EPSG:4326': {
    url: 'http://www.opengis.net/def/crs/EPSG/0/4326',
    projection: proj4('EPSG:4326'),
    internal: false,
  },
  'EPSG:3035': {
    url: 'http://www.opengis.net/def/crs/EPSG/0/3035',
    projection: '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs',
    internal: false,
  },
  ...northenUtmCrs,
  ...southernUtmCrs,
};

export const crsUrlToCrsKey = (crsUrl) => {
  return Object.keys(CRS).find((key) => CRS[key].url === crsUrl);
};
