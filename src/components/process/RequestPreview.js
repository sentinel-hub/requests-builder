import React from 'react';
import { generateProcessCurlCommand, getJSONRequestBody, sendEditedRequest } from './requests';
import { connect } from 'react-redux';

import debounceRender from 'react-debounce-render';
import { dispatchChanges, getRequestBody, getEvalscript } from './requests/parseRequest';
import store from '../../store';
import responsesSlice from '../../store/responses';
import requestSlice from '../../store/request';
import { getSHJSCode } from './requests/generateShjsRequest';
import { getSHPYCode } from './requests/generateShPyRequest';

import CommonRequestPreview from '../common/CommonRequestPreview';

const handleParseRequest = (text) => {
  try {
    // Form data
    let s;
    if (text.includes('-F ')) {
      s = '-F ';
    } else if (text.includes('--form ')) {
      s = '--form ';
    }
    if (s) {
      const splitted = text.split(s);
      const request = splitted.find((el) => el.includes('request='));
      const evalscript = splitted.find((el) => el.includes('evalscript='));

      if (request) {
        const requestBody = getRequestBody(request);
        dispatchChanges(JSON.parse(requestBody));
      }
      if (evalscript) {
        const evalBody = getEvalscript(evalscript);
        store.dispatch(requestSlice.actions.setEvalscript(evalBody));
      }
    } else {
      const body = getRequestBody(text);
      const parsed = JSON.parse(body);
      dispatchChanges(parsed);
    }
  } catch (err) {
    console.error('Error while parsing the request', err);
  }
};

const RequestPreview = ({ requestState, token, mapState }) => {
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
              value: generateProcessCurlCommand(requestState, mapState, token),
              nonToggle: true,
            },
            {
              name: 'body',
              value: () => getJSONRequestBody(requestState, mapState),
              nonToggle: true,
            },
            {
              name: 'sh-py',
              value: () => getSHPYCode(requestState, mapState),
              nonToggle: true,
            },
            {
              name: 'sh-js',
              value: () => getSHJSCode(requestState, mapState, token),
              nonToggle: true,
            },
          ]}
          canCopy
          className="process-editor"
          onParse={handleParseRequest}
          supportedParseNames={['curl', 'body']}
          supportedSendEditedNames={['curl']}
          sendEditedRequest={(text, args) => sendEditedRequest(token, text, args)}
          onSendEdited={(response) => {
            const responseUrl = URL.createObjectURL(response);
            store.dispatch(
              responsesSlice.actions.setResponse({
                src: responseUrl,
                isTar: !response.type.includes('image'),
              }),
            );
          }}
          token={token}
          id="process-req-preview"
        />
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  requestState: store.request,
  mapState: store.map,
  token: store.auth.user.access_token,
});

const debouncedComponent = debounceRender(RequestPreview, 1000);

export default connect(mapStateToProps, null)(debouncedComponent);
