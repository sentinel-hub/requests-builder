import { createSlice } from '@reduxjs/toolkit';

export const initialHistogramState = {
  histogramBandName: 'default',
  nBins: '',
  lowEdge: '',
  highEdge: '',
  binWidth: '',
  bins: [],
  histogramBinsMethod: 'NBINS', // one of NBINS - BINS - BINWIDTH
};
const intialStatisticsState = {
  statisticsBandName: 'default',
  k: [],
  interpolation: 'higher',
};
const initialCalcState = {
  outputName: 'default',
  histograms: [],
  statistics: [],
};

const statisticalSlice = createSlice({
  name: 'statistical',
  initialState: {
    aggregationInterval: 'P10D',
    lastIntervalBehavior: '',
    calculations: [initialCalcState],
  },
  reducers: {
    setAggregationInterval: (state, action) => {
      state.aggregationInterval = action.payload;
    },
    setLastIntervalBehavior: (state, action) => {
      state.lastIntervalBehavior = action.payload;
    },
    addEmptyCalculation: (state) => {
      state.calculations.push({ ...initialCalcState, outputName: '' });
    },
    deleteCalculation: (state, action) => {
      const { idx } = action.payload;
      state.calculations = state.calculations.slice(0, idx).concat(state.calculations.slice(idx + 1));
    },
    setHistogramParam: (state, action) => {
      const { param, value, idx, histIdx } = action.payload;
      state.calculations[idx].histograms[histIdx][param] = value;
    },
    setOutputName: (state, action) => {
      const { idx, name } = action.payload;
      state.calculations[idx].outputName = name;
    },
    addEmptyHistogram: (state, action) => {
      const { idx } = action.payload;
      const isThereDefaultHist = state.calculations[idx].histograms.find(
        (hist) => hist.histogramBandName === 'default',
      );
      const newHistogram = isThereDefaultHist
        ? { ...initialHistogramState, histogramBandName: '' }
        : initialHistogramState;
      state.calculations[idx].histograms.push(newHistogram);
    },
    deleteHistogram: (state, action) => {
      const { histIdx, idx } = action.payload;
      const histograms = state.calculations[idx].histograms;
      state.calculations[idx].histograms = histograms.slice(0, histIdx).concat(histograms.slice(histIdx + 1));
    },
    setCalculationsAbsolute: (state, action) => {
      state.calculations = action.payload;
    },
    addEmptyStatisticsObject: (state, action) => {
      const { idx } = action.payload;
      const isThereDefaultStatistics = state.calculations[idx].statistics.find(
        (stats) => stats.statisticsBandName === 'default',
      );
      const newStatsObj = isThereDefaultStatistics
        ? { ...intialStatisticsState, statisticsBandName: '' }
        : intialStatisticsState;
      state.calculations[idx].statistics.push(newStatsObj);
    },
    deleteStatistics: (state, action) => {
      const { statIdx, idx } = action.payload;
      const statistics = state.calculations[idx].statistics;
      state.calculations[idx].statistics = statistics.slice(0, statIdx).concat(statistics.slice(statIdx + 1));
    },
    setStatisticsParam: (state, action) => {
      const { param, value, idx, statIdx } = action.payload;
      state.calculations[idx].statistics[statIdx][param] = value;
    },
  },
});

export default statisticalSlice;
