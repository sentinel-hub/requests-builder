import React from 'react';
import Axios from 'axios';

import store from '../../../store';
import alertSlice from '../../../store/alert';
import requestSlice from '../../../store/request';
import { DATASOURCES } from '../../../utils/const';
import ProcessRequestOverlayButton from '../../common/ProcessRequestOverlayButton';
import { dispatchChanges } from '../requests/parseRequest';
import { CommonSavedRequestEntryFields } from './CommonSavedRequestEntry';

const sendProcessBody = (token, body, url, reqConfig) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
    ...reqConfig,
  };
  if (body.output?.responses?.length > 1) {
    config.headers.Accept = 'application/tar';
  }
  return Axios.post(url, body, config);
};

const sendRequest = (request, token) => {
  let parsed;
  let url;
  try {
    parsed = JSON.parse(request);
    // Datafusion
    if (parsed.input?.data.length > 1) {
      url = getUrlOnDatafusion(parsed.input.data);
    } else {
      url = DATASOURCES[parsed.input.data[0].type].url;
    }
  } catch (err) {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Cannot parse request' }));
  }
  return sendProcessBody(token, parsed, url);
};

const getUrlOnDatafusion = (dataArray) => {
  const urls = dataArray.map((d) => DATASOURCES[d.type].url);
  // services.sentinel-hub takes priority.
  if (urls.includes('https://services.sentinel-hub.com/api/v1/process')) {
    return 'https://services.sentinel-hub.com/api/v1/process';
  }
  return urls[0];
};

const ProcessSavedRequestEntry = ({ request, response, creationTime, mode, name, token, idx }) => {
  const handleCopyRequest = () => {
    navigator.clipboard.writeText(request);
  };
  const handleParse = () => {
    store.dispatch(requestSlice.actions.setMode('PROCESS'));
    dispatchChanges(JSON.parse(request));
  };
  return (
    <div className="saved-request-entry">
      <CommonSavedRequestEntryFields creationTime={creationTime} mode={mode} name={name} />
      {response && (
        <p className="text">
          <span>Response: </span>
          <a href={response} target="_blank" rel="noopener noreferrer">
            Link
          </a>
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
        <ProcessRequestOverlayButton
          className="tertiary-button tertiary-button--wrapped"
          validation={Boolean(token)}
          disabledTitle="Log in to use this"
          buttonText="Send"
          request={sendRequest}
          args={[request, token]}
          collectionRequestIdx={idx}
          skipSaving={false}
        />
      </div>
      <hr className="u-margin-top-tiny u-margin-bottom-tiny" />
    </div>
  );
};

export default ProcessSavedRequestEntry;
