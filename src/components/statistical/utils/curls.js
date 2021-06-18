import { getStatisticalRequestBody } from '../../../api/statistical/utils';
import { DATASOURCES } from '../../../utils/const/const';

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
  const curlCommand = `curl -X POST ${
    DATASOURCES[datasource].url
  }/statistics \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ?? '<your token here>'
  }' \n -d '${JSON.stringify(body, null, 2)}'`;
  return curlCommand;
};
