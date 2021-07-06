import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import catalogSlice from '../../store/catalog';
import Select from '../common/Select';

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

  const handlePropertyChange = (value) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyName: value }));
  };

  const handlePropertyValueChange = (value) => {
    if (currentOption.possibleValues === 'Numbers') {
      if (value !== '') {
        value = Number(value);
      }
    }
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, propertyValue: value }));
  };

  const handleOperatorChange = (value) => {
    store.dispatch(catalogSlice.actions.setQueryProperty({ idx: idx, operator: value }));
  };

  return (
    <div>
      <Select
        buttonClassNames="mb-2"
        selected={queryProperties[idx].propertyName}
        onChange={handlePropertyChange}
        options={[
          { value: '', name: 'Select a property' },
          ...filteredOptions.map((opt) => ({
            name: opt.propertyName,
            value: opt.propertyName,
          })),
        ]}
      />
      {queryProperties[idx].propertyName && (
        <Select
          buttonClassNames="mb-2"
          selected={queryProperties[idx].operator}
          onChange={handleOperatorChange}
          options={[
            { name: 'Select an operator', value: '' },
            ...currentOption.operators.map((op) => ({
              value: op,
              name: op,
            })),
          ]}
        />
      )}

      {queryProperties[idx].propertyName ? (
        currentOption.possibleValues === 'Numbers' ? (
          <input
            type="text"
            className="form__input mb-2"
            value={queryProperties[idx].propertyValue}
            onChange={(e) => handlePropertyValueChange(e.target.value)}
          />
        ) : (
          <Select
            buttonClassNames="mb-2"
            selected={queryProperties[idx].propertyValue}
            onChange={handlePropertyValueChange}
            options={[
              { value: '', name: 'Select a value' },
              ...filteredOptions
                .find((option) => option.propertyName === queryProperties[idx].propertyName)
                .possibleValues.map((val) => ({
                  value: val,
                  name: val,
                })),
            ]}
          />
        )
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  queryProperties: state.catalog.queryProperties,
});

export default connect(mapStateToProps)(CatalogOptions);
