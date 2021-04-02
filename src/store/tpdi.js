import { createSlice } from '@reduxjs/toolkit';

const tpdiSlice = createSlice({
  name: 'tpdi',
  initialState: {
    provider: 'AIRBUS_PHR', // airbus or planet.
    name: '',
    collectionId: '',
    products: [
      {
        idx: 0,
        id: '',
        geometry: '',
      },
    ],
    isParsing: false,
    isSingleDate: false,
    isUsingQuery: false,
    extraMapGeometry: null,
  },
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setCollectionId: (state, action) => {
      state.collectionId = action.payload;
    },
    setProduct: (state, action) => {
      const toChange = state.products.find((prod) => prod.idx === parseInt(action.payload.idx));
      toChange.id = action.payload.id;
      if (toChange.geometry) {
        toChange.geometry = '';
      }
    },
    setProducts: (state, action) => {
      const products = action.payload.map((product, i) => ({ id: product, idx: i }));
      state.products = products;
    },
    addProduct: (state, action) => {
      const lastItem = state.products[state.products.length - 1];
      const firstEmptyItem = state.products.find((prod) => prod.id === '');
      if (action.payload) {
        if (firstEmptyItem) {
          firstEmptyItem.id = action.payload.id;
          firstEmptyItem.geometry = action.payload.geometry;
        } else {
          state.products.push({
            idx: lastItem.idx + 1,
            id: action.payload.id,
            geometry: action.payload.geometry,
          });
        }
      } else {
        state.products.push({ idx: lastItem.idx + 1, id: '', geometry: '' });
      }
    },
    clearProducts: (state) => {
      state.products = [
        {
          idx: 0,
          id: '',
          geometry: '',
        },
      ];
    },
    removeProductId: (state, action) => {
      state.products = state.products.filter((prod) => prod.idx !== parseInt(action.payload));
    },
    setExtraMapGeometry: (state, action) => {
      state.extraMapGeometry = action.payload;
    },
    setTpdiParsing: (state, action) => {
      state.isParsing = action.payload;
    },
    setIsSingleDate: (state, action) => {
      state.isSingleDate = action.payload;
    },
    setIsUsingQuery: (state, action) => {
      state.isUsingQuery = action.payload;
    },
  },
});

// Airbus options
export const airbusSlice = createSlice({
  name: 'airbus',
  initialState: {
    dataFilterOptions: {
      maxCloudCoverage: 100,
      maxSnowCoverage: 90,
      maxIncidenceAngle: 90,
    }, //timerange, maxcc, processinglevel(sensor / album), maxsnowcoverage [0-100 - 100], maxincidenceangle [0-90 - 90], expirationdate
  },
  reducers: {
    setDataFilterOptions: (state, action) => {
      state.dataFilterOptions = {
        ...state.dataFilterOptions,
        ...action.payload,
      };
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    resetAdvancedOptions: (state, action) => {
      state.dataFilterOptions = {};
    },
    defaultAdvancedOptions: (state, action) => {
      state.dataFilterOptions = {
        maxCloudCoverage: 100,
        maxSnowCoverage: 90,
        maxIncidenceAngle: 90,
        processingLevel: 'DEFAULT',
      };
    },
  },
});

export const planetSlice = createSlice({
  name: 'planet',
  initialState: {
    planetApiKey: '',
    maxCloudCoverage: 100,
    harmonizeTo: 'PS2',
  },
  reducers: {
    setApiKey: (state, action) => {
      state.planetApiKey = action.payload;
    },
    setMaxCloudCoverage: (state, action) => {
      state.maxCloudCoverage = parseInt(action.payload);
    },
    setHarmonizeTo: (state, action) => {
      state.harmonizeTo = action.payload;
    },
  },
});

export const maxarInitialState = {
  maxCloudCoverage: 100,
  minOffNadir: 0,
  maxOffNadir: 45,
  minSunElevation: 0,
  maxSunElevation: 90,
  sensor: null,
};

export const maxarSlice = createSlice({
  name: 'maxar',
  initialState: maxarInitialState,
  reducers: {
    setMaxarParam: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export default tpdiSlice;
