import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import debounceRender from 'react-debounce-render';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { statisticsResponseHandler } from './StatisticalSendRequestButton';
import { getStatisticalCurlCommand } from './utils/curls';
import { handleStatisticalParse, statisticalRequestStateSelector } from './utils/utils';
import { getRequestBody, getUrlFromCurl } from '../process/requests/parseRequest';
import { getStatisticalAuthConfig } from '../../api/statistical/utils';
import getStatisticalShPyRequest from './utils/shpy';

const sendEditedStatisticalRequest = (token, text, reqConfig) => {
  try {
    const url = getUrlFromCurl(text);
    const config = getStatisticalAuthConfig(token, reqConfig);
    const parsed = JSON.parse(getRequestBody(text));
    return Axios.post(url, parsed, config);
  } catch (err) {
    return Promise.reject('Cannot parse the request');
  }
};

const StatisticalRequestPreview = ({
  dataCollections,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
  evalscript,
  convertedGeometry,
  selectedCrs,
  timeFrom,
  timeTo,
  heightOrRes,
  width,
  height,
  statisticalState,
  token,
  requestResponse,
  setRequestResponse,
  fisResponse,
}) => {
  const bounds = {
    convertedGeometry,
    selectedCrs,
  };
  const timeRange = {
    timeFrom,
    timeTo,
  };
  const dimensions = {
    heightOrRes,
    width,
    height,
  };

  // Effect that sets the toggledValue of the req preview.
  useEffect(() => {
    if (fisResponse !== '') {
      setRequestResponse(fisResponse);
    }
  }, [fisResponse, setRequestResponse]);

  return (
    <>
      <h2 className="heading-secondary" style={{ marginBottom: '1.3rem' }}>
        Request Preview
      </h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              name: 'curl',
              value: getStatisticalCurlCommand(
                token,
                dataCollections,
                dataFilterOptions,
                processingOptions,
                bounds,
                dimensions,
                evalscript,
                timeRange,
                statisticalState,
              ),
              toggledValue: requestResponse,
            },
            {
              name: 'sh-py',
              value: () =>
                getStatisticalShPyRequest(
                  dataCollections,
                  dataFilterOptions,
                  processingOptions,
                  bounds,
                  dimensions,
                  evalscript,
                  timeRange,
                  statisticalState,
                ),
              toggledValue: requestResponse,
            },
          ]}
          canCopy
          className="process-editor"
          sendEditedRequest={(text, reqConfig) => sendEditedStatisticalRequest(token, text, reqConfig)}
          onSendEdited={statisticsResponseHandler}
          supportedSendEditedNames={['curl']}
          id="statistical-req-preview"
          onParse={handleStatisticalParse}
          supportedParseNames={['curl']}
        />
      </div>
    </>
  );
};

const debouncedComponent = debounceRender(StatisticalRequestPreview);

const mapStateToProps = (state) => ({
  ...statisticalRequestStateSelector(state),
  fisResponse: state.response.fisResponse,
});

export default connect(mapStateToProps)(debouncedComponent);
