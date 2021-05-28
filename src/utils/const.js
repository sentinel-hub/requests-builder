import proj4 from 'proj4';

export const S2L1C = 'S2L1C';
export const S2L2A = 'S2L2A';
export const L8L1C = 'L8L1C';
export const LOTL1 = 'LOTL1';
export const LOTL2 = 'LOTL2';
export const MODIS = 'MODIS';
export const DEM = 'DEM';
export const S1GRD = 'S1GRD';
export const S3OLCI = 'S3OLCI';
export const S3SLSTR = 'S3SLSTR';
export const S5PL2 = 'S5PL2';
export const CUSTOM = 'CUSTOM';
export const DATAFUSION = 'DATAFUSION';

// export const S2L1C = 'sentinel-2-l1c';
// export const S2L2A = 'sentinel-2-l2a';
// export const L8L1C = 'landsat-8-l1c';
// export const LOTL1 = 'landsat-ot-l1';
// export const LOTL2 = 'landsat-ot-l2';
// export const MODIS = 'modis';
// export const DEM = 'dem';
// export const S1GRD = 'sentinel-1-grd';
// export const S3OLCI = 'sentinel-3-olci';
// export const S3SLSTR = 'sentinel-3-slstr';
// export const S5PL2 = 'sentinel-5p-l2';
// export const CUSTOM = 'custom';
// export const DATAFUSION = 'DATAFUSION';

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

export const OLD_DATASOURCES_TO_NEW_MAP = {
  S2L1C: S2L1C,
  S2L2A: S2L2A,
  L8L1C: L8L1C,
  MODIS: MODIS,
  DEM: DEM,
  S1GRD: S1GRD,
  S3OLCI: S3OLCI,
  S3SLSTR: S3SLSTR,
  S5PL2: S5PL2,
  CUSTOM: CUSTOM,
};

export const DATASOURCES = {
  [S2L1C]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l1c',
    isBatchSupported: true,
  },
  [S2L2A]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l2a',
    isBatchSupported: true,
  },
  [L8L1C]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'l8l1c',
    isBatchSupported: false,
  },
  [LOTL1]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl1',
    isBatchSupported: false,
  },
  [LOTL2]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'lotl2',
    isBatchSupported: false,
  },
  [MODIS]: {
    url: 'https://services-uswest2.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services-uswest2.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'modis',
    isBatchSupported: false,
  },
  [DEM]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'dem',
    isBatchSupported: true,
  },
  [S1GRD]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's1',
    isBatchSupported: true,
  },
  [S3OLCI]: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'olci',
    isBatchSupported: false,
  },
  [S3SLSTR]: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 'slstr',
    isBatchSupported: false,
  },
  [S5PL2]: {
    url: 'https://creodias.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://creodias.sentinel-hub.com/ogc/',
    defaultDatafusionId: 's5pl2',
    isBatchSupported: false,
  },
  [CUSTOM]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    ogcUrl: 'https://services.sentinel-hub.com/ogc/',
    selectName: 'Bring your own COG',
    isBatchSupported: true,
  },
  [DATAFUSION]: {
    url: 'https://services.sentinel-hub.com/api/v1/process',
    isBatchSupported: true,
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

const DEFAULT_LANDSAT_EVALSCRIPT = `//VERSION=3 (auto-converted from 1)

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
`;

export const DEFAULT_EVALSCRIPTS = {
  [S2L2A]: `//VERSION=3

function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`,
  [S2L1C]: `//VERSION=3

function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`,
  [L8L1C]: DEFAULT_LANDSAT_EVALSCRIPT,
  [LOTL1]: DEFAULT_LANDSAT_EVALSCRIPT,
  [LOTL2]: DEFAULT_LANDSAT_EVALSCRIPT,
  [MODIS]: `//VERSION=3 (auto-converted from 1)

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
  [DEM]: `return [DEM];`,
  [S1GRD]: `return [VH*2];`,
  [S3OLCI]: `//VERSION=3 (auto-converted from 1)
    
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
  [S3SLSTR]: `//VERSION=3 (auto-converted from 1)

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
  [S5PL2]: `return [O3];`,
  [CUSTOM]: `//Write here your evalscript`,
  [DATAFUSION]: `//VERSION=3
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

export const DEFAULT_STATISTICAL_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "B04",
        "B08",
        "SCL",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 3
      },
      {
        id: "scl",
        sampleType: "INT8",
        bands: 1
      },
      {
        id: "dataMask",
        bands: 1
      }]
  };
}

function evaluatePixel(samples) {
    let index = (samples.B08 - samples.B04) / (samples.B08+samples.B04);
    return {
        data: [index, samples.B08, samples.B04],
        dataMask: [samples.dataMask],
        scl: [samples.SCL]
    };
}
`;
const northenUtmCrs = {
  'EPSG:32601': {
    projection: '+proj=utm +zone=1 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32601',
    internal: false,
  },
  'EPSG:32602': {
    projection: '+proj=utm +zone=2 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32602',
    internal: false,
  },
  'EPSG:32603': {
    projection: '+proj=utm +zone=3 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32603',
    internal: false,
  },
  'EPSG:32604': {
    projection: '+proj=utm +zone=4 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32604',
    internal: false,
  },
  'EPSG:32605': {
    projection: '+proj=utm +zone=5 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32605',
    internal: false,
  },
  'EPSG:32606': {
    projection: '+proj=utm +zone=6 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32606',
    internal: false,
  },
  'EPSG:32607': {
    projection: '+proj=utm +zone=7 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32607',
    internal: false,
  },
  'EPSG:32608': {
    projection: '+proj=utm +zone=8 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32608',
    internal: false,
  },
  'EPSG:32609': {
    projection: '+proj=utm +zone=9 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32609',
    internal: false,
  },
  'EPSG:32610': {
    projection: '+proj=utm +zone=10 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32610',
    internal: false,
  },
  'EPSG:32611': {
    projection: '+proj=utm +zone=11 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32611',
    internal: false,
  },
  'EPSG:32612': {
    projection: '+proj=utm +zone=12 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32612',
    internal: false,
  },
  'EPSG:32613': {
    projection: '+proj=utm +zone=13 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32613',
    internal: false,
  },
  'EPSG:32614': {
    projection: '+proj=utm +zone=14 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32614',
    internal: false,
  },
  'EPSG:32615': {
    projection: '+proj=utm +zone=15 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32615',
    internal: false,
  },
  'EPSG:32616': {
    projection: '+proj=utm +zone=16 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32616',
    internal: false,
  },
  'EPSG:32617': {
    projection: '+proj=utm +zone=17 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32617',
    internal: false,
  },
  'EPSG:32618': {
    projection: '+proj=utm +zone=18 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32618',
    internal: false,
  },
  'EPSG:32619': {
    projection: '+proj=utm +zone=19 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32619',
    internal: false,
  },
  'EPSG:32620': {
    projection: '+proj=utm +zone=20 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32620',
    internal: false,
  },
  'EPSG:32621': {
    projection: '+proj=utm +zone=21 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32621',
    internal: false,
  },
  'EPSG:32622': {
    projection: '+proj=utm +zone=22 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32622',
    internal: false,
  },
  'EPSG:32623': {
    projection: '+proj=utm +zone=23 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32623',
    internal: false,
  },
  'EPSG:32624': {
    projection: '+proj=utm +zone=24 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32624',
    internal: false,
  },
  'EPSG:32625': {
    projection: '+proj=utm +zone=25 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32625',
    internal: false,
  },
  'EPSG:32626': {
    projection: '+proj=utm +zone=26 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32626',
    internal: false,
  },
  'EPSG:32627': {
    projection: '+proj=utm +zone=27 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32627',
    internal: false,
  },
  'EPSG:32628': {
    projection: '+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32628',
    internal: false,
  },
  'EPSG:32629': {
    projection: '+proj=utm +zone=29 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32629',
    internal: false,
  },
  'EPSG:32630': {
    projection: '+proj=utm +zone=30 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32630',
    internal: false,
  },
  'EPSG:32631': {
    projection: '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32631',
    internal: false,
  },
  'EPSG:32632': {
    projection: '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32632',
    internal: false,
  },
  'EPSG:32633': {
    projection: '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32633',
    internal: false,
  },
  'EPSG:32634': {
    projection: '+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32634',
    internal: false,
  },
  'EPSG:32635': {
    projection: '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32635',
    internal: false,
  },
  'EPSG:32636': {
    projection: '+proj=utm +zone=36 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32636',
    internal: false,
  },
  'EPSG:32637': {
    projection: '+proj=utm +zone=37 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32637',
    internal: false,
  },
  'EPSG:32638': {
    projection: '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32638',
    internal: false,
  },
  'EPSG:32639': {
    projection: '+proj=utm +zone=39 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32639',
    internal: false,
  },
  'EPSG:32640': {
    projection: '+proj=utm +zone=40 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32640',
    internal: false,
  },
  'EPSG:32641': {
    projection: '+proj=utm +zone=41 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32641',
    internal: false,
  },
  'EPSG:32642': {
    projection: '+proj=utm +zone=42 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32642',
    internal: false,
  },
  'EPSG:32643': {
    projection: '+proj=utm +zone=43 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32643',
    internal: false,
  },
  'EPSG:32644': {
    projection: '+proj=utm +zone=44 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32644',
    internal: false,
  },
  'EPSG:32645': {
    projection: '+proj=utm +zone=45 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32645',
    internal: false,
  },
  'EPSG:32646': {
    projection: '+proj=utm +zone=46 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32646',
    internal: false,
  },
  'EPSG:32647': {
    projection: '+proj=utm +zone=47 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32647',
    internal: false,
  },
  'EPSG:32648': {
    projection: '+proj=utm +zone=48 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32648',
    internal: false,
  },
  'EPSG:32649': {
    projection: '+proj=utm +zone=49 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32649',
    internal: false,
  },
  'EPSG:32650': {
    projection: '+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32650',
    internal: false,
  },
  'EPSG:32651': {
    projection: '+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32651',
    internal: false,
  },
  'EPSG:32652': {
    projection: '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32652',
    internal: false,
  },
  'EPSG:32653': {
    projection: '+proj=utm +zone=53 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32653',
    internal: false,
  },
  'EPSG:32654': {
    projection: '+proj=utm +zone=54 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32654',
    internal: false,
  },
  'EPSG:32655': {
    projection: '+proj=utm +zone=55 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32655',
    internal: false,
  },
  'EPSG:32656': {
    projection: '+proj=utm +zone=56 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32656',
    internal: false,
  },
  'EPSG:32657': {
    projection: '+proj=utm +zone=57 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32657',
    internal: false,
  },
  'EPSG:32658': {
    projection: '+proj=utm +zone=58 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32658',
    internal: false,
  },
  'EPSG:32659': {
    projection: '+proj=utm +zone=59 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32659',
    internal: false,
  },
  'EPSG:32660': {
    projection: '+proj=utm +zone=60 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32660',
    internal: false,
  },
};

const southernUtmCrs = {
  'EPSG:32701': {
    projection: '+proj=utm +zone=1 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32701',
    internal: false,
  },
  'EPSG:32702': {
    projection: '+proj=utm +zone=2 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32702',
    internal: false,
  },
  'EPSG:32703': {
    projection: '+proj=utm +zone=3 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32703',
    internal: false,
  },
  'EPSG:32704': {
    projection: '+proj=utm +zone=4 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32704',
    internal: false,
  },
  'EPSG:32705': {
    projection: '+proj=utm +zone=5 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32705',
    internal: false,
  },
  'EPSG:32706': {
    projection: '+proj=utm +zone=6 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32706',
    internal: false,
  },
  'EPSG:32707': {
    projection: '+proj=utm +zone=7 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32707',
    internal: false,
  },
  'EPSG:32708': {
    projection: '+proj=utm +zone=8 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32708',
    internal: false,
  },
  'EPSG:32709': {
    projection: '+proj=utm +zone=9 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32709',
    internal: false,
  },
  'EPSG:32710': {
    projection: '+proj=utm +zone=10 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32710',
    internal: false,
  },
  'EPSG:32711': {
    projection: '+proj=utm +zone=11 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32711',
    internal: false,
  },
  'EPSG:32712': {
    projection: '+proj=utm +zone=12 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32712',
    internal: false,
  },
  'EPSG:32713': {
    projection: '+proj=utm +zone=13 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32713',
    internal: false,
  },
  'EPSG:32714': {
    projection: '+proj=utm +zone=14 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32714',
    internal: false,
  },
  'EPSG:32715': {
    projection: '+proj=utm +zone=15 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32715',
    internal: false,
  },
  'EPSG:32716': {
    projection: '+proj=utm +zone=16 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32716',
    internal: false,
  },
  'EPSG:32717': {
    projection: '+proj=utm +zone=17 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32717',
    internal: false,
  },
  'EPSG:32718': {
    projection: '+proj=utm +zone=18 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32718',
    internal: false,
  },
  'EPSG:32719': {
    projection: '+proj=utm +zone=19 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32719',
    internal: false,
  },
  'EPSG:32720': {
    projection: '+proj=utm +zone=20 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32720',
    internal: false,
  },
  'EPSG:32721': {
    projection: '+proj=utm +zone=21 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32721',
    internal: false,
  },
  'EPSG:32722': {
    projection: '+proj=utm +zone=22 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32722',
    internal: false,
  },
  'EPSG:32723': {
    projection: '+proj=utm +zone=23 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32723',
    internal: false,
  },
  'EPSG:32724': {
    projection: '+proj=utm +zone=24 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32724',
    internal: false,
  },
  'EPSG:32725': {
    projection: '+proj=utm +zone=25 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32725',
    internal: false,
  },
  'EPSG:32726': {
    projection: '+proj=utm +zone=26 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32726',
    internal: false,
  },
  'EPSG:32727': {
    projection: '+proj=utm +zone=27 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32727',
    internal: false,
  },
  'EPSG:32728': {
    projection: '+proj=utm +zone=28 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32728',
    internal: false,
  },
  'EPSG:32729': {
    projection: '+proj=utm +zone=29 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32729',
    internal: false,
  },
  'EPSG:32730': {
    projection: '+proj=utm +zone=30 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32730',
    internal: false,
  },
  'EPSG:32731': {
    projection: '+proj=utm +zone=31 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32731',
    internal: false,
  },
  'EPSG:32732': {
    projection: '+proj=utm +zone=32 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32732',
    internal: false,
  },
  'EPSG:32733': {
    projection: '+proj=utm +zone=33 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32733',
    internal: false,
  },
  'EPSG:32734': {
    projection: '+proj=utm +zone=34 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32734',
    internal: false,
  },
  'EPSG:32735': {
    projection: '+proj=utm +zone=35 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32735',
    internal: false,
  },
  'EPSG:32736': {
    projection: '+proj=utm +zone=36 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32736',
    internal: false,
  },
  'EPSG:32737': {
    projection: '+proj=utm +zone=37 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32737',
    internal: false,
  },
  'EPSG:32738': {
    projection: '+proj=utm +zone=38 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32738',
    internal: false,
  },
  'EPSG:32739': {
    projection: '+proj=utm +zone=39 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32739',
    internal: false,
  },
  'EPSG:32740': {
    projection: '+proj=utm +zone=40 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32740',
    internal: false,
  },
  'EPSG:32741': {
    projection: '+proj=utm +zone=41 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32741',
    internal: false,
  },
  'EPSG:32742': {
    projection: '+proj=utm +zone=42 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32742',
    internal: false,
  },
  'EPSG:32743': {
    projection: '+proj=utm +zone=43 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32743',
    internal: false,
  },
  'EPSG:32744': {
    projection: '+proj=utm +zone=44 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32744',
    internal: false,
  },
  'EPSG:32745': {
    projection: '+proj=utm +zone=45 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32745',
    internal: false,
  },
  'EPSG:32746': {
    projection: '+proj=utm +zone=46 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32746',
    internal: false,
  },
  'EPSG:32747': {
    projection: '+proj=utm +zone=47 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32747',
    internal: false,
  },
  'EPSG:32748': {
    projection: '+proj=utm +zone=48 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32748',
    internal: false,
  },
  'EPSG:32749': {
    projection: '+proj=utm +zone=49 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32749',
    internal: false,
  },
  'EPSG:32750': {
    projection: '+proj=utm +zone=50 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32750',
    internal: false,
  },
  'EPSG:32751': {
    projection: '+proj=utm +zone=51 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32751',
    internal: false,
  },
  'EPSG:32752': {
    projection: '+proj=utm +zone=52 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32752',
    internal: false,
  },
  'EPSG:32753': {
    projection: '+proj=utm +zone=53 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32753',
    internal: false,
  },
  'EPSG:32754': {
    projection: '+proj=utm +zone=54 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32754',
    internal: false,
  },
  'EPSG:32755': {
    projection: '+proj=utm +zone=55 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32755',
    internal: false,
  },
  'EPSG:32756': {
    projection: '+proj=utm +zone=56 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32756',
    internal: false,
  },
  'EPSG:32757': {
    projection: '+proj=utm +zone=57 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32757',
    internal: false,
  },
  'EPSG:32758': {
    projection: '+proj=utm +zone=58 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32758',
    internal: false,
  },
  'EPSG:32759': {
    projection: '+proj=utm +zone=59 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32759',
    internal: false,
  },
  'EPSG:32760': {
    projection: '+proj=utm +zone=60 +south +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
    url: 'http://www.opengis.net/def/crs/EPSG/0/32760',
    internal: false,
  },
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

export const datasourceToCustomRepoLink = (datasource) => {
  const BASE_LINK = 'https://custom-scripts.sentinel-hub.com/';
  switch (datasource) {
    case S2L1C:
    case S2L2A:
      return `${BASE_LINK}#sentinel-2`;
    case S1GRD:
      return `${BASE_LINK}#sentinel-1`;
    case S3OLCI:
    case S3SLSTR:
      return `${BASE_LINK}#sentinel-3`;
    case S5PL2:
      return `${BASE_LINK}#sentinel-5p`;
    case L8L1C:
    case LOTL1:
    case LOTL2:
      return `${BASE_LINK}#landsat-8`;
    case MODIS:
      return `${BASE_LINK}#modis`;
    case DEM:
      return `${BASE_LINK}#dem`;
    case DATAFUSION:
      return `${BASE_LINK}#data-fusion`;
    default:
      return BASE_LINK;
  }
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
