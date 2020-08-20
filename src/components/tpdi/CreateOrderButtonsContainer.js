import React from 'react';
import { createTPDIOrder, createTPDIDataFilterOrder } from './generateTPDIRequests';
import { connect } from 'react-redux';
import store, { alertSlice } from '../../store';
import RequestButton from '../RequestButton';
import { errorHandlerTPDI } from './TPDIOrderOptions';
const validateCreateOrderWithProducts = (products) => {
  for (let prod of products) {
    if (prod.id && prod.id !== '') {
      return true;
    }
  }
  return false;
};

const CreateOrderButtonsContainer = ({
  areaSelected,
  limit,
  request,
  airbus,
  planet,
  tpdi,
  token,
  collectionId,
}) => {
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

  const shouldConfirm = !Boolean(collectionId);

  return (
    <>
      <RequestButton
        request={createTPDIOrder}
        args={[state, token]}
        buttonText={products.length > 1 ? 'Order Products' : 'Order Product'}
        validation={validateCreateOrderWithProducts(products) && areaSelected <= limit}
        className="secondary-button"
        responseHandler={handleCreateOrderSuccess}
        errorHandler={errorHandlerTPDI}
        disabledTitle="Add products and check the limit"
        useConfirmation={shouldConfirm}
        dialogText="Are you sure you want to create an order without a Collection ID?"
      />

      <hr className="u-margin-top-tiny"></hr>

      <RequestButton
        request={createTPDIDataFilterOrder}
        args={[state, token]}
        buttonText="Order using DataFilter"
        validation={Boolean(token) && areaSelected <= limit}
        className="secondary-button"
        responseHandler={handleCreateOrderSuccess}
        errorHandler={errorHandlerTPDI}
        disabledTitle={Boolean(token) ? 'Check the limit' : 'Log in'}
        useConfirmation={shouldConfirm}
        dialogText="Are you sure you want to create an order without a Collection ID?"
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
  collectionId: state.tpdi.collectionId,
});

export default connect(mapStateToProps)(CreateOrderButtonsContainer);
