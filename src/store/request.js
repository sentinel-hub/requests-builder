import { createSlice } from '@reduxjs/toolkit';
import {
  DEFAULT_EVALSCRIPTS,
  S1GRD,
  S2L2A,
  DATASOURCES,
  DEFAULT_STATISTICAL_EVALSCRIPT,
} from '../utils/const';
import moment from 'moment';

const PROCESS_INITIAL_STATE = {
  mode: 'PROCESS',
  datasource: S2L2A,
  //default times: today and one month ago.
  timeFrom: [moment.utc().subtract(1, 'month').startOf('day').format()],
  timeTo: [moment.utc().endOf('day').format()],
  isTimeRangeDisabled: false,
  heightOrRes: 'HEIGHT',
  isOnAutoRes: true,
  width: 512,
  height: 512,
  isAutoRatio: true,
  evalscript: DEFAULT_EVALSCRIPTS[S2L2A],
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
};

const requestSlice = createSlice({
  name: 'request',
  initialState: PROCESS_INITIAL_STATE,
  reducers: {
    setDatasource: (state, action) => {
      state.datasource = action.payload;

      resetAdvancedOptions(state);
    },
    // setDatasourceAndEvalscript: (state, action) => {
    //   state.datasource = action.payload;
    //   state.evalscript = DEFAULT_EVALSCRIPTS[action.payload];

    //   //Reset advanced options on datasource change
    //   resetAdvancedOptions(state);
    // },
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
    setIsOnAutoRes: (state, action) => {
      state.isOnAutoRes = action.payload;
    },
    setEvalscript: (state, action) => {
      state.evalscript = action.payload;
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

      if (action.payload === 'BATCH') {
        if (state.responses[0].format === 'image/jpeg') {
          state.responses[0].format = 'image/png';
        }
        if (!DATASOURCES[state.datasource].isBatchSupported) {
          state.datasource = S2L2A;
        }
      }
      // Todo: remove once normal defaults work.
      if (action.payload === 'STATISTICAL') {
        state.evalscript = DEFAULT_STATISTICAL_EVALSCRIPT;
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
    resetState: (state, action) => {
      const { resetMode } = action.payload;
      if (resetMode) {
        return PROCESS_INITIAL_STATE;
      }
      return { ...PROCESS_INITIAL_STATE, mode: state.mode };
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

export default requestSlice;
