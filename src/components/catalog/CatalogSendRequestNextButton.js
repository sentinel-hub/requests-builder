import React from 'react';
import RequestButton from '../RequestButton';
import { generateCatalogRequest } from './requests';
import { connect } from 'react-redux';
import store, { catalogSlice } from '../../store';
import { catalogErrorHandler } from './CatalogSendRequestButton';

const CatalogSendRequestNextButton = ({ catalogState, geometry, token, setResults }) => {
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
  };

  return (
    <>
      <RequestButton
        request={generateCatalogRequest}
        args={[catalogState, geometry, token, next]}
        className="secondary-button"
        validation={Boolean(next && token)}
        buttonText="Get Next"
        disabledTitle="Log in to use this"
        responseHandler={responseHandler}
        errorHandler={catalogErrorHandler}
        useShortcut={true}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  catalogState: state.catalog,
  geometry: state.request.geometry,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CatalogSendRequestNextButton);
