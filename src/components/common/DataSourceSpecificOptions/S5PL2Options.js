import React, { useState, useEffect } from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import Select from '../Select';

const S5PL2Options = ({ reduxTimeliness, reduxMinQa, idx }) => {
  const [minQa, setMinQa] = useState('50');
  const [enableMinQa, setEnableMinQa] = useState(false);

  const handleTimelinessChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ timeliness: value, idx: idx }));
  };

  const handleMinQaChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ minQa: Number(e.target.value), idx: idx }));
  };
  useEffect(() => {
    if (reduxMinQa) {
      setEnableMinQa(true);
      setMinQa(reduxMinQa);
    }
  }, [reduxMinQa]);

  const handleDisableMinQa = () => {
    if (!enableMinQa) {
      store.dispatch(requestSlice.actions.setProcessingOptions({ minQa: minQa, idx: idx }));
    } else {
      store.dispatch(requestSlice.actions.setProcessingOptions({ minQa: undefined, idx: idx }));
    }
    setEnableMinQa(!enableMinQa);
  };
  return (
    <>
      <BaseOptionsNoCC idx={idx} />
      <Select
        label="Timeliness"
        onChange={handleTimelinessChange}
        selected={reduxTimeliness}
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'NRTI', name: 'NRTI' },
          { value: 'OFFL', name: 'OFFL' },
          { value: 'RPRO', name: 'RPRO' },
        ]}
      />

      <label htmlFor={`min-qa-${idx}`} className="form__label block">
        MinQa
      </label>
      <div className="flex">
        <input
          id={`min-qa-${idx}`}
          disabled={!enableMinQa}
          className="form__input form__input--range inline-block mb-2"
          type="range"
          min="0"
          max="100"
          value={minQa}
          onChange={handleMinQaChange}
        />
        <p className="text inline-block mb-2 ml-2">{minQa !== 'DEFAULT' ? minQa + ' %' : ''}</p>
        <div className="flex ml-4">
          <input
            id={`enable-minQa-${idx}`}
            className="form__input inline-block mb-2"
            type="checkbox"
            checked={enableMinQa}
            onChange={handleDisableMinQa}
          />
          <label htmlFor={`enable-minQa-${idx}`} className="text block">
            {enableMinQa ? 'Default' : 'Enable'}
          </label>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxTimeliness: store.request.dataFilterOptions[ownProps.idx].options.timeliness,
  reduxMinQa: store.request.processingOptions[ownProps.idx].options.minQa,
});

export default connect(mapStateToProps)(S5PL2Options);
