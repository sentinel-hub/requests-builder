import { getStatisticalRequestBody } from '../../../api/statistical/utils';
import { getStatisticalUrl } from '../../../api/url';

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
  const curlCommand = `curl -X POST ${getStatisticalUrl(
    dataCollections[0],
  )} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ?? '<your token here>'
  }' \n -d '${JSON.stringify(body, null, 2)}'`;
  return curlCommand;
};
