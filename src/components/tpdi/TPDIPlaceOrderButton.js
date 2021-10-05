import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import RequestButton from '../common/RequestButton';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import Tooltip from '../common/Tooltip/Tooltip';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { tpdiCreateOrderBodyViaDataFilter, tpdiCreateOrderBodyViaProducts } from '../../api/tpdi/common';
import { errorTpdiCreationEvent, successfulTpdiCreationEvent } from '../../utils/initAnalytics';

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
  const { isUsingQuery, provider, isCreatingCollection } = tpdi;

  const handleCreateOrderSuccess = (response) => {
    successfulTpdiCreationEvent();
    if (isUsingQuery) {
      setCreateQueryResponse(JSON.stringify(response, null, 2));
    } else {
      setCreateProductsResponse(JSON.stringify(response, null, 2));
    }
    afterOrderCreationAction(response);
  };

  const shouldConfirm = collectionId === '' || isCreatingCollection;

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
    if (provider === 'PLANET' && planet.planetApiKey === '') {
      return 'Input an Api Key to proceed';
    }
    return undefined;
  };

  const validateCreateOrderWithProducts = () => {
    const areAllProductsValid = products.reduce((acc, cv) => {
      if (cv === '') {
        acc = false;
      }
      return acc;
    }, true);
    const validation = areAllProductsValid && areaSelected <= limit && Boolean(token);
    if (provider === 'PLANET') {
      return validation && planet.planetApiKey !== '';
    }
    return validation;
  };

  const validateCreateOrdersWithQuery = () => {
    const validation =
      Boolean(token) && areaSelected <= limit && amountOfFoundProducts <= ORDER_BY_QUERY_LIMIT;
    if (provider === 'PLANET') {
      return validation && planet.planetApiKey !== '';
    }
    return validation;
  };

  const tpdiCreateErrorHandler = useCallback((err) => {
    errorHandlerTPDI(err);
    errorTpdiCreationEvent();
  }, []);

  return (
    <div className="flex items-center mt-2" style={{ justifyContent: 'space-between' }}>
      <div />
      {isUsingQuery ? (
        <RequestButton
          request={TpdiResource.createOrder}
          args={[tpdiCreateOrderBodyViaDataFilter(state)]}
          buttonText="Prepare Order"
          validation={validateCreateOrdersWithQuery()}
          className="secondary-button"
          responseHandler={handleCreateOrderSuccess}
          errorHandler={tpdiCreateErrorHandler}
          disabledTitle={getOrderQueryDisabledTitle()}
          useConfirmation={shouldConfirm}
          dialogText={DIALOG_TEXT}
        />
      ) : (
        <RequestButton
          request={TpdiResource.createOrder}
          args={[tpdiCreateOrderBodyViaProducts(state)]}
          buttonText="Prepare Order"
          validation={validateCreateOrderWithProducts()}
          className="secondary-button"
          responseHandler={handleCreateOrderSuccess}
          errorHandler={tpdiCreateErrorHandler}
          disabledTitle="Add products, check the limit and use an api-key"
          useConfirmation={shouldConfirm}
          dialogText={DIALOG_TEXT}
        />
      )}
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
