import React from 'react';
import { connect } from 'react-redux';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { getRequestBody } from '../process/requests/parseRequest';
import { getSearchTpdiCurlCommand } from './requests/common';
import { parseSearchRequest } from './parse';

const TPDISearchRequestPreview = ({ state, searchResponse }) => {
  const handleParseSearch = (text) => {
    try {
      const parsed = JSON.parse(getRequestBody(text));
      parseSearchRequest(parsed);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <h2 className="heading-secondary">Search Request Preview</h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              value: getSearchTpdiCurlCommand(state),
              toggledValue: searchResponse,
              name: 'search',
            },
          ]}
          value={getSearchTpdiCurlCommand(state)}
          toggledValue={searchResponse}
          className="tpdi-search-preview"
          canCopy
          onParse={handleParseSearch}
          supportedParseNames={['search']}
          id="tpdi-search-req-preview"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ state });

export default connect(mapStateToProps)(TPDISearchRequestPreview);
