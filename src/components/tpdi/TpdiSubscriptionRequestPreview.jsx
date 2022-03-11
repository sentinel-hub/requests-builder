import React from 'react';
import { connect } from 'react-redux';
import debounceRender from 'react-debounce-render';
import { addWarningAlert } from '../../store/alert';
import CommonRequestPreview from '../common/CommonRequestPreview';
import { getRequestBody } from '../process/requests/parseRequest';
import { parseSubscriptionsRequest } from './parse';
import {
  getConfirmSubscriptionCurlCommand,
  getCreateSubscriptionCurlCommand,
  getDeleteSubscriptionCurlCommand,
  getFetchSubscriptionCurlCommand,
} from './utils/curls';

const TpdiSubscriptionRequestPreview = ({ mapState, planetState, requestState, tpdiState, token }) => {
  const handleParse = (text) => {
    try {
      const parsed = JSON.parse(getRequestBody(text));
      parseSubscriptionsRequest(parsed);
    } catch (err) {
      addWarningAlert(
        'Error while parsing!\nRemember that only the body of the request and the generated curl commands by the app can be parsed.',
      );
    }
  };

  return (
    <>
      <h2 className="heading-secondary">Request Preview</h2>
      <div className="form">
        <CommonRequestPreview
          options={[
            {
              name: 'create subscription',
              value: getCreateSubscriptionCurlCommand(mapState, planetState, requestState, tpdiState, token),
              nonToggle: true,
            },
            {
              name: 'fetch subscription',
              value: () => getFetchSubscriptionCurlCommand(token),
              nonToggle: true,
            },
            {
              name: 'confirm subscription',
              value: () => getConfirmSubscriptionCurlCommand(token),
              nonToggle: true,
            },
            {
              name: 'delete subscription',
              value: () => getDeleteSubscriptionCurlCommand(token),
              nonToggle: true,
            },
          ]}
          canCopy
          className="tpdi-subscriptions-preview"
          onParse={handleParse}
          supportedParseNames={['create subscription']}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  planetState: state.planet,
  tpdiState: state.tpdi,
  requestState: state.request,
  mapState: state.map,
  token: state.auth.user.access_token,
});

const debouncedComponent = debounceRender(TpdiSubscriptionRequestPreview, 500);
export default connect(mapStateToProps)(debouncedComponent);
