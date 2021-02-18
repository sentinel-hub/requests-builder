import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import Toggle from '../common/Toggle';

const CatalogFields = ({ includeFields, disableInclude, excludeFields, disableExclude }) => {
  const handleDisableInclude = () => {
    store.dispatch(catalogSlice.actions.setDisableIncludeFields(!disableInclude));
  };
  const handleDisableExclude = () => {
    store.dispatch(catalogSlice.actions.setDisableExcludeFields(!disableExclude));
  };
  const handleIncludeFieldChange = (e) => {
    let idx = parseInt(e.target.name);
    store.dispatch(catalogSlice.actions.setIncludeField({ idx, value: e.target.value }));
  };
  const handleExcludeFieldChange = (e) => {
    let idx = parseInt(e.target.name);
    store.dispatch(catalogSlice.actions.setExcludeField({ idx, value: e.target.value }));
  };
  const handleAddIncludeField = () => {
    store.dispatch(catalogSlice.actions.addIncludeField());
  };
  const handleAddExcludeField = () => {
    store.dispatch(catalogSlice.actions.addExcludeField());
  };

  const handleDeleteIncludeField = (e) => {
    const idx = parseInt(e.target.getAttribute('name'));
    store.dispatch(catalogSlice.actions.deleteIncludeField(idx));
  };

  const handleDeleteExcludeField = (e) => {
    const idx = parseInt(e.target.getAttribute('name'));
    store.dispatch(catalogSlice.actions.deleteExcludeField(idx));
  };

  return (
    <>
      <h2 className="heading-secondary">Fields Selection</h2>
      <div className="form">
        <div className="toggle-with-label">
          <label htmlFor="catalog-include" className="form__label">
            Include
          </label>
          <Toggle id="catalog-include" checked={!disableInclude} onChange={handleDisableInclude} />
        </div>
        {includeFields.map((field, idx) => (
          <div key={'include - ' + idx} className="input-with-item">
            <input
              onChange={handleIncludeFieldChange}
              disabled={disableInclude}
              type="text"
              value={field}
              name={idx}
              placeholder="Field path"
              className="form__input"
            />
            <span name={idx} className="close-span" onClick={handleDeleteIncludeField}>
              &#x2715;
            </span>
          </div>
        ))}
        <button
          onClick={handleAddIncludeField}
          disabled={disableInclude}
          className={`secondary-button secondary-button--fit ${
            disableInclude ? 'secondary-button--disabled' : ''
          }`}
        >
          Add Field
        </button>
        <div className="toggle-with-label u-margin-top-small">
          <label htmlFor="catalog-exclude" className="form__label">
            Exclude
          </label>
          <Toggle id="catalog-exclude" checked={!disableExclude} onChange={handleDisableExclude} />
        </div>
        {excludeFields.map((field, idx) => (
          <div key={'exclude - ' + idx} className="input-with-item">
            <input
              onChange={handleExcludeFieldChange}
              disabled={disableExclude}
              type="text"
              value={field}
              name={idx}
              placeholder="Field path"
              className="form__input"
            />
            <span name={idx} className="close-span" onClick={handleDeleteExcludeField}>
              &#x2715;
            </span>
          </div>
        ))}
        <button
          onClick={handleAddExcludeField}
          disabled={disableExclude}
          className={`secondary-button secondary-button--fit ${
            disableExclude ? 'secondary-button--disabled' : ''
          }`}
        >
          Add Field
        </button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  includeFields: state.catalog.includeFields,
  disableInclude: state.catalog.disableInclude,
  disableExclude: state.catalog.disableExclude,
  excludeFields: state.catalog.excludeFields,
});

export default connect(mapStateToProps)(CatalogFields);
