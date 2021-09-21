import omit from 'lodash.omit';
import { isEmpty } from '../../utils/commonUtils';
import { CUSTOM } from '../../utils/const/const';
import { generateBounds, getNonDefaultOptions } from '../process/utils';

export const getStatisticalRequestBody = (
  dataCollections,
  dataFilterOptions,
  processingOptions,
  bounds,
  dimensions,
  evalscript,
  timeRange,
  statisticalState,
) => {
  const requestBody = {
    input: {
      bounds: {
        ...getStatisticalBounds(bounds),
      },
      data: getStatisticalDataArray(dataCollections, dataFilterOptions, processingOptions),
    },
    aggregation: {
      ...getStatisticalAggregation(timeRange, dimensions, statisticalState),
      evalscript: evalscript,
    },
    ...getStatisticalCalculations(statisticalState),
  };

  return requestBody;
};

const getStatisticalBounds = (bounds) => {
  return generateBounds(bounds);
};

const getOptions = (options, name, getEmpty = false) => {
  const nonDefaultOptions = getNonDefaultOptions(options);
  if (getEmpty || Object.keys(nonDefaultOptions).length > 0) {
    return {
      [name]: nonDefaultOptions,
    };
  }
  return {};
};

const getStatisticalDataArray = (dataCollections, dataFilterOptions, processingOptions) => {
  const isDataFusion = dataCollections.length > 1;
  return dataCollections.map((dataCol, idx) => {
    let dataObj = {
      ...getOptions(dataFilterOptions[idx].options, 'dataFilter', true),
      ...getOptions(processingOptions[idx].options, 'processing'),
    };
    if (isDataFusion) {
      dataObj.id = dataCol.id;
    }
    if (dataCol.type === CUSTOM) {
      dataObj.type = `${dataCol.byocCollectionType.toLowerCase()}-${dataCol.byocCollectionId}`;
    } else {
      dataObj.type = dataCol.type;
    }
    return dataObj;
  });
};

const getStatisticalAggregation = (timeRange, dimensions, statisticalState) => {
  const aggregation = {
    timeRange: {
      from: timeRange.timeFrom,
      to: timeRange.timeTo,
    },
    aggregationInterval: {
      of: statisticalState.aggregationInterval,
    },
    ...getStatisticalDimensions(dimensions),
  };
  return aggregation;
};

const getStatisticalDimensions = (dimensions) => {
  const { width, height, heightOrRes } = dimensions;
  if (heightOrRes === 'HEIGHT') {
    return {
      width,
      height,
    };
  } else {
    return {
      resx: width,
      resy: height,
    };
  }
};

const generateHistogramContent = (histogram) => {
  const { histogramBinsMethod } = histogram;
  const resHist = {};
  if (histogramBinsMethod === 'BINS') {
    resHist.bins = histogram.bins;
  } else {
    if (histogramBinsMethod === 'NBINS') {
      resHist.nBins = histogram.nBins;
    }
    if (histogramBinsMethod === 'BINWIDTH') {
      resHist.binWidth = histogram.binWidth;
    }
    if (histogram.lowEdge !== '') {
      resHist.lowEdge = histogram.lowEdge;
    }
    if (histogram.highEdge !== '') {
      resHist.highEdge = histogram.highEdge;
    }
  }

  return resHist;
};

export const getStatisticalCalculations = (statisticalState) => {
  return {
    calculations: statisticalState.calculations.reduce((acc1, calculation) => {
      const histograms = calculation.histograms.reduce((acc2, histogram) => {
        return {
          ...acc2,
          [histogram.histogramBandName]: {
            ...generateHistogramContent(histogram),
          },
        };
      }, {});
      const histogramsObj = isEmpty(histograms) ? {} : { histograms: histograms };

      const statistics = calculation.statistics.reduce((statAcc, statistic) => {
        return {
          ...statAcc,
          [statistic.statisticsBandName]: {
            percentiles: {
              ...omit(statistic, ['statisticsBandName']),
            },
          },
        };
      }, {});
      const statisticsObj = isEmpty(statistics) ? {} : { statistics: statistics };

      return {
        ...acc1,
        [calculation.outputName]: {
          ...histogramsObj,
          ...statisticsObj,
        },
      };
    }, {}),
  };
};

export const getStatisticalAuthConfig = (token, reqConfig) => {
  return {
    ...reqConfig,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};
