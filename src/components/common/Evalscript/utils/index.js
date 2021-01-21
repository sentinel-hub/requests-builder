import Axios from 'axios';

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
