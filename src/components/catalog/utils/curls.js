import { getCatalogRequestBody } from '../../../api/catalog/utils';

export const generateCatalogCurlCommand = (catalogState, geometry, timeRange, token) => {
  const url = catalogState.deploymentUrl + 'search';
  const body = JSON.stringify(getCatalogRequestBody(catalogState, geometry, timeRange), null, 2);
  const curlCommand = `curl -X POST ${url} \n -H 'Content-Type: application/json' \n -H 'Authorization: Bearer ${
    token ? token : '<your token here>'
  }' \n -d '${body}'`;
  return curlCommand;
};
