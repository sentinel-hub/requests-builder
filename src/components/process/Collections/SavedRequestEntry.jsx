import React from 'react';
import moment from 'moment';
import { dispatchChanges } from '../requests/parseRequest';
import { sendProcessBody } from '../requests';
import { DATASOURCES } from '../../../utils/const';
import ProcessRequestOverlayButton from '../../common/ProcessRequestOverlayButton';
import store from '../../../store';
import alertSlice from '../../../store/alert';

const getUrlOnDatafusion = (dataArray) => {
  const urls = dataArray.map((d) => DATASOURCES[d.type].url);
  // services.sentinel-hub takes priority.
  if (urls.includes('https://services.sentinel-hub.com/api/v1/process')) {
    return 'https://services.sentinel-hub.com/api/v1/process';
  }
  return urls[0];
};

const SavedRequestEntry = ({ request, response, creationTime, mode, name, token, idx }) => {
  const handleParse = () => {
    try {
      dispatchChanges(JSON.parse(request));
    } catch (err) {
      console.error('Something went wrong while parsing the request');
    }
  };
  const sendRequest = () => {
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

  const handleCopyRequest = () => {
    navigator.clipboard.writeText(request);
  };

  return (
    <div className="saved-request-entry">
      {name && (
        <p className="text">
          <span>Name: </span>
          {name}
        </p>
      )}
      {creationTime && (
        <p className="text">
          <span>Created: </span>
          {moment
            .unix(creationTime / 1000)
            .utc()
            .format()
            .replace('T', ' ')
            .replace('Z', '')}
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
          args={[]}
          collectionRequestIdx={idx}
          skipSaving={false}
        />
      </div>
      {response && (
        <p className="text u-margin-top-tiny">
          <span>Response: </span>
          <a href={response} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        </p>
      )}
      <hr className="u-margin-top-tiny u-margin-bottom-tiny" />
    </div>
  );
};

export default SavedRequestEntry;
