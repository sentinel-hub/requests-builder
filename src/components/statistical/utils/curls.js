import { STATISTICAL_BASE_URL } from '../../../api/statistical/StatisticalResource';
import { getStatisticalRequestBody } from '../../../api/statistical/utils';

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
