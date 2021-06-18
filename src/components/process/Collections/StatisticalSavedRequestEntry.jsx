import React from 'react';
import axios from 'axios';
import { addWarningAlert } from '../../../store/alert';
import store from '../../../store';
import responsesSlice from '../../../store/responses';
import { handleStatisticalParse } from '../../statistical/utils/utils';
import { CommonSavedRequestEntryFields } from './CommonSavedRequestEntry';
import RequestButton from '../../common/RequestButton';
import requestSlice from '../../../store/request';
import { statisticsResponseHandler } from '../../statistical/StatisticalSendRequestButton';
import savedRequestsSlice from '../../../store/savedRequests';
import { getStatisticalAuthConfig } from '../../../api/statistical/utils';
import { DATASOURCES } from '../../../utils/const/const';

const sendStatisticalRequest = (request, token, reqConfig) => {
  try {
    const parsed = JSON.parse(request);
    const url = DATASOURCES[parsed.input.data[0].type]?.url + '/statistics';
    const config = getStatisticalAuthConfig(token, reqConfig);
    return axios.post(url, parsed, config);
  } catch (err) {
    addWarningAlert('Cannot parse request');
  }
};

const responseHandler = (response, request, idx) => {
  // request to undefined to not show the save form.
  statisticsResponseHandler(response, undefined);
  store.dispatch(savedRequestsSlice.actions.setResponse({ idx, response }));
};

const StatisticalSavedRequestEntry = ({ request, response, creationTime, mode, name, token, idx }) => {
  const handleDisplay = () => {
    store.dispatch(
      responsesSlice.actions.setFisResponse({
        response,
        stringRequest: request,
        mode,
        displayResponse: true,
        isFromCollections: true,
      }),
    );
  };
  const handleParse = () => {
    store.dispatch(requestSlice.actions.setMode('STATISTICAL'));
    handleStatisticalParse(request);
  };
  const handleCopyRequest = () => {
    navigator.clipboard.writeText(request);
  };

  return (
    <div className="saved-request-entry">
      <CommonSavedRequestEntryFields creationTime={creationTime} mode={mode} name={name} />
      {response && (
        <p className="text">
          <span>Response: </span>
          <button className="tertiary-button u-margin-top-tiny" onClick={handleDisplay}>
            Display
          </button>
        </p>
      )}
      <div className="u-flex-aligned u-margin-top-tiny" style={{ width: '100%' }}>
        <button className="tertiary-button u-margin-right-tiny" onClick={handleCopyRequest}>
          Copy
        </button>
        <button
          className="tertiary-button tertiary-button--wrapped u-margin-right-tiny"
          onClick={handleParse}
        >
          Update UI
        </button>
        <RequestButton
          validation={Boolean(token)}
          disabledTitle="Log in to use this"
          buttonText="Send"
          request={sendStatisticalRequest}
          args={[request, token]}
          className="tertiary-button tertiary-button--wrapped"
          responseHandler={(resp, req) => responseHandler(resp, req, idx)}
        />
      </div>
      <hr className="u-margin-top-tiny u-margin-bottom-tiny" />
    </div>
  );
};

export default StatisticalSavedRequestEntry;
