import React from 'react';
import Axios from 'axios';

import store from '../../../store';
import alertSlice from '../../../store/alert';
import requestSlice from '../../../store/request';
import { DATASOURCES } from '../../../utils/const/const';
import ProcessRequestOverlayButton from '../../common/ProcessRequestOverlayButton';
import { dispatchChanges, getProperDataCollectionType } from '../requests/parseRequest';
import { CommonSavedRequestEntryFields } from './CommonSavedRequestEntry';
import savedRequestsSlice from '../../../store/savedRequests';

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
      url = DATASOURCES[getProperDataCollectionType(parsed.input.data[0].type)].url + '/process';
    }
  } catch (err) {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Cannot parse request' }));
  }
  return sendProcessBody(token, parsed, url);
};

const getUrlOnDatafusion = (dataArray) => {
  const urls = dataArray.map((d) => {
    const properDataType = getProperDataCollectionType(d.type);
    return DATASOURCES[properDataType].url + '/process';
  });
  // services.sentinel-hub takes priority.
  if (urls.includes('https://services.sentinel-hub.com/api/v1/process')) {
    return 'https://services.sentinel-hub.com/api/v1/process';
  }
  return urls[0];
};

const ProcessSavedRequestEntry = ({
  request,
  response,
  primaryKey,
  creationTime,
  mode,
  name,
  token,
  idx,
}) => {
  const handleCopyRequest = () => {
    navigator.clipboard.writeText(request);
  };
  const handleParse = () => {
    store.dispatch(requestSlice.actions.setMode('PROCESS'));
    dispatchChanges(JSON.parse(request));
  };
  const handleDeleteRequest = () => {
    store.dispatch(savedRequestsSlice.actions.deleteRequest({ idx, primaryKey }));
  };
  return (
    <>
      <CommonSavedRequestEntryFields creationTime={creationTime} mode={mode} name={name} />
      {response && (
        <p className="text">
          <span>Response: </span>
          <a href={response} target="_blank" className="underline" rel="noopener noreferrer">
            Link
          </a>
        </p>
      )}
      <div className="flex items-center mt-1" style={{ width: '100%' }}>
        <button className="tertiary-button mr-1" onClick={handleCopyRequest}>
          Copy
        </button>
        <button className="tertiary-button wrapped mr-1" onClick={handleParse}>
          Update UI
        </button>
        <ProcessRequestOverlayButton
          className="tertiary-button wrapped mr-1"
          validation={Boolean(token)}
          disabledTitle="Log in to use this"
          buttonText="Send"
          request={sendRequest}
          args={[request, token]}
          collectionRequestInfo={{ idx, primaryKey }}
          skipSaving={false}
          useShortcut={false}
        />
        <button className="tertiary-button bg-red-600" onClick={handleDeleteRequest}>
          Delete
        </button>
      </div>
      <hr className="mt-1 mb-1" />
    </>
  );
};

export default ProcessSavedRequestEntry;
