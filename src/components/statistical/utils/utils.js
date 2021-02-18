import store from '../../../store';
import statisticalSlice, { initialHistogramState } from '../../../store/statistical';
import requestSlice from '../../../store/request';
import {
  getRequestBody,
  dispatchBounds,
  dispatchDatasource,
  dispatchAdvancedOptions,
} from '../../process/requests/parseRequest';

export const statisticalRequestStateSelector = (state) => ({
  token: state.auth.user.access_token,
  datasource: state.request.datasource,
  datafusionSources: state.request.datafusionSources,
  byocCollectionType: state.request.byocCollectionType,
  byocCollectionId: state.request.byocCollectionId,
  dataFilterOptions: state.request.dataFilterOptions,
  processingOptions: state.request.processingOptions,
  evalscript: state.request.evalscript,
  geometry: state.request.geometry,
  crs: state.request.CRS,
  geometryType: state.request.geometryType,
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
  }
};

const dispatchStatisticsState = (request) => {
  dispatchAggregation(request.aggregation);
  dispatchCalculations(request.calculations);
  dispatchInput(request.input);
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
  }
  if (aggregation.aggregationInterval && aggregation.aggregationInterval.of) {
    store.dispatch(statisticalSlice.actions.setAggregationInterval(aggregation.aggregationInterval.of));
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
};

const dispatchInput = (input) => {
  dispatchBounds({ input });
  dispatchDatasource({ input });
  dispatchAdvancedOptions({ input });
};
