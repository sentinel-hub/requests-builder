import React from 'react';
import RequestButton from '../common/RequestButton';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import alertSlice from '../../store/alert';
import CatalogResource from '../../api/catalog/CatalogResource';
import { getCatalogRequestBody } from '../../api/catalog/utils';

export const catalogErrorHandler = (error) => {
  if (error.response && error.response.data) {
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: 'Error: ' + error.response.data.code + ' - ' + error.response.data.description,
      }),
    );
  } else {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
  }
  console.error(error);
};

const CatalogSendRequestButton = ({
  catalogState,
  geometry,
  timeRange,
  token,
  setResults,
  setCatalogSearchResponse,
  setUsedCollection,
}) => {
  let type = catalogState.selectedCollection;

  const responseHandler = (response) => {
    if (response.context.next) {
      store.dispatch(catalogSlice.actions.setNext(response.context.next));
    } else {
      store.dispatch(catalogSlice.actions.setNext(''));
    }
    setResults((res) => ({
      results: response.features,
      type: type,
    }));
    setCatalogSearchResponse(JSON.stringify(response, null, 2));
    setUsedCollection(catalogState.selectedCollection);
  };

  return (
    <RequestButton
      request={CatalogResource.search(catalogState.deploymentUrl)}
      args={[getCatalogRequestBody(catalogState, geometry, timeRange)]}
      validation={Boolean(token && catalogState.deploymentUrl)}
      className="secondary-button"
      disabledTitle="Log in to use this"
      buttonText="Send Request"
      responseHandler={responseHandler}
      errorHandler={catalogErrorHandler}
      useShortcut={catalogState.next ? false : true}
    />
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  geometry: state.map.wgs84Geometry,
  timeRange: {
    timeTo: state.request.timeTo[0],
    timeFrom: state.request.timeFrom[0],
  },
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogSendRequestButton);
