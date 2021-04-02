import React, { useState } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { DATASOURCES } from '../../../utils/const';
import { generateDataSourceRelatedOptions } from '../DataSourceSelect';
import Toggle from '../Toggle';

// Get all datasources except from CUSTOM and Datafusion
const generateDataFusionSourcesOptions = () => {
  return Object.keys(DATASOURCES)
    .filter((ds) => ds !== 'CUSTOM' && ds !== 'DATAFUSION')
    .map((key) => (
      <option key={key} value={key}>
        {key}
      </option>
    ));
};

const DataFusionOptions = ({ datafusionSources }) => {
  const [showAdvanced, setShowAdvanced] = useState([false, false]);

  const handleDatasourceChange = (e) => {
    store.dispatch(
      requestSlice.actions.setDatafusionSource({ idx: parseInt(e.target.name), datasource: e.target.value }),
    );
  };

  const handleIdChange = (e) => {
    store.dispatch(
      requestSlice.actions.setDataFusionId({ idx: parseInt(e.target.name), id: e.target.value }),
    );
  };

  const handleShowAdvanced = (e) => {
    let idx = parseInt(e.target.name);
    setShowAdvanced(
      showAdvanced
        .slice(0, idx)
        .concat([!showAdvanced[idx]])
        .concat(showAdvanced.slice(idx + 1)),
    );
  };

  const handleAddDatasource = () => {
    setShowAdvanced([...showAdvanced, false]);
    store.dispatch(requestSlice.actions.addDatafusionSource());
  };

  const handleDeleteDatasource = (e) => {
    let idx = parseInt(e.target.name);
    store.dispatch(requestSlice.actions.deleteDatafusionSource(idx));
  };

  const handleReset = (e) => {
    let idx = parseInt(e.target.name);
    store.dispatch(requestSlice.actions.resetAdvancedOptions(idx));
    setShowAdvanced(
      showAdvanced
        .slice(0, idx)
        .concat([false])
        .concat(showAdvanced.slice(idx + 1)),
    );
  };

  const generateDataFusionInputs = () => {
    return datafusionSources.map((source, idx) => (
      <div className="form" style={{ paddingTop: '0', paddingBottom: '0' }} key={idx}>
        <label htmlFor={`datasource-${idx}`} className="form__label">
          Data Collection {idx + 1}
        </label>
        <select
          id={`datasource-${idx}`}
          name={idx}
          onChange={handleDatasourceChange}
          value={datafusionSources[idx].datasource}
          className="form__input"
        >
          {generateDataFusionSourcesOptions()}
        </select>
        <label htmlFor={`identifier-${idx}`} className="form__label">
          Id {idx + 1}
        </label>
        <input
          id={`identifier-${idx}`}
          onChange={handleIdChange}
          name={idx}
          type="text"
          placeholder="Enter datasource Id"
          className="form__input u-margin-bottom-small"
          value={datafusionSources[idx].id}
        ></input>
        <div className="toggle-with-label">
          <label className="form__label" htmlFor={`advanced-options${idx}`}>
            {showAdvanced[idx] ? 'Hide advanced options' : 'Show advanced options'}
          </label>
          <Toggle
            checked={showAdvanced[idx] !== undefined ? showAdvanced[idx] : false}
            onChange={handleShowAdvanced}
            id={`advanced-options${idx}`}
            name={idx}
          />
        </div>
        {showAdvanced[idx] ? (
          <>
            {generateDataSourceRelatedOptions(datafusionSources[idx].datasource, idx)}
            <button className="secondary-button u-margin-right-small" name={idx} onClick={handleReset}>
              Reset to default
            </button>
          </>
        ) : null}
        {idx > 1 ? (
          <button
            onClick={handleDeleteDatasource}
            className="secondary-button secondary-button--cancel"
            name={idx}
          >
            Delete Datasource
          </button>
        ) : null}
        {datafusionSources.length - 1 > idx ? (
          <hr className="u-margin-bottom-small u-margin-top-tiny"></hr>
        ) : null}
      </div>
    ));
  };

  return (
    <>
      <div className="datafusion-options">{generateDataFusionInputs()}</div>
      <button onClick={handleAddDatasource} className="secondary-button u-margin-top-small">
        Add Datasource
      </button>
    </>
  );
};

const mapStateToProps = (state) => ({
  datafusionSources: state.request.datafusionSources,
});

export default connect(mapStateToProps)(DataFusionOptions);
