import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { getPlanetSubscriptionBody } from '../../api/tpdi/planet';

import TpdiResource from '../../api/tpdi/TpdiResource';
import RequestButton from '../common/RequestButton';

const TpdiPlaceSubscriptionButton = ({
  planetState,
  tpdiState,
  requestState,
  mapState,
  token,
  setSubscriptions,
}) => {
  const handleCreation = useCallback(
    (response) => {
      setSubscriptions((prev) => [response, ...prev]);
    },
    [setSubscriptions],
  );
  return (
    <RequestButton
      className="secondary-button mt-3 w-40"
      buttonText="Place subscription"
      request={TpdiResource.createSubscription}
      args={[getPlanetSubscriptionBody(mapState, planetState, requestState, tpdiState)]}
      validation={
        (tpdiState.collectionId || tpdiState.isCreatingCollection) && token && planetState.planetApiKey
      }
      disabledTitle="Log in, set a collection and a Planet API key to create a subscription"
      responseHandler={handleCreation}
    />
  );
};

const mapStateToProps = (state) => ({
  planetState: state.planet,
  tpdiState: state.tpdi,
  requestState: state.request,
  mapState: state.map,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TpdiPlaceSubscriptionButton);
