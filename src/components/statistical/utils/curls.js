import { getStatisticalRequestBody } from '../../../api/statistical/utils';
import { DATASOURCES } from '../../../utils/const/const';

export const getStatisticalCurlCommand = (
  token,
  dataCollections,
  dataFilterOptions,
  processingOptions,
  bounds,
  dimensions,
  evalscript,
  timeRange,
  statisticalState,
) => {
  const body = getStatisticalRequestBody(
    dataCollections,
    dataFilterOptions,
    processingOptions,
    bounds,
    dimensions,
    evalscript,
    timeRange,
    statisticalState,
  );
  const curlCommand = `curl -X POST ${
    DATASOURCES[dataCollections[0].type].url
  }/statistics \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ?? '<your token here>'
  }' \n -d '${JSON.stringify(body, null, 2)}'`;
  return curlCommand;
};
