import { createSlice } from '@reduxjs/toolkit';
import { ORDERS_MODE } from '../forms/TPDIRequestForm';

const EMPTY_PRODUCTS = [
  {
    idx: 0,
    id: '',
    geometry: '',
  },
];

const tpdiSlice = createSlice({
  name: 'tpdi',
  initialState: {
    mode: ORDERS_MODE,
    provider: 'AIRBUS_PHR', // airbus or planet.
    name: '',
    collectionId: '',
    products: EMPTY_PRODUCTS,
    isSingleDate: false,
    isUsingQuery: false,
    isCreatingCollection: false,
    extraMapGeometry: null,
  },
  reducers: {
    setTpdiMode: (state, action) => {
      state.mode = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setCollectionId: (state, action) => {
      state.collectionId = action.payload;
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
    addEmptyProduct: (state) => {
      state.products.push({ id: '', geometry: undefined, idx: state.products.length });
    },
    clearProducts: (state) => {
      state.products = EMPTY_PRODUCTS;
    },
    removeProductId: (state, action) => {
      state.products = state.products.filter((prod) => prod.idx !== parseInt(action.payload));
    },
    setProductId: (state, action) => {
      state.products[action.payload.idx].id = action.payload.id;
    },
    setExtraMapGeometry: (state, action) => {
      state.extraMapGeometry = action.payload;
    },
    setIsSingleDate: (state, action) => {
      state.isSingleDate = action.payload;
    },
    setIsUsingQuery: (state, action) => {
      state.isUsingQuery = action.payload;
    },
    setIsCreatingCollection: (state, action) => {
      state.isCreatingCollection = action.payload;
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
    productBundle: 'analytic_udm2',
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
    setProductBundle: (state, action) => {
      state.productBundle = action.payload;
    },
  },
});

export const maxarInitialState = {
  dataFilterOptions: {
    maxCloudCoverage: 100,
    minOffNadir: 0,
    maxOffNadir: 45,
    minSunElevation: 0,
    maxSunElevation: 90,
    sensor: '',
  },
  productKernel: 'CC',
};

export const maxarSlice = createSlice({
  name: 'maxar',
  initialState: maxarInitialState,
  reducers: {
    setMaxarDataFilterParam: (state, action) => {
      const { key, value } = action.payload;
      state.dataFilterOptions[key] = value;
    },
    setProductKernel: (state, action) => {
      state.productKernel = action.payload;
    },
  },
});

export default tpdiSlice;
