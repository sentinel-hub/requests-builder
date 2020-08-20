import { DATASOURCES } from '../../../utils/const';
import Axios from 'axios';

export const convertEvalscript = (evalscript, datasource, token, reqConfig) => {
  const url = `${DATASOURCES[datasource].url}/convertscript?datasetType=${datasource}`;
  const config = {
    headers: {
      'Content-Type': 'application/ecmascript',
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
  return Axios.post(url, evalscript, config);
};

const fetchDataProductsHelper = (token, datasource, viewtoken = 0, reqConfig) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
  const url = `https://services.sentinel-hub.com/configuration/v1/datasets/${datasource}/dataproducts?viewtoken=${viewtoken}`;

  return Axios.get(url, config);
};

export const fetchDataProducts = async (datasource, token, reqConfig) => {
  let res = await fetchDataProductsHelper(token, datasource, 0, reqConfig);
  let dataproducts = res.data.member;
  while (res.data.view.nextToken) {
    res = await fetchDataProductsHelper(token, datasource, res.data.view.nextToken, reqConfig);
    dataproducts = dataproducts.concat(res.data.member);
  }
  return dataproducts;
};
