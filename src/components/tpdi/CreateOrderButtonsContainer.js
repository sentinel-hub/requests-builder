import React from 'react';
import { createTPDIOrder, createTPDIDataFilterOrder } from './generateTPDIRequests';
import { connect } from 'react-redux';
import store, { alertSlice } from '../../store';
import RequestButton from '../RequestButton';
const validateCreateOrderWithProducts = (products) => {
  for (let prod of products) {
    if (prod.id && prod.id !== '') {
      return true;
    }
  }
  return false;
};

const CreateOrderButtonsContainer = ({ areaSelected, limit, request, airbus, planet, tpdi, token }) => {
  const products = tpdi.products;

  const state = {
    request,
    airbus,
    planet,
    tpdi,
  };

  const handleCreateOrderSuccess = () => {
    store.dispatch(alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Order successfully created' }));
  };

  const handleCreateOrderError = () => {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
  };

  return (
    <>
      <RequestButton
        request={createTPDIOrder}
        args={[state, token]}
        buttonText={products.length > 1 ? 'Order Products' : 'Order Product'}
        validation={validateCreateOrderWithProducts(products) && areaSelected <= limit}
        className="secondary-button"
        responseHandler={handleCreateOrderSuccess}
        errorHandler={handleCreateOrderError}
        disabledTitle="Add products and check the limit"
      />

      <hr className="u-margin-top-tiny"></hr>

      <RequestButton
        request={createTPDIDataFilterOrder}
        args={[state, token]}
        buttonText="Order using DataFilter"
        validation={Boolean(token) && areaSelected <= limit}
        className="secondary-button"
        responseHandler={handleCreateOrderSuccess}
        errorHandler={handleCreateOrderError}
        disabledTitle={Boolean(token) ? 'Check the limit' : 'Log in'}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  tpdi: state.tpdi,
  request: state.request,
  airbus: state.airbus,
  planet: state.planet,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(CreateOrderButtonsContainer);
