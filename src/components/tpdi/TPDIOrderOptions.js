import React, { useState } from 'react';
import { connect } from 'react-redux';
import store, { tpdiSlice, alertSlice } from '../../store';
import { getAreaFromGeometry } from '../input/MapContainer';
import CreateOrderButtonsContainer from './CreateOrderButtonsContainer';

export const errorHandlerTPDI = (error) => {
  if (error.response && error.response.data && error.response.data.error) {
    let returnedError = error.response.data.error;
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: 'Error: ' + returnedError.status + ' - ' + returnedError.message,
      }),
    );
  } else {
    store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
  }
  console.error(error);
};

const TPDIOrderOptions = ({ products, name, collectionId, geometry }) => {
  const [limit, setLimit] = useState(10.0);

  //Generate product Inputs depeneding on internal redux state (one input per product)
  const generateProductIdInputs = (products) => {
    if (products.length > 0) {
      return products.map((prod) => (
        <div key={prod.idx} className="product-id u-margin-bottom-tiny">
          <input
            required
            placeholder="Enter the product id"
            value={prod.id}
            name={prod.idx}
            type="text"
            className="form__input"
            onChange={handleProductIdChange}
          />
          {prod.idx !== 0 ? (
            <span value={prod.idx} onClick={removeProductId} className="remove-product-id">
              -
            </span>
          ) : null}
        </div>
      ));
    }
  };
  const areaSelected = ((getAreaFromGeometry(geometry) / 1e6) * products.length).toFixed(3);

  const handleProductIdChange = (e) => {
    store.dispatch(tpdiSlice.actions.setProducts({ idx: e.target.name, id: e.target.value }));
  };

  const removeProductId = (e) => {
    store.dispatch(tpdiSlice.actions.removeProductId(e.target.getAttribute('value')));
  };

  const handleCollectiondIdChange = (e) => {
    store.dispatch(tpdiSlice.actions.setCollectionId(e.target.value));
  };

  const handleOrderNameChange = (e) => {
    store.dispatch(tpdiSlice.actions.setName(e.target.value));
  };

  const addProductIdInput = () => {
    store.dispatch(tpdiSlice.actions.addProduct());
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

  const couldClear = Boolean(products.length > 1 || products.find((p) => p.id));

  return (
    <>
      <h2 className="heading-secondary">Order Options</h2>
      <div className="form">
        <label className="form__label">Name</label>
        <input
          placeholder="Enter the name of the order"
          type="text"
          value={name}
          className="form__input"
          onChange={handleOrderNameChange}
        />

        <label className="form__label">Collection ID</label>
        <input
          value={collectionId}
          placeholder="Enter your collection Id"
          type="text"
          className="form__input"
          onChange={handleCollectiondIdChange}
        />

        <div className="tpdi-add-product">
          <label style={{ display: 'inline-block' }} className="form__label">
            Product Ids
          </label>
          <span
            style={{ cursor: 'pointer', fontSize: '3rem', display: 'inline', marginLeft: '2rem' }}
            onClick={addProductIdInput}
          >
            +
          </span>
        </div>

        {generateProductIdInputs(products)}

        {couldClear ? (
          <button className="secondary-button u-margin-bottom-small" onClick={handleClearProducts}>
            Clear Products
          </button>
        ) : null}

        <label className="form__label">Area selected</label>
        <p className="text u-margin-bottom-tiny">{areaSelected} sqKm</p>

        <div className="tpdi-limit">
          <label className="form__label">Order Limit (in sqKm)</label>
          <span
            className="info"
            title="Set an approximate order limit to prevent undesired large area requests."
          >
            &#8505;
          </span>
        </div>
        <input
          type="number"
          placeholder="No limit"
          onChange={handleLimitChange}
          defaultValue={10}
          className="form__input"
        />
        <CreateOrderButtonsContainer limit={limit} areaSelected={areaSelected} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.tpdi.products,
  name: state.tpdi.name,
  collectionId: state.tpdi.collectionId,
  geometry: state.request.geometry,
});

export default connect(mapStateToProps)(TPDIOrderOptions);
