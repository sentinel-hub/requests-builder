import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { generateCatalogCurlCommand } from './utils/curls';
import { generateShPyCatalogRequest } from './utils/shpy';
import { parseCatalogBody } from './parse';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { getRequestBody, getUrlFromCurl } from '../process/requests/parseRequest';

const getConfigHelper = (token, reqConfig) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...reqConfig,
  };
};

const sendCatalogEditedRequest = (text, token, reqConfig) => {
  try {
    const url = getUrlFromCurl(text);
    const parsed = JSON.parse(getRequestBody(text));
    const config = getConfigHelper(token, reqConfig);
    return axios.post(url, parsed, config);
  } catch (err) {
    return Promise.reject(err);
  }
};

const CatalogRequestPreview = ({
  catalogState,
  mapState,
  timeRange,
  token,
  setResults,
  catalogSearchResponse,
}) => {
  const geometry = mapState.wgs84Geometry;
  const handleParse = (text) => {
    parseCatalogBody(text);
  };
  return (
    <>
      <h2 className="heading-secondary">Request Preview</h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              name: 'search',
              value: generateCatalogCurlCommand(catalogState, geometry, timeRange, token),
              toggledValue: catalogSearchResponse,
            },
            {
              name: 'sh-py search',
              value: () => generateShPyCatalogRequest(catalogState, mapState, timeRange),
              nonToggle: true,
            },
          ]}
          canCopy
          className="tpdi-editor"
          onParse={handleParse}
          supportedParseNames={['search']}
          sendEditedRequest={(text, reqConfig) => sendCatalogEditedRequest(text, token, reqConfig)}
          onSendEdited={(response) => {
            setResults((res) => ({
              ...res,
              results: response.features,
            }));
          }}
          supportedSendEditedNames={['search']}
          id="catalog-req-preview"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  mapState: state.map,
  timeRange: {
    timeTo: state.request.timeTo[0],
    timeFrom: state.request.timeFrom[0],
  },
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogRequestPreview);
