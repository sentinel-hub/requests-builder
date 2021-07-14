import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
  S2L2A,
  DATASOURCES,
  getStatisticalDefaultEvalscript,
  batchDataCollectionNames,
  statisticalDataCollectionNames,
  CUSTOM,
} from '../utils/const/const';
import moment from 'moment';
import { DEFAULT_S2_EVALSCRIPT } from '../utils/const/constEvalscript';
import alertSlice from './alert';
import { doesModeSupportCrossRegion } from '../utils/commonUtils';

const PROCESS_INITIAL_STATE = {
  mode: 'PROCESS',
  //default times: today and one month ago.
  timeFrom: [moment.utc().subtract(1, 'month').startOf('day').format()],
  timeTo: [moment.utc().endOf('day').format()],
  isTimeRangeDisabled: false,
  heightOrRes: 'HEIGHT',
  isOnAutoRes: true,
  width: 512,
  height: 512,
  isAutoRatio: true,
  evalscript: DEFAULT_S2_EVALSCRIPT,
  // Array with options and index to individually modify certain options on datafusion
  dataFilterOptions: [
    {
      options: {},
      idx: 0,
    },
  ],
  processingOptions: [
    {
      options: {},
      idx: 0,
    },
  ],
  responses: [
    {
      identifier: 'default',
      format: 'image/jpeg',
      idx: 0,
    },
  ],
  consoleValue: '',
  dataCollections: [
    {
      type: S2L2A,
      byocCollectionId: '',
      byocCollectionType: '',
      byocCollectionLocation: '',
      id: '',
    },
  ],
  isRequestRunning: false,
};

const requestSlice = createSlice({
  name: 'request',
  initialState: PROCESS_INITIAL_STATE,
  reducers: {
    setDataCollection: (state, action) => {
      let idx = 0;
      if (action.payload.idx) {
        idx = action.payload.idx;
      }
      state.dataCollections[idx].type = action.payload.dataCollection;

      resetAdvancedOptions(state, idx);
    },
    addDataCollection: (state) => {
      state.dataCollections.push({
        type: S2L2A,
        byocCollectionId: '',
        byocCollectionType: '',
        byocCollectionLocation: '',
        id: '',
      });
      const currenLen = state.dataFilterOptions.length;
      state.dataFilterOptions.push({
        options: {},
        idx: currenLen,
      });
      state.processingOptions.push({
        options: {},
        idx: currenLen,
      });
    },
    removeDataCollection: (state, action) => {
      const { idx } = action.payload;
      state.dataCollections = state.dataCollections
        .slice(0, idx)
        .concat(state.dataCollections.slice(idx + 1));
      state.processingOptions = state.processingOptions
        .slice(0, idx)
        .concat(state.processingOptions.slice(idx + 1));
      state.dataFilterOptions = state.dataFilterOptions
        .slice(0, idx)
        .concat(state.dataFilterOptions.slice(idx + 1));
    },
    setDataCollectionId: (state, action) => {
      const { idx, id } = action.payload;
      state.dataCollections[idx].id = id;
    },
    setByocCollectionId: (state, action) => {
      let idx = 0;
      if (action.payload.idx) {
        idx = action.payload.idx;
      }
      state.dataCollections[idx].byocCollectionId = action.payload.id;
    },
    setByocLocation: (state, action) => {
      let idx = 0;
      if (action.payload.idx) {
        idx = action.payload.idx;
      }
      state.dataCollections[idx].byocCollectionLocation = action.payload.location;
    },
    setByocCollectionType: (state, action) => {
      let idx = 0;
      if (action.payload.idx) {
        idx = action.payload.idx;
      }
      state.dataCollections[idx].byocCollectionType = action.payload.type;
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
      const idx = action.payload.idx;
      state.dataFilterOptions[idx].options = {};
      state.processingOptions[idx].options = {};
    },
    setMode: (state, action) => {
      state.mode = action.payload;

      if (action.payload === 'BATCH') {
        if (state.responses[0].format === 'image/jpeg') {
          state.responses[0].format = 'image/png';
        }
        const firstSupportedBatchCollection = batchDataCollectionNames[0];
        state.dataCollections.forEach((dataCol, idx) => {
          if (!DATASOURCES[dataCol.type].isBatchSupported) {
            const notSupported = dataCol.type;
            state.dataCollections[idx].type = firstSupportedBatchCollection;
            resetAdvancedOptions(state, idx);
            action.asyncDispatch(
              alertSlice.actions.addAlert({
                text: `${notSupported} has been set to ${firstSupportedBatchCollection} since it's not supported on BATCH`,
                type: 'WARNING',
                time: 5000,
              }),
            );
          }
        });
      }

      if (action.payload === 'STATISTICAL') {
        const firstSupportedStatCollection = statisticalDataCollectionNames[0];
        state.dataCollections.forEach((dataCol, idx) => {
          if (!DATASOURCES[dataCol.type].isStatApiSupported) {
            const notSupported = dataCol.type;
            state.dataCollections[idx].type = firstSupportedStatCollection;
            resetAdvancedOptions(state, idx);
            action.asyncDispatch(
              alertSlice.actions.addAlert({
                text: `${notSupported} has been set to ${firstSupportedStatCollection} since it's not supported on STAT API`,
                type: 'WARNING',
                time: 5000,
              }),
            );
          }
        });
        if (state.dataCollections.length === 1) {
          state.evalscript = getStatisticalDefaultEvalscript(state.dataCollections[0].type);
        }
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
    setConsoleValue: (state, action) => {
      state.consoleValue = '> ' + action.payload.slice(0, -2);
    },
    resetState: (state, action) => {
      const { resetMode } = action.payload;
      if (resetMode) {
        return PROCESS_INITIAL_STATE;
      }
      return { ...PROCESS_INITIAL_STATE, mode: state.mode };
    },
    setIsRunningRequest: (state, action) => {
      state.isRequestRunning = action.payload;
    },
  },
});

const resetAdvancedOptions = (state, idx) => {
  state.dataFilterOptions[idx].options = {};
  state.processingOptions[idx].options = {};
};

export default requestSlice;

export const isInvalidDatafusionState = createSelector(
  (state) => state,
  (state) => {
    if (state.dataCollections.length === 1 || doesModeSupportCrossRegion(state.appMode)) {
      return false;
    }
    const withByocFiltered = state.dataCollections.filter((dc) => dc.type !== CUSTOM);
    if (withByocFiltered.length === 0) {
      return false;
    }
    const firstRegion = DATASOURCES[withByocFiltered[0].type].region;
    for (let dataCol of withByocFiltered) {
      // ignore byoc
      if (dataCol.type !== CUSTOM && DATASOURCES[dataCol.type].region !== firstRegion) {
        return true;
      }
    }
    return false;
  },
);
