import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MinusCircleIcon } from '@heroicons/react/outline';
import store from '../../store';
import alertSlice from '../../store/alert';
import TPDIPlaceOrderButton from './TPDIPlaceOrderButton';
import TPDICollectionSelection from './TPDICollectionSelection';
import { getAreaCoverPercentage, getAreaFromGeometry } from '../common/Map/utils/crsTransform';
import Tooltip from '../common/Tooltip/Tooltip';
import Toggle from '../common/Toggle';
import tpdiSlice, { planetSlice } from '../../store/tpdi';

export const errorHandlerTPDI = (error) => {
  if (error.response?.status === 403) {
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: "You don't have enough permissions to use this",
      }),
    );
  } else {
    try {
      const err = error.response.data.error;
      let errorMsg = err.message;
      if (err.errors) {
        const subErr = err.errors;
        if (subErr.violation) {
          errorMsg += '\n' + subErr.violation;
        }
        if (subErr.invalidValue && subErr.parameter) {
          errorMsg += '\nInvalid Value ' + subErr.invalidValue + 'on ' + subErr.parameter;
        }
      }
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: errorMsg, time: 5000 }));
    } catch (exc) {
      store.dispatch(
        alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong', time: 5000 }),
      );
      console.error(error);
    }
  }
};

const getTpdiAreaSelected = (products, selectedGeometry) => {
  const selectedGeometryArea = getAreaFromGeometry(selectedGeometry);
  if (products.length === 0) {
    return selectedGeometryArea;
  }
  if (products.some((prod) => !prod.geometry)) {
    return selectedGeometryArea * products.length;
  }
  return products.reduce((acc, currentProd) => {
    return acc + getAreaCoverPercentage(selectedGeometry, currentProd.geometry) * selectedGeometryArea;
  }, 0);
};

const TPDIOrderOptions = ({
  products,
  name,
  geometry,
  provider,
  isParsing,
  isUsingQuery,
  setCreateQueryResponse,
  setCreateProductsResponse,
  afterOrderCreationAction,
  amountOfFoundProducts,
  harmonizeTo,
  productBundle,
}) => {
  const [limit, setLimit] = useState(10.0);

  useEffect(() => {
    if (!isParsing) {
      handleClearProducts();
    } else {
      store.dispatch(tpdiSlice.actions.setTpdiParsing(false));
    }
    // eslint-disable-next-line
  }, [geometry, provider]);

  //Generate product Inputs depeneding on internal redux state (one input per product)
  const generateProductIdInputs = (products) => {
    if (products.length > 0) {
      return products.map((prod) => (
        <div key={prod.idx} className="flex items-center mb-2">
          <input
            required
            placeholder="Add products by search"
            value={prod.id}
            name={prod.idx}
            type="text"
            className="form__input"
            autoComplete="off"
            readOnly
          />
          {prod.idx !== 0 ? (
            <MinusCircleIcon value={prod.idx} onClick={removeProductId} className="cursor-pointer w-5 ml-3" />
          ) : null}
        </div>
      ));
    }
  };
  const areaSelected = (getTpdiAreaSelected(products, geometry) / 1e6).toFixed(3);
  const isAreaExact = !isUsingQuery && products.every((prod) => prod.geometry);

  const removeProductId = (e) => {
    store.dispatch(tpdiSlice.actions.removeProductId(e.target.getAttribute('value')));
  };

  const handleOrderNameChange = (e) => {
    store.dispatch(tpdiSlice.actions.setName(e.target.value));
  };

  const handleLimitChange = (e) => {
    if (e.target.value === '') {
      setLimit(Infinity);
    } else {
      setLimit(parseFloat(e.target.value));
    }
  };

  const handleClearProducts = () => {
    store.dispatch(tpdiSlice.actions.clearProducts());
  };

  const canClear = Boolean(products.length > 1 || products.find((p) => p.id));

  const handleOrderTypeChange = () => {
    store.dispatch(tpdiSlice.actions.setIsUsingQuery(!isUsingQuery));
  };
  const handleHarmonizeChange = () => {
    if (harmonizeTo === 'PS2') {
      store.dispatch(planetSlice.actions.setHarmonizeTo('NONE'));
    } else {
      store.dispatch(planetSlice.actions.setHarmonizeTo('PS2'));
    }
  };
  return (
    <>
      <h2 className="heading-secondary">Order Options</h2>
      <div className="form">
        <label htmlFor="tpdi-name" className="form__label">
          Name
        </label>
        <input
          id="tpdi-name"
          placeholder="e.g: My planet"
          type="text"
          value={name}
          className="form__input mb-2"
          onChange={handleOrderNameChange}
          autoComplete="off"
        />
        <div className="flex items-center" style={{ justifyContent: 'space-between' }}>
          <label className="form__label mb-1">Choose order type</label>
          <Tooltip
            direction="right"
            content={
              <div>
                <h3 className="mb-1">ORDER USING PRODUCTS IDS</h3>
                <p className="text">
                  Search for data and add products to you order by clicking on "Add to Order" buttons. This
                  will add product IDs to your Order Options under "Added Products (by ID)."
                </p>
                <h3 className="mb-1 mt-2">ORDER USING QUERY</h3>
                <p className="text">
                  Your order will be based on your AOI and time range, without searching for data and adding
                  products to your order. Especially useful for ordering time-series data. <br />
                  It's possible for some products to be partially covered by clouds, despite the cloud
                  coverage % information being 0.
                </p>
              </div>
            }
          />
        </div>

        <div className="flex items-center mb-2 ml-2">
          <label className="form__label cursor-pointer mr-2">
            <input
              type="radio"
              style={{ marginRight: '1rem' }}
              checked={!isUsingQuery}
              onChange={handleOrderTypeChange}
            />
            Order Product IDs
          </label>
        </div>
        <div className="flex items-center mb-2 ml-2">
          <label className="form__label cursor-pointer mr-2">
            <input type="radio" className="mr-2" checked={isUsingQuery} onChange={handleOrderTypeChange} />
            Order using query
          </label>
        </div>
        <label htmlFor="tpdi-collection-id" className="form__label">
          Collection ID
        </label>
        <TPDICollectionSelection />

        <label className="form__label mb-2">Order size{!isAreaExact ? ' (approx)' : ''}</label>
        <div className="flex items-center justify-between mb-2">
          <p className="text">
            {!isUsingQuery ? (
              <span>
                {areaSelected} km<sup>2</sup>
              </span>
            ) : (
              <span>You will see the estimate cost once you prepare the order.</span>
            )}
          </p>
          <Tooltip content="Ordered products will be clipped to the selected area" direction="right" />
        </div>

        <div className="flex items-center mb-2">
          <label htmlFor="order-limit" className="form__label">
            Order Limit (in km<sup>2</sup>)
          </label>
        </div>
        <div className="flex items-center justify-between">
          <input
            id="order-limit"
            type="number"
            placeholder="No limit"
            onChange={handleLimitChange}
            defaultValue={10}
            className="form__input mb-2"
          />
          <Tooltip
            content="Set an approximate order limit to prevent undesired large area requests."
            direction="right"
          ></Tooltip>
        </div>

        {!isUsingQuery && <label className="form__label inline-block">Added Products (by ID)</label>}

        {!isUsingQuery && generateProductIdInputs(products)}

        {canClear ? (
          <button className="secondary-button mb-2" onClick={handleClearProducts}>
            Clear Products
          </button>
        ) : null}

        {provider === 'PLANET' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="form__label mr-1">Harmonize data</label>
                <Toggle
                  onChange={handleHarmonizeChange}
                  checked={harmonizeTo === 'PS2'}
                  disabled={productBundle.includes('sr')}
                />
              </div>
              <Tooltip
                content="Harmonization is not yet supported for surface reflectance products, thus this field must be explicitly set to NONE if productBundle is analytic_sr or analytic_sr_udm2."
                direction="right"
              />
            </div>
          </>
        )}

        <TPDIPlaceOrderButton
          limit={limit}
          areaSelected={areaSelected}
          setCreateQueryResponse={setCreateQueryResponse}
          setCreateProductsResponse={setCreateProductsResponse}
          afterOrderCreationAction={afterOrderCreationAction}
          amountOfFoundProducts={amountOfFoundProducts}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.tpdi.products,
  name: state.tpdi.name,
  geometry: state.map.wgs84Geometry,
  provider: state.tpdi.provider,
  isParsing: state.tpdi.isParsing,
  isUsingQuery: state.tpdi.isUsingQuery,
  harmonizeTo: state.planet.harmonizeTo,
  productBundle: state.planet.productBundle,
});

export default connect(mapStateToProps)(TPDIOrderOptions);
