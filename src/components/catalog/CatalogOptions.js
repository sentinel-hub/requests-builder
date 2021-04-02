import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';

const CatalogOptions = ({ options, queryProperties, idx }) => {
  const alreadyDefined = queryProperties
    .slice(0, idx)
    .concat(queryProperties.slice(idx + 1))
    .map((queryProp) => queryProp.propertyName);

  const filteredOptions =
    alreadyDefined.length > 0
      ? options.filter((option) =>
          Boolean(!alreadyDefined.find((defined) => defined === option.propertyName)),
        )
      : options;

  const currentOption = filteredOptions.find(
    (option) => option.propertyName === queryProperties[idx].propertyName,
  );

  const handlePropertyChange = (e) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyName: e.target.value }));
  };

  const handlePropertyValueChange = (e) => {
    let { value } = e.target;
    if (currentOption.possibleValues === 'Numbers') {
      if (value !== '') {
        value = Number(value);
      }
    }
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyValue: value }));
  };

  const handleOperatorChange = (e) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, operator: e.target.value }));
  };

  return (
    <div>
      <select
        className="form__input"
        value={queryProperties[idx].propertyName}
        onChange={handlePropertyChange}
      >
        <option value="">Select a Property</option>
        {filteredOptions.map((option) => (
          <option value={option.propertyName} key={option.propertyName}>
            {option.propertyName}
          </option>
        ))}
      </select>

      {queryProperties[idx].propertyName ? (
        <select className="form__input" value={queryProperties[idx].operator} onChange={handleOperatorChange}>
          <option value="">Select an Operator</option>
          {currentOption.operators.map((val) => (
            <option value={val} key={val}>
              {val}
            </option>
          ))}
        </select>
      ) : null}

      {queryProperties[idx].propertyName ? (
        currentOption.possibleValues === 'Numbers' ? (
          <input
            type="text"
            className="form__input"
            value={queryProperties[idx].propertyValue}
            onChange={handlePropertyValueChange}
          />
        ) : (
          <select
            className="form__input"
            value={queryProperties[idx].propertyValue}
            onChange={handlePropertyValueChange}
          >
            <option value="">Select a Value</option>
            {filteredOptions
              .find((option) => option.propertyName === queryProperties[idx].propertyName)
              .possibleValues.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
          </select>
        )
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  queryProperties: state.catalog.queryProperties,
});

export default connect(mapStateToProps)(CatalogOptions);
