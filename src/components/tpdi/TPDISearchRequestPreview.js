import React from 'react';
import { connect } from 'react-redux';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { getRequestBody } from '../process/requests/parseRequest';
import { getSearchTpdiCurlCommand } from './utils/curls';
import { parseSearchRequest } from './parse';
import { addWarningAlert } from '../../store/alert';

const TPDISearchRequestPreview = ({ state, searchResponse }) => {
  const handleParseSearch = (text) => {
    try {
      const parsed = JSON.parse(getRequestBody(text));
      parseSearchRequest(parsed);
    } catch (err) {
      addWarningAlert(
        'Error while parsing!\nRemember that only the body of the request and the generated curl commands by the app can be parsed.',
      );
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
