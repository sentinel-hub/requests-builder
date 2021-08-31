import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { CUSTOM } from '../../../utils/const/const';
import Select from '../Select';
import { fetchDataProducts } from './utils';
import Toggle from '../Toggle';

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

const canUseDataProducts = (datasource, token) => token && datasource !== CUSTOM;

const DataProductSelection = ({ token, dataCollection }) => {
  const [selectedDataProduct, setSelectedDataProduct] = useState({
    id: '',
  });
  const [filterText, setFilterText] = useState('');
  const [dataproducts, setDataProducts] = useState([]);
  const filteredDataProducts = filterDataProducts(dataproducts, filterText);
  const [isFetchingDataProducts, setIsFetchingDataProducts] = useState(false);
  const [useDataProduct, setUseDataProduct] = useState(false);

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

  // Reset Data Products when datasource changes.
  useEffect(() => {
    setDataProducts([]);
  }, [dataCollection]);

  // set evalscript auto
  useEffect(() => {
    if (selectedDataProduct.id) {
      store.dispatch(requestSlice.actions.setEvalscript(selectedDataProduct.evalScript));
    }
  }, [selectedDataProduct]);

  const handleUseDataProductChange = () => {
    setUseDataProduct(!useDataProduct);
  };

  const fetchAndSetDataProducts = useCallback(async (dataCollection, token, reqConfig) => {
    try {
      setIsFetchingDataProducts(true);
      const dataproducts = await fetchDataProducts(dataCollection, token, reqConfig);
      setDataProducts(dataproducts);
      setIsFetchingDataProducts(false);
    } catch (error) {
      if (!Axios.isCancel(error)) {
        console.error(error);
      }
    }
  }, []);

  // Fetch Data Products if needed.
  useEffect(() => {
    let source = Axios.CancelToken.source();
    if (useDataProduct && dataproducts.length === 0 && canUseDataProducts(dataCollection, token)) {
      fetchAndSetDataProducts(dataCollection, token, { cancelToken: source.token });
    }
    return () => {
      if (source) {
        source.cancel();
      }
    };
  }, [dataCollection, useDataProduct, token, dataproducts.length, fetchAndSetDataProducts]);

  if (!canUseDataProducts(dataCollection, token)) {
    return null;
  }

  return (
    <>
      <div className="flex items-center mb-2">
        <label htmlFor="use-dataproduct" className="form__label cursor-pointer mr-2">
          Use Data Product
        </label>
        <Toggle checked={useDataProduct} onChange={handleUseDataProductChange} id="use-dataproduct" />
      </div>
      {isFetchingDataProducts ? (
        <p className="text mb-2">Loading Data Products...</p>
      ) : useDataProduct && dataproducts.length > 0 ? (
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
