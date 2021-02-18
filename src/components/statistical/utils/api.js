import Axios from 'axios';
import omit from 'lodash.omit';
import { isEmpty } from '../../../utils/const';
import { generateBounds, getNonDefaultOptions } from '../../process/requests';
import { getRequestBody, getUrlFromCurl } from '../../process/requests/parseRequest';

const getAuthConfig = (token, reqConfig) => {
  return {
    ...reqConfig,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

const STATISTICAL_BASE_URL = 'https://test.hq.sentinel-hub.com/api/v1/statistics';

export const getStatisticalRequest = (
  token,
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
  bounds,
  dimensions,
  evalscript,
  timeRange,
  statisticalState,
  reqConfig,
) => {
  const config = getAuthConfig(token, reqConfig);
  const body = getStatisticalRequestBody(
    datasource,
    datafusionSources,
    byocCollectionType,
    byocCollectionId,
    dataFilterOptions,
    processingOptions,
    bounds,
    dimensions,
    evalscript,
    timeRange,
    statisticalState,
  );
  return Axios.post(STATISTICAL_BASE_URL, body, config);
};

export const getStatisticalRequestBody = (
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
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
      data: getStatisticalDataArray(
        datasource,
        datafusionSources,
        byocCollectionType,
        byocCollectionId,
        dataFilterOptions,
        processingOptions,
      ),
    },
    aggregation: {
      ...getStatisticalAggregation(timeRange, dimensions, statisticalState),
      evalscript: evalscript,
    },
    ...getStatisticalCalculations(statisticalState),
  };

  return requestBody;
};

export const getStatisticalCurlCommand = (
  token,
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
  bounds,
  dimensions,
  evalscript,
  timeRange,
  statisticalState,
) => {
  const body = getStatisticalRequestBody(
    datasource,
    datafusionSources,
    byocCollectionType,
    byocCollectionId,
    dataFilterOptions,
    processingOptions,
    bounds,
    dimensions,
    evalscript,
    timeRange,
    statisticalState,
  );
  const curlCommand = `curl -X POST ${STATISTICAL_BASE_URL} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ?? '<your token here>'
  }' \n -d '${JSON.stringify(body, null, 2)}'`;
  return curlCommand;
};

export const sendEditedStatisticalRequest = (token, text, reqConfig) => {
  try {
    const url = getUrlFromCurl(text);
    const config = getAuthConfig(token, reqConfig);
    const parsed = JSON.parse(getRequestBody(text));
    return Axios.post(url, parsed, config);
  } catch (err) {
    return Promise.reject('Cannot parse the request');
  }
};

const getStatisticalBounds = (bounds) => {
  return generateBounds(bounds);
};

const getOptions = (options, name) => {
  const nonDefaultOptions = getNonDefaultOptions(options);
  if (Object.keys(nonDefaultOptions).length > 0) {
    return {
      [name]: nonDefaultOptions,
    };
  }
  return {};
};

const getStatisticalDataArray = (
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
) => {
  if (datasource === 'DATAFUSION') {
    return datafusionSources.map((ds, idx) => {
      const dataFilter = getOptions(dataFilterOptions[idx].options, 'dataFilter');
      const processing = getOptions(processingOptions[idx].options, 'processing');
      return {
        type: ds.datasource,
        id: ds.id,
        ...dataFilter,
        ...processing,
      };
    });
  }
  if (datasource === 'CUSTOM') {
    const dataFilter = getOptions(dataFilterOptions[0].options, 'dataFilter');
    const processing = getOptions(processingOptions[0].options, 'processing');
    return [
      {
        type: `${byocCollectionType.toLowerCase()}-${byocCollectionId}`,
        ...dataFilter,
        ...processing,
      },
    ];
  } else {
    const dataFilter = getOptions(dataFilterOptions[0].options, 'dataFilter');
    const processing = getOptions(processingOptions[0].options, 'processing');
    return [
      {
        type: datasource,
        ...dataFilter,
        ...processing,
      },
    ];
  }
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

const getStatisticalCalculations = (statisticalState) => {
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
