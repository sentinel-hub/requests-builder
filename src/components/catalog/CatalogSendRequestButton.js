import React from 'react';
import RequestButton from '../common/RequestButton';
import { connect } from 'react-redux';
import { generateCatalogRequest } from './requests';
import store, { catalogSlice, alertSlice } from '../../store';

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

const CatalogSendRequestButton = ({ catalogState, geometry, token, setResults }) => {
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
  };

  return (
    <>
      <RequestButton
        request={generateCatalogRequest}
        args={[catalogState, geometry, token, undefined]}
        validation={Boolean(token)}
        className="secondary-button"
        disabledTitle="Log in to use this"
        buttonText="Send Request"
        responseHandler={responseHandler}
        errorHandler={catalogErrorHandler}
        useShortcut={catalogState.next ? false : true}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  geometry: state.request.geometry,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogSendRequestButton);
