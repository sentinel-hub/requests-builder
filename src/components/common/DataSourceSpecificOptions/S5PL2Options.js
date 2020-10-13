import React, { useState, useEffect } from 'react';
import store, { requestSlice } from '../../../store';
import { connect } from 'react-redux';
import BaseOptionsNoCC from './BaseOptionsNoCC';

const S5PL2Options = ({ reduxTimeliness, reduxMinQa, idx }) => {
  const [minQa, setMinQa] = useState('50');
  const [enableMinQa, setEnableMinQa] = useState(false);

  const handleTimelinessChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ timeliness: e.target.value, idx: idx }));
  };

  const handleMinQaChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ minQa: e.target.value, idx: idx }));
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
    <div>
      <BaseOptionsNoCC idx={idx} />
      <label htmlFor={`timeliness-${idx}`} className="form__label u-margin-top-tiny">
        Timeliness
      </label>
      <select
        id={`timeliness-${idx}`}
        className="form__input"
        onChange={handleTimelinessChange}
        value={reduxTimeliness}
      >
        <option value="DEFAULT">Default</option>
        <option value="NRTI">NRTI</option>
        <option value="OFFL">OFFL</option>
        <option value="RPRO">RPRO</option>
      </select>
      <label htmlFor={`min-qa-${idx}`} className="form__label">
        MinQa
      </label>
      <div className="minqa-option">
        <input
          id={`min-qa-${idx}`}
          disabled={!enableMinQa}
          className="form__input form__input--range"
          style={{ display: 'inline-block' }}
          type="range"
          min="0"
          max="100"
          value={minQa}
          onChange={handleMinQaChange}
        />
        <p className="text" style={{ display: 'inline-block', marginBottom: '0.8rem', marginLeft: '1rem' }}>
          {minQa !== 'DEFAULT' ? minQa + ' %' : ''}
        </p>
        <div className="minqa-option--checkbox">
          <input
            id={`enable-minQa-${idx}`}
            className="form__input"
            style={{ display: 'inline-block', marginRight: '1rem' }}
            type="checkbox"
            checked={enableMinQa}
            onChange={handleDisableMinQa}
          />
          <label htmlFor={`enable-minQa-${idx}`} className="text" style={{ display: 'inline-block' }}>
            {enableMinQa ? 'Default' : 'Enable'}
          </label>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxTimeliness: store.request.dataFilterOptions[ownProps.idx].options.timeliness,
  reduxMinQa: store.request.processingOptions[ownProps.idx].options.minQa,
});

export default connect(mapStateToProps)(S5PL2Options);
