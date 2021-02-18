import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import debounceRender from 'react-debounce-render';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { statisticsResponseHandler } from './StatisticalSendRequestButton';
import { getStatisticalCurlCommand, sendEditedStatisticalRequest } from './utils/api';
import { handleStatisticalParse, statisticalRequestStateSelector } from './utils/utils';

const StatisticalRequestPreview = ({
  datasource,
  datafusionSources,
  byocCollectionType,
  byocCollectionId,
  dataFilterOptions,
  processingOptions,
  evalscript,
  geometry,
  crs,
  timeFrom,
  timeTo,
  geometryType,
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
    geometry,
    CRS: crs,
    geometryType,
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
              name: 'request',
              value: getStatisticalCurlCommand(
                token,
                datasource,
                datafusionSources,
                byocCollectionType,
                byocCollectionId,
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
          supportedSendEditedNames={['request']}
          id="statistical-req-preview"
          onParse={handleStatisticalParse}
          supportedParseNames={['request']}
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
