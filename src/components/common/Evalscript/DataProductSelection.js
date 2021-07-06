import React, { useState, useEffect } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import Select from '../Select';

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

  const handleSelectedDataProductChange = (value) => {
    if (value) {
      setSelectedDataProduct(dataproducts.find((dp) => dp.id === parseInt(value)));
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
          <div className="flex items-center mb-3">
            <input
              className="form__input w-fit mr-4"
              value={filterText}
              onChange={handleChangeFilterText}
              type="text"
              placeholder="Search for Data Products"
            />

            <Select
              selected={selectedDataProduct.id}
              onChange={handleSelectedDataProductChange}
              options={[
                { value: '', name: 'Select a data product' },
                ...filteredDataProducts.map((dp) => ({ value: dp.id, name: dp.name })),
              ]}
              buttonClassNames="w-fit"
              optionsClassNames="w-full"
            />
          </div>

          {selectedDataProduct.id ? (
            <>
              <p className="text mb-1">
                <span>Description: </span>
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
