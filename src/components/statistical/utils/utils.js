import store from '../../../store';
import statisticalSlice, { initialHistogramState } from '../../../store/statistical';
import requestSlice from '../../../store/request';
import {
  getRequestBody,
  dispatchBounds,
  dispatchDatasource,
  dispatchAdvancedOptions,
} from '../../process/requests/parseRequest';
import { isWritingDecimal } from '../../../utils/stringUtils';
import { addSuccessAlert, addWarningAlert } from '../../../store/alert';

export const statisticalRequestStateSelector = (state) => ({
  token: state.auth.user.access_token,
  dataCollections: state.request.dataCollections,
  dataFilterOptions: state.request.dataFilterOptions,
  processingOptions: state.request.processingOptions,
  evalscript: state.request.evalscript,
  convertedGeometry: state.map.convertedGeometry,
  selectedCrs: state.map.selectedCrs,
  timeFrom: state.request.timeFrom[0],
  timeTo: state.request.timeTo[0],
  heightOrRes: state.request.heightOrRes,
  width: state.request.width,
  height: state.request.height,
  statisticalState: state.statistical,
});

export const handleStatisticalParse = (text) => {
  try {
    const request = JSON.parse(getRequestBody(text));
    dispatchStatisticsState(request);
  } catch (err) {
    console.error('Something went wrong while parsing the request', err);
    addWarningAlert('Error parsing the request json');
  }
};

const dispatchStatisticsState = (request) => {
  dispatchAggregation(request.aggregation);
  const calcsError = dispatchCalculations(request.calculations);
  const inputErrors = dispatchInput(request.input);
  const errors = inputErrors.concat(calcsError).filter((er) => er);
  if (errors.length > 0) {
    addWarningAlert(inputErrors.concat(errors).join('\n'), 5000);
  } else {
    addSuccessAlert('Successfully parsed');
  }
};

const dispatchAggregation = (aggregation) => {
  if (!aggregation) {
    return;
  }
  if (aggregation.timeRange && aggregation.timeRange.from && aggregation.timeRange.to) {
    store.dispatch(
      requestSlice.actions.setTimeRanges([
        { timeFrom: aggregation.timeRange.from, timeTo: aggregation.timeRange.to },
      ]),
    );
    store.dispatch(requestSlice.actions.disableTimerange(false));
  }
  if (aggregation.aggregationInterval) {
    if (aggregation.aggregationInterval.of) {
      store.dispatch(statisticalSlice.actions.setAggregationInterval(aggregation.aggregationInterval.of));
    }
    if (aggregation.aggregationInterval.lastIntervalBehavior) {
      store.dispatch(
        statisticalSlice.actions.setLastIntervalBehavior(
          aggregation.aggregationInterval.lastIntervalBehavior,
        ),
      );
    }
  }
  // Dimensions
  if (aggregation.resx && aggregation.resy) {
    store.dispatch(requestSlice.actions.setIsOnAutoRes(false));
    store.dispatch(requestSlice.actions.setHeightOrRes('RES'));
    store.dispatch(requestSlice.actions.setWidth(aggregation.resx));
    store.dispatch(requestSlice.actions.setHeight(aggregation.resy));
  } else if (aggregation.width && aggregation.height) {
    store.dispatch(requestSlice.actions.setIsAutoRatio(false));
    store.dispatch(requestSlice.actions.setHeightOrRes('HEIGHT'));
    store.dispatch(requestSlice.actions.setWidth(aggregation.width));
    store.dispatch(requestSlice.actions.setHeight(aggregation.height));
  }

  // evalscript
  store.dispatch(requestSlice.actions.setEvalscript(aggregation.evalscript ?? ''));
};

const dispatchCalculations = (calculations) => {
  if (!calculations) {
    return;
  }
  const getHistogramMethod = (histogram) => {
    if (histogram.nBins) {
      return 'NBINS';
    }
    if (histogram.bins) {
      return 'BINS';
    }
    if (histogram.binWidth) {
      return 'BINWIDTH';
    }
  };
  try {
    const stateCalculations = Object.entries(calculations).map(([key, value]) => {
      return {
        outputName: key,
        histograms: value.histograms
          ? Object.entries(value.histograms).map(([key, value]) => {
              return {
                ...initialHistogramState,
                histogramBandName: key,
                histogramBinsMethod: getHistogramMethod(value),
                ...value,
              };
            })
          : [],
        statistics: value.statistics
          ? Object.entries(value.statistics).map(([key, value]) => {
              return {
                statisticsBandName: key,
                k: value.percentiles?.k ?? [],
                interpolation: value.percentiles?.interpolation ?? 'higher',
              };
            })
          : [],
      };
    });

    store.dispatch(statisticalSlice.actions.setCalculationsAbsolute(stateCalculations));
  } catch (err) {
    return 'Error while parsing calculations';
  }
};

const dispatchInput = (input) => {
  dispatchBounds({ input });
  dispatchDatasource({ input });
  const optionsErr = dispatchAdvancedOptions({ input });
  return [optionsErr].filter((err) => err);
};

export const inputToNumber = (value) => {
  if (value === '' || Number.isNaN(Number(value))) {
    return '';
  }
  if (isWritingDecimal(value)) {
    return value;
  }
  return Number(value);
};

export const inputArrayChangeHandler = (e) => {
  const lastChar = e.target.value.slice(-1);
  let dispatchedValue;
  // clear input
  if (e.target.value === '') {
    dispatchedValue = '';
  }
  // allow only using [0-9] , and .
  else if (!/^[0-9.,]/.test(lastChar)) {
    return;
  } else {
    dispatchedValue = e.target.value.split(',').map(inputToNumber);
  }

  return dispatchedValue;
};
