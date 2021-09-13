export const DEFAULT_S2_EVALSCRIPT = `//VERSION=3

function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}`;

export const DEFAULT_LANDSAT_EVALSCRIPT = `//VERSION=3 (auto-converted from 1)

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

export const DEFAULT_MODIS_EVALSCRIPT = `//VERSION=3 (auto-converted from 1)

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
}`;

export const DEFAULT_DEM_EVALSCRIPT = `return [DEM];`;

export const DEFAULT_S1_EVALSCRIPT = 'return [VH*2]';

export const DEFAULT_S3OLCI_EVALSCRIPT = `//VERSION=3 (auto-converted from 1)
    
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
}`;

export const DEFAULT_S3SLSTR_EVALSCRIPT = `//VERSION=3 (auto-converted from 1)

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
}`;

export const DEFAULT_S5PL2_EVALSCRIPT = `return [O3];`;

export const DEFAULT_BYOC_EVALSCRIPT = `//Write here your evalscript`;

export const DEFAULT_LTML_EVALSCRIPT = `//VERSION=3

function setup() {
  return {
    input: ["B03", "B02", "B01"],
    output: { bands: 3 }
  };
}

function evaluatePixel(sample) {
  return [2.5 * sample.B03, 2.5 * sample.B02, 2.5 * sample.B01];
}
`;

// STAT

export const DEFAULT_STATISTICAL_LANDSAT_EVALSCRIPT = `
//VERSION=3
function setup(){
  return {
    input: [{
      bands:["B04", "B05", "dataMask"],
    }],
    output: [
      {
        id: "data",
        bands: 3,
      },
      {
        id: "dataMask",
        bands: 1
      }
    ]
  };
}

function evaluatePixel(sample) {
    let ndvi = (sample.B05 - sample.B04) / (sample.B05 + sample.B04);
    return {
      data: [ndvi, sample.B05, sample.B04],
      dataMask: [sample.dataMask],
    };
}
`;

export const DEFAULT_STATISTICAL_MODIS_EVALSCRIPT = `//VERSION=3

function setup() {
  return {
    input: [{
      bands: ["B01", "B02", "dataMask"],
    }],
    output: [
      {
      id: "data",
      bands: 3,
      },
      {
        id: "dataMask",
        bands: 1,
      }
    ]
  };
}

function evaluatePixel(sample) {
  let ndvi = (sample.B02 - sample.B01) / (sample.B02 + sample.B01);
  return {
    data: [ndvi, sample.B02, sample.B01],
    dataMask: [sample.dataMask],
  };
}`;

export const DEFAULT_STATISTICAL_DEM_EVALSCRIPT = `//VERSION=3

function setup() {
  return {
    input: [{
      bands: ["DEM", "dataMask"],
    }],
    output: [
      {
        id: "data",
        bands: 1,
      },
      {
        id: "dataMask",
        bands: 1,
      }
    ]
  };
}

function evaluatePixel(sample) {
  return {
    data: [sample.DEM],
    dataMask: [sample.dataMask],
  };
}`;

export const DEFAULT_STATISTICAL_S1_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: ["VH", "dataMask"]
    }],
    output: [
      {
        id: "data",
        bands: 1
      },
      {
        id: "dataMask",
        bands: 1
      }]
  };
}

function evaluatePixel(samples) {
    return {
        data: [samples.VH],
        dataMask: [samples.dataMask],
    };
}`;

// Todo: test once statApi is deployed on Creo.
export const DEFAULT_STATISTICAL_S3OLCI_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "B12",
        "B11",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 3
      },
      {
        id: "dataMask",
        bands: 1,
      }
    ]
  };
}

function evaluatePixel(samples) {
    var otciIndex = (samples.B12 - samples.B11) / (samples.B11 - samples.B10);
    return {
      data: [otciIndex, samples.B12, samples.B11],
      dataMask: [samples.dataMask],
    };
}`;

// Todo: Test once statApi deployed on Creo
export const DEFAULT_STATISTICAL_S3SLSTR_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "S3",
        "S2",
      ]
    }],
    output: [
      {
        id: "data",
        bands: 3,
      },
      {
        id: "dataMask",
        bands: 1,
      }
    ]
  };
}

function evaluatePixel(sample) {
  let ndvi = index(sample.S3, sample.S2);
  return {
    data: [ndvi, sample.S3, sample.S2],
    dataMask: [sample.dataMask],
  };
}`;

// Todo: Test once statApi deployed on Creo
export const DEFAULT_STATISTICAL_S5PL2_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "CO",
        "dataMask",
      ]
    }],
    output: [
      {
        id: "data",
        bands:1
      },
      {
        id: "dataMask",
        bands: 1
      }
    ]
  };
}

function evaluatePixel(sample) {
  return {
    data: [sample.CO],
    dataMask: [sample.dataMask],
  };
}`;

export const DEFAULT_STATISTICAL_S2_EVALSCRIPT = `//VERSION=3
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

export const DEFAULT_STATISTICAL_LTML_EVALSCRIPT = `//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "B03",
        "B04",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "data",
        bands: 3
      },
      {
        id: "dataMask",
        bands: 1
      }]
  };
}

function evaluatePixel(samples) {
    let index = (samples.B04 - samples.B03) / (samples.B04+samples.B03);
    return {
        data: [index, samples.B04, samples.B03],
        dataMask: [samples.dataMask]
    };
}
`;
