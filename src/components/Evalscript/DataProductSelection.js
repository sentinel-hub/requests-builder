import React, { useState, useEffect } from 'react';
import store, { requestSlice } from '../../store';

// Search by id, name, description.
const filterDataProducts = (dataproducts, filterText) => {
  if (!filterText) {
    return dataproducts;
  } else {
    return dataproducts.filter((dp) => {
      return (
        dp.name.toLowerCase().includes(filterText) ||
        dp.description.toLowerCase().includes(filterText) ||
        dp.id + '' === filterText
      );
    });
  }
};

const DataProductSelection = ({ dataproducts }) => {
  const [selectedDataProduct, setSelectedDataProduct] = useState({
    id: '',
  });
  const [filterText, setFilterText] = useState('');
  const filteredDataProducts = filterDataProducts(dataproducts, filterText);

  const handleChangeFilterText = (e) => {
    setFilterText(e.target.value);
  };

  const handleSelectedDataProductChange = (e) => {
    if (e.target.value) {
      setSelectedDataProduct(dataproducts.find((dp) => dp.id === parseInt(e.target.value)));
    } else {
      setSelectedDataProduct({ id: '' });
    }
  };

  // Reset to default on search.
  useEffect(() => {
    setSelectedDataProduct({ id: '' });
  }, [filterText]);

  // set evalscript auto
  useEffect(() => {
    if (selectedDataProduct.id) {
      store.dispatch(requestSlice.actions.setEvalscript(selectedDataProduct.evalScript));
    }
  }, [selectedDataProduct]);

  return (
    <>
      {dataproducts.length > 0 ? (
        <>
          <select
            value={selectedDataProduct.id}
            onChange={handleSelectedDataProductChange}
            className="form__input"
          >
            <option value="">Select a Dataproduct</option>
            {filteredDataProducts.map((dp) => (
              <option value={dp.id} key={dp.id} className="text">
                {dp.name}
              </option>
            ))}
          </select>

          <input
            className="form__input"
            value={filterText}
            onChange={handleChangeFilterText}
            type="text"
            placeholder="Search for Data Products"
          />

          {selectedDataProduct.id ? (
            <>
              <p className="text u-margin-bottom-tiny">
                <span>Description:</span>
                {dataproducts.find((dp) => dp.id === parseInt(selectedDataProduct.id)).description}
              </p>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default DataProductSelection;
