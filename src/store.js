import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_EVALSCRIPTS, S1GRD, S2L2A, DATASOURCES } from './utils/const';
import moment from 'moment';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      userdata: null,
      access_token: null,
    },
    // For EDC Deployment. Assume it's true so feature get toggled and not dissapear.
    isEDC: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user.userdata = action.payload.userdata;
      state.user.access_token = action.payload.access_token;
    },
    resetUser: (state, action) => {
      state.user.userdata = null;
      state.user.access_token = null;
    },
    setIsEDC: (state, action) => {
      state.isEDC = action.payload;
    },
  },
});

const resetAdvancedOptions = (state) => {
  state.dataFilterOptions = [
    {
      options: {},
      idx: 0,
    },
    {
      options: {},
      idx: 1,
    },
  ];
  state.processingOptions = [
    {
      options: {},
      idx: 0,
    },
    {
      options: {},
      idx: 1,
    },
  ];
  return state;
};

export const requestSlice = createSlice({
  name: 'request',
  initialState: {
    mode: 'PROCESS',
    datasource: 'S2L2A',
    //default times: today and one month ago.
    timeFrom: [moment.utc().subtract(1, 'month').startOf('day').format()],
    timeTo: [moment.utc().endOf('day').format()],
    isTimeRangeDisabled: false,
    heightOrRes: 'HEIGHT',
    width: 512,
    height: 512,
    isAutoRatio: true,
    evalscript: DEFAULT_EVALSCRIPTS['S2L2A'],
    CRS: 'EPSG:4326',
    geometryType: 'BBOX',
    geometry: [12.44693, 41.870072, 12.541001, 41.917096],
    // Array with options and index to individually modify certain options on datafusion
    dataFilterOptions: [
      {
        options: {},
        idx: 0,
      },
      {
        options: {},
        idx: 1,
      },
    ],
    processingOptions: [
      {
        options: {},
        idx: 0,
      },
      {
        options: {},
        idx: 1,
      },
    ],
    datafusionSources: [
      { datasource: S1GRD, id: 's1' },
      { datasource: S2L2A, id: 'l2a' },
    ],
    responses: [
      {
        identifier: 'default',
        format: 'image/jpeg',
        idx: 0,
      },
    ],
    byocLocation: 'aws-eu-central-1',
    byocCollectionType: '',
    byocCollectionId: '',
    consoleValue: '',
  },
  reducers: {
    setDatasource: (state, action) => {
      state.datasource = action.payload;
    },
    setDatasourceAndEvalscript: (state, action) => {
      state.datasource = action.payload;
      state.evalscript = DEFAULT_EVALSCRIPTS[action.payload];

      //Reset advanced options on datasource change
      resetAdvancedOptions(state);
    },
    setTimeFrom: (state, action) => {
      state.timeFrom[action.payload.idx] = action.payload.timeFrom;
    },
    setTimeTo: (state, action) => {
      state.timeTo[action.payload.idx] = action.payload.timeTo;
    },
    addTimeRange: (state) => {
      state.timeFrom.push(moment.utc().subtract(1, 'month').startOf('day').format());
      state.timeTo.push(moment.utc().startOf('day').format());
    },
    deleteTimerange: (state, action) => {
      state.timeFrom = state.timeFrom
        .slice(0, parseInt(action.payload))
        .concat(state.timeFrom.slice(parseInt(action.payload) + 1));
      state.timeTo = state.timeTo
        .slice(0, parseInt(action.payload))
        .concat(state.timeTo.slice(parseInt(action.payload) + 1));
    },
    //set timeranges as an already declared array
    // action.payload = [{timeFrom: somedate, timeTo: date}, ...]
    setTimeRanges: (state, action) => {
      let validTimeRanges = action.payload
        .map((timerange) => {
          if (timerange.timeFrom && timerange.timeTo) {
            return timerange;
          }
          return undefined;
        })
        .filter((el) => el);

      state.timeFrom = validTimeRanges.map((tr) => tr.timeFrom);
      state.timeTo = validTimeRanges.map((tr) => tr.timeTo);
    },
    disableTimerange: (state, action) => {
      state.isTimeRangeDisabled = action.payload;
    },
    setHeightOrRes: (state, action) => {
      state.heightOrRes = action.payload;
    },
    setWidthOrHeight: (state, action) => {
      const { x, y } = action.payload;
      if (x !== undefined) {
        state.width = x === '' ? '' : x;
      }
      if (y !== undefined) {
        state.height = y === '' ? '' : y;
      }
    },
    setWidth: (state, action) => {
      state.width = action.payload;
    },
    setHeight: (state, action) => {
      state.height = action.payload;
    },
    setIsAutoRatio: (state, action) => {
      state.isAutoRatio = action.payload;
    },
    setEvalscript: (state, action) => {
      state.evalscript = action.payload;
    },
    setCRS: (state, action) => {
      state.CRS = action.payload;
    },
    setGeometry: (state, action) => {
      state.geometry = action.payload;

      if (action.payload.length === 4) {
        state.geometryType = 'BBOX';
      } else if (action.payload.type === 'Polygon' || action.payload.type === 'MultiPolygon') {
        state.geometryType = 'POLYGON';
      }
    },
    resetGeometry: (state) => {
      state.geometryType = '';
      state.geometry = '';
    },
    setDataFilterOptions: (state, action) => {
      let idx = (action.payload && action.payload.idx) || 0;
      delete action.payload.idx;

      state.dataFilterOptions[idx].options = {
        ...state.dataFilterOptions[idx].options,
        ...action.payload,
      };
    },
    setProcessingOptions: (state, action) => {
      let idx = (action.payload && action.payload.idx) || 0;
      delete action.payload.idx;

      state.processingOptions[idx].options = {
        ...state.processingOptions[idx].options,
        ...action.payload,
      };
    },
    resetAdvancedOptions: (state, action) => {
      let idx = action.payload || 0;

      state.dataFilterOptions[idx] = {
        options: {},
        idx: idx,
      };
      state.processingOptions[idx] = {
        options: {},
        idx: idx,
      };
    },
    setMode: (state, action) => {
      state.mode = action.payload;

      if (action.payload === 'BATCH' && state.responses[0].format === 'image/jpeg') {
        state.responses[0].format = 'image/png';
      }
    },
    setDatafusionSource: (state, action) => {
      const datasource = action.payload.datasource;
      state.datafusionSources[action.payload.idx].datasource = datasource;
      // Set id
      let newId = DATASOURCES[datasource].defaultDatafusionId;
      if (newId) {
        state.datafusionSources[action.payload.idx].id = newId;
      }

      //Reset advanced options on datasource change
      const idx = action.payload.idx;
      state.dataFilterOptions[idx] = {
        options: {},
        idx: idx,
      };
      state.processingOptions[idx] = {
        options: {},
        idx: idx,
      };
    },
    setDatafusionSourcesAbs: (state, action) => {
      state.datafusionSources = action.payload;

      //Push processingOptions and Datafilter options based on length of action.payload (datafusionSources)
      let len = action.payload.length;
      for (let i = 2; i < len; i++) {
        state.processingOptions.push({
          options: {},
          idx: i,
        });
        state.dataFilterOptions.push({
          options: {},
          idx: i,
        });
      }
    },
    setDataFusionId: (state, action) => {
      state.datafusionSources[action.payload.idx].id = action.payload.id;
    },
    addDatafusionSource: (state) => {
      state.datafusionSources.push({ datasource: S2L2A, id: '' });
      // add new options on processing and datafilter
      const lastIdx = state.dataFilterOptions[state.dataFilterOptions.length - 1].idx;
      state.processingOptions.push({
        options: {},
        idx: lastIdx + 1,
      });
      state.dataFilterOptions.push({
        options: {},
        idx: lastIdx + 1,
      });
    },
    deleteDatafusionSource: (state, action) => {
      let idx = parseInt(action.payload);
      if (idx > 1) {
        state.datafusionSources = state.datafusionSources
          .slice(0, idx)
          .concat(state.datafusionSources.slice(idx + 1));
        state.processingOptions = state.processingOptions
          .slice(0, idx)
          .concat(state.processingOptions.slice(idx + 1));
        state.dataFilterOptions = state.dataFilterOptions
          .slice(0, idx)
          .concat(state.dataFilterOptions.slice(idx + 1));
      }
    },
    addResponse: (state) => {
      const lastItem = state.responses[state.responses.length - 1];

      state.responses.push({
        identifier: '',
        format: 'image/jpeg',
        idx: lastItem.idx + 1,
      });
    },
    setResponse: (state, action) => {
      //payload: {idx: Int, format?: Format, identifier?: String}
      const response = state.responses.find((resp) => resp.idx === action.payload.idx);

      if (action.payload.format !== undefined) {
        response.format = action.payload.format;
      }
      if (action.payload.identifier !== undefined) {
        response.identifier = action.payload.identifier;
      }
    },
    deleteResponse: (state, action) => {
      // payload: idx (Int)
      state.responses = state.responses.filter((resp) => resp.idx !== action.payload);
    },
    setResponses: (state, action) => {
      state.responses = action.payload;
    },
    setByocLocation: (state, action) => {
      state.byocLocation = action.payload;
    },
    setConsoleValue: (state, action) => {
      state.consoleValue = '> ' + action.payload.slice(0, -2);
    },
    setByocCollectionType: (state, action) => {
      state.byocCollectionType = action.payload;
    },
    setByocCollectionId: (state, action) => {
      state.byocCollectionId = action.payload;
    },
  },
});

export const wmsSlice = createSlice({
  name: 'wms',
  initialState: {
    instanceId: '',
    layerId: '',
    datasource: '',
    mode: 'WMS',
    advancedOptions: {},
  },
  reducers: {
    setInstanceId: (state, action) => {
      state.instanceId = action.payload;
    },
    setLayerId: (state, action) => {
      state.layerId = action.payload;
    },
    setDatasource: (state, action) => {
      state.datasource = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setAdvancedOptions: (state, action) => {
      state.advancedOptions = { ...state.advancedOptions, ...action.payload };
    },
    resetAdvancedOptions: (state) => {
      state.advancedOptions = {};
    },
  },
});

const batchInitialState = {
  tillingGrid: 0,
  resolution: 10,
  description: '',
  bucketName: '',
  selectedBatchId: '',
  cogOutput: false,
  defaultTilePath: '',
  // bucketName -> true, if defaultTilePath -> false
  specifyingBucketName: true,
  extraInfo: '',
  specifyingCogParams: false,
  overviewLevels: '',
  overviewMinSize: '',
  blockxsize: '',
  blockysize: '',
  createCollection: false,
  collectionId: '',
};

export const batchSlice = createSlice({
  name: 'batch',
  initialState: batchInitialState,
  reducers: {
    setTillingGrid: (state, action) => {
      state.tillingGrid = action.payload;
    },
    setResolution: (state, action) => {
      state.resolution = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setBucketName: (state, action) => {
      state.bucketName = action.payload;
    },
    setSelectedBatchId: (state, action) => {
      state.selectedBatchId = action.payload;
    },
    setCogOutput: (state, action) => {
      state.cogOutput = action.payload;
    },
    setDefaultTilePath: (state, action) => {
      state.defaultTilePath = action.payload;
    },
    setSpecifyingBucketName: (state, action) => {
      state.specifyingBucketName = action.payload;
    },
    setExtraInfo: (state, action) => {
      state.extraInfo = action.payload;
    },
    setOverviewLevels: (state, action) => {
      state.overviewLevels = action.payload;
    },
    setOverviewMinSize: (state, action) => {
      state.overviewMinSize = action.payload;
    },
    setBlockxsize: (state, action) => {
      state.blockxsize = action.payload;
    },
    setBlockysize: (state, action) => {
      state.blockysize = action.payload;
    },
    setCreateCollection: (state, action) => {
      state.createCollection = action.payload;
    },
    setCollectionId: (state, action) => {
      state.collectionId = action.payload;
    },
    setSpecifyingCogParams: (state, action) => {
      state.specifyingCogParams = action.payload;
    },
    resetBatchState: (state) => {
      state = batchInitialState;
    },
  },
});

// Common TPDI options
export const tpdiSlice = createSlice({
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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //eslint-disable-next-line
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    type: null,
    text: '',
    id: null,
  },
  reducers: {
    addAlert: (state, action) => {
      const { type, text } = action.payload;
      const time = action.payload.time ?? 2500;
      state.text = text;
      state.type = type;
      let id = uuidv4();
      state.id = id;

      setTimeout(() => {
        store.dispatch(alertSlice.actions.removeAlert(id));
      }, time);
    },
    removeAlert: (state, action) => {
      if (action.payload === state.id) {
        state.type = null;
        state.text = '';
        state.id = '';
      }
    },
  },
});

export const responsesSlice = createSlice({
  name: 'response',
  initialState: {
    src: 'testUrl',
    show: false,
    dimensions: [],
    error: '',
    fisResponse: '',
    isTar: false,
  },
  reducers: {
    setResponseUrl: (state, action) => {
      state.src = action.payload;
    },
    setShow: (state, action) => {
      // reset state when close modal.
      if (!action.payload) {
        state.src = '';
        state.dimensions = [];
        state.error = '';
        state.fisResponse = '';
        state.isTar = false;
      }
      state.show = action.payload;
    },
    setDimensions: (state, action) => {
      state.dimensions = action.payload;
    },
    setResponse: (state, action) => {
      state.src = action.payload.src;
      state.show = true;
      state.isTar = action.payload.isTar;
      if (action.payload.dimensions) {
        state.dimensions = action.payload.dimensions;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFisResponse: (state, action) => {
      state.fisResponse = action.payload;
    },
  },
});

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    isTimeToOpen: false,
    isTimeFromOpen: false,
    selectedCollection: '',
    queryProperties: [],
    limit: 10,
    next: '',
    disableInclude: true,
    includeFields: [''],
    disableExclude: true,
    excludeFields: [''],
    distinct: '',
  },
  reducers: {
    openTimeFrom: (state, action) => {
      state.isTimeFromOpen = action.payload;
    },
    openTimeTo: (state, action) => {
      state.isTimeToOpen = action.payload;
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
      state.queryProperties = [];
    },
    addQueryProperty: (state, action) => {
      state.queryProperties.push({
        propertyName: '',
        propertyValue: '',
        operator: '',
      });
    },
    removeQueryProperty: (state, action) => {
      let idx = action.payload;
      state.queryProperties = state.queryProperties
        .slice(0, idx)
        .concat(state.queryProperties.slice(idx + 1));
    },
    setQueryProperty: (state, action) => {
      let idx = action.payload.idx;
      if (action.payload.propertyName !== undefined) {
        state.queryProperties[idx] = {
          propertyName: action.payload.propertyName,
          propertyValue: '',
          operator: '',
        };
      }
      if (action.payload.propertyValue) {
        state.queryProperties[idx].propertyValue = action.payload.propertyValue;
      }
      if (action.payload.operator) {
        state.queryProperties[idx].operator = action.payload.operator;
      }
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    addIncludeField: (state) => {
      state.includeFields.push('');
    },
    addExcludeField: (state) => {
      state.excludeFields.push('');
    },
    deleteIncludeField: (state, action) => {
      const idx = action.payload;
      state.includeFields = state.includeFields.slice(0, idx).concat(state.includeFields.slice(idx + 1));
    },
    deleteExcludeField: (state, action) => {
      const idx = action.payload;
      state.excludeFields = state.excludeFields.slice(0, idx).concat(state.excludeFields.slice(idx + 1));
    },
    setIncludeField: (state, action) => {
      let idx = action.payload.idx;
      state.includeFields[idx] = action.payload.value;
    },
    setExcludeField: (state, action) => {
      let idx = action.payload.idx;
      state.excludeFields[idx] = action.payload.value;
    },
    setDisableIncludeFields: (state, action) => {
      state.disableInclude = action.payload;
    },
    setDisableExcludeFields: (state, action) => {
      state.disableExclude = action.payload;
    },
    setDistinct: (state, action) => {
      state.distinct = action.payload;
    },
    setNext: (state, action) => {
      state.next = action.payload;
    },
    // addSelectedCollection: (state, action) => {
    //   state.selectedCollections.push(action.payload);
    // },
    // removeFromSelectedCollections: (state, action) => {
    //   let idx = state.selectedCollections.indexOf(action.payload);
    //   state.selectedCollections = state.selectedCollections
    //     .slice(0, idx)
    //     .concat(state.selectedCollections.slice(idx + 1));
    // },
  },
});

const reducers = combineReducers({
  auth: authSlice.reducer,
  request: requestSlice.reducer,
  batch: batchSlice.reducer,
  tpdi: tpdiSlice.reducer,
  airbus: airbusSlice.reducer,
  planet: planetSlice.reducer,
  alert: alertSlice.reducer,
  wms: wmsSlice.reducer,
  response: responsesSlice.reducer,
  catalog: catalogSlice.reducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
