import React from 'react';
import RequestButton from '../common/RequestButton';
import { generateCatalogRequest } from './requests';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import { catalogErrorHandler } from './CatalogSendRequestButton';

const CatalogSendRequestNextButton = ({
  catalogState,
  geometry,
  timeRange,
  token,
  setResults,
  setCatalogSearchResponse,
}) => {
  const { next } = catalogState;

  const responseHandler = (response) => {
    if (response.context.next) {
      store.dispatch(catalogSlice.actions.setNext(response.context.next));
    } else {
      store.dispatch(catalogSlice.actions.setNext(''));
    }
    setResults((res) => ({
      type: res.type,
      results: res.results.concat(response.features),
    }));
    setCatalogSearchResponse(JSON.stringify(response, null, 2));
  };

  return (
    <RequestButton
      request={generateCatalogRequest}
      args={[catalogState, geometry, timeRange, token, next]}
      className="secondary-button"
      validation={Boolean(next && token)}
      buttonText="Get Next"
      disabledTitle="Log in to use this"
      responseHandler={responseHandler}
      errorHandler={catalogErrorHandler}
      useShortcut={true}
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

export default connect(mapStateToProps)(CatalogSendRequestNextButton);
