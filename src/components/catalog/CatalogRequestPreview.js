import React from 'react';
import { connect } from 'react-redux';
import { generateCatalogCurlCommand, sendCatalogEditedRequest } from './requests';
import { parseCatalogBody } from './parse';
import CommonRequestPreview from '../common/CommonRequestPreview';

const CatalogRequestPreview = ({
  catalogState,
  geometry,
  timeRange,
  token,
  setResults,
  catalogSearchResponse,
}) => {
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
  geometry: state.request.geometry,
  timeRange: {
    timeTo: state.request.timeTo[0],
    timeFrom: state.request.timeFrom[0],
  },
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogRequestPreview);
