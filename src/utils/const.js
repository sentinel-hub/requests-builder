import proj4 from 'proj4';

export const S2L1C = 'S2L1C';
export const S2L2A = 'S2L2A';
export const L8L1C = 'L8L1C';
export const MODIS = 'MODIS';
export const DEM = 'DEM';
export const S1GRD = 'S1GRD';
export const S3OLCI = 'S3OLCI';
export const S3SLSTR = 'S3SLSTR';
export const S5PL2 = 'S5PL2';
export const CUSTOM = 'CUSTOM';
export const DATAFUSION = 'DATAFUSION';

export const DATASOURCES_NAMES = [
  S2L1C,
  S2L2A,
  L8L1C,
  MODIS,
  DEM,
  S1GRD,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  CUSTOM,
  DATAFUSION,
];

export const DATASOURCES = {
  S2L1C: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l1c',
  },
  S2L2A: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l2a',
  },
  L8L1C: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l8l1c',
  },
  MODIS: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'modis',
  },
  DEM: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'dem',
  },
  S1GRD: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's1',
  },
  S3OLCI: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'olci',
  },
  S3SLSTR: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'slstr',
  },
  S5PL2: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's5pl2',
  },
  CUSTOM: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    selectName: 'Bring your own COG',
  },
  DATAFUSION: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
  },
};

export const OUTPUT_FORMATS = [
  {
    name: 'TIFF',
    value: 'image/tiff',
  },
  {
    name: 'PNG',
    value: 'image/png',
  },
  {
    name: 'JPEG',
    value: 'image/jpeg',
  },
  {
    name: 'APP/JSON',
    value: 'application/json',
  },
];

export const DEFAULT_EVALSCRIPTS = {
  S2L2A: `//VERSION=3

function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`,
  S2L1C: `//VERSION=3

function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`,
  L8L1C: `//VERSION=3 (auto-converted from 1)

let minVal = 0.0;
let maxVal = 0.4;

let viz = new HighlightCompressVisualizer(minVal, maxVal);

function setup() {
  return {
    input: [{
      bands: [
        "B03",
        "B04",
        "B05"
      ]
    }],
    output: {
      bands: 3
    }
  };
}

function evaluatePixel(samples) {
    let val = [samples.B05, samples.B04, samples.B03];
    return viz.processList(val);
}
`,
  MODIS: `//VERSION=3 (auto-converted from 1)

let minVal = 0.0;
let maxVal = 0.4;

let viz = new HighlightCompressVisualizer(minVal, maxVal);

function setup() {
  return {
    input: [{
      bands: [
        "B01",
        "B03",
        "B04"
      ]
    }],
    output: {
      bands: 3
    }
  };
}

function evaluatePixel(samples) {
    let val = [samples.B01, samples.B04, samples.B03];
    return val.map((v,i) => viz.process(v,i));
}

    `,
  DEM: `return [DEM];`,
  S1GRD: `return [VH*2];`,
  S3OLCI: `//VERSION=3 (auto-converted from 1)
    
let minVal = 0.0;
let maxVal = 0.4;

let viz = new HighlightCompressVisualizer(minVal, maxVal);

function setup() {
  return {
    input: [{
      bands: [
        "B08",
        "B06",
        "B04"
      ]
    }],
    output: {
      bands: 3
    }
  };
}

function evaluatePixel(samples) {
    let val = [samples.B08, samples.B06, samples.B04];
    return viz.processList(val);
}
`,
  S3SLSTR: `//VERSION=3 (auto-converted from 1)

let minVal = 0.0;
let maxVal = 0.8;

let viz = new HighlightCompressVisualizer(minVal, maxVal);

function setup() {
  return {
    input: [{
      bands: [
        "S3",
        "S2",
        "S1"
      ]
    }],
    output: {
      bands: 3
    }
  };
}

function evaluatePixel(samples) {
  let val = [samples.S3, samples.S2, samples.S1];
  return viz.processList(val);
}

    `,
  S5PL2: `return [O3];`,
  CUSTOM: `//Write here your evalscript`,
  DATAFUSION: `//VERSION=3
  function setup (){
    return {
      input: [
        {datasource: "s1", bands:["VV"]},
        {datasource: "l2a", bands:["B02", "B03", "B04", "SCL"], units:"REFLECTANCE"}],
      output: [
        {id: "default", bands: 3, sampleType: SampleType.AUTO}
      ]
    };
  }
  
  
  function evaluatePixel(samples, inputData, inputMetadata, customData, outputMetadata) {
    var sample = samples.s1[0];
    var sample2 = samples.l2a[0];
    
    if ([7, 8, 9, 10].includes(sample2.SCL)) {
      return {
        default: [sample.VV, sample.VV, sample.VV]
      };
    } else {
      return {
        default: [sample2.B04*2.5, sample2.B03*2.5, sample2.B02*2.5]
      };
    }
  }`,
};

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
  'EPSG:32633': {
    url: 'http://www.opengis.net/def/crs/EPSG/0/32633',
    projection: '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    internal: true,
  },
  'EPSG:32645': {
    url: 'http://www.opengis.net/def/crs/EPSG/0/32645',
    projection: '+proj=utm +zone=45 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    internal: true,
  },
};

export const crsUrlToCrsKey = (crsUrl) => {
  return Object.keys(CRS).find((key) => CRS[key].url === crsUrl);
};

export const isEmpty = (obj) => Object.keys(obj).length === 0;

// Check if an object is empty or only contains keys with value 'DEFAULT'
export const isEmptyDefault = (obj) => {
  let keys = Object.keys(obj);
  if (keys.length === 0) {
    return true;
  }

  for (let key of keys) {
    if (obj[key] && obj[key] !== 'DEFAULT') {
      return false;
    }
  }
  return true;
};

export const formatNumber = (n, roundedDigits, fixed = false) => {
  const roundedResult = Math.round(n * 10 ** roundedDigits) / 10 ** roundedDigits;
  if (fixed) {
    return roundedResult.toFixed(roundedDigits);
  }
  return roundedResult.toString();
};

export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};
