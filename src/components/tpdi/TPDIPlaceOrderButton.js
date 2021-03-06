import React from 'react';
import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import Tooltip from '../common/Tooltip/Tooltip';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { tpdiCreateOrderBodyViaDataFilter, tpdiCreateOrderBodyViaProducts } from '../../api/tpdi/common';

const validateCreateOrderWithProducts = (products) => {
  for (let prod of products) {
    return Boolean(prod.id && prod.id !== '');
  }
  return false;
};

const DIALOG_TEXT =
  'Are you sure you want to create an order without a Collection ID?\nWhen you confirm your order a new collection will be created automatically.';

const ORDER_BY_QUERY_LIMIT = 250;

const TPDIPlaceOrderButton = ({
  areaSelected,
  limit,
  request,
  airbus,
  planet,
  maxar,
  tpdi,
  map,
  token,
  collectionId,
  setCreateQueryResponse,
  setCreateProductsResponse,
  afterOrderCreationAction,
  amountOfFoundProducts,
}) => {
  const products = tpdi.products;
  const state = {
    request,
    airbus,
    planet,
    tpdi,
    maxar,
    map,
  };
  const { isUsingQuery } = tpdi;

  const handleCreateOrderSuccess = (response) => {
    if (isUsingQuery) {
      setCreateQueryResponse(JSON.stringify(response, null, 2));
    } else {
      setCreateProductsResponse(JSON.stringify(response, null, 2));
    }
    afterOrderCreationAction(response);
  };

  const shouldConfirm = !Boolean(collectionId);
  const getOrderQueryDisabledTitle = () => {
    if (!token) {
      return 'Log in to use this';
    }
    if (areaSelected > limit) {
      return 'Increase the order limit to proceed';
    }
    if (amountOfFoundProducts > ORDER_BY_QUERY_LIMIT) {
      return `Order by query can only be used when there's less than ${ORDER_BY_QUERY_LIMIT} products returned by the search.`;
    }
    return undefined;
  };

  const getRequestButton = () => {
    if (isUsingQuery) {
      return (
        <RequestButton
          request={TpdiResource.createOrder}
          args={[tpdiCreateOrderBodyViaDataFilter(state)]}
          buttonText="Prepare Order"
          validation={
            Boolean(token) && areaSelected <= limit && amountOfFoundProducts <= ORDER_BY_QUERY_LIMIT
          }
          className="secondary-button"
          responseHandler={handleCreateOrderSuccess}
          errorHandler={errorHandlerTPDI}
          disabledTitle={getOrderQueryDisabledTitle()}
          useConfirmation={shouldConfirm}
          dialogText={DIALOG_TEXT}
        />
      );
    }
    return (
      <RequestButton
        request={TpdiResource.createOrder}
        args={[tpdiCreateOrderBodyViaProducts(state)]}
        buttonText="Prepare Order"
        validation={validateCreateOrderWithProducts(products) && areaSelected <= limit && Boolean(token)}
        className="secondary-button"
        responseHandler={handleCreateOrderSuccess}
        errorHandler={errorHandlerTPDI}
        disabledTitle="Add products and check the limit"
        useConfirmation={shouldConfirm}
        dialogText={DIALOG_TEXT}
      />
    );
  };
  return (
    <div className="flex items-center mt-2" style={{ justifyContent: 'space-between' }}>
      <div />
      {getRequestButton()}
      <div className="flex items-center" style={{ justifyContent: 'flex-end' }}>
        <Tooltip
          direction="right"
          content='When you click "Prepare Order", your order will be created. At this stage, the order will not go through and no quota will be substracted. This will happen when you confirm the order. Before you do, you will be able to review the requested quota and decide if you would like to proceed.'
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tpdi: state.tpdi,
  request: state.request,
  airbus: state.airbus,
  planet: state.planet,
  maxar: state.maxar,
  token: state.auth.user.access_token,
  map: state.map,
  collectionId: state.tpdi.collectionId,
});

export default connect(mapStateToProps)(TPDIPlaceOrderButton);
