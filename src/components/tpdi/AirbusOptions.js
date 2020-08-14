import React, { useState } from 'react';
import store, { airbusSlice } from '../../store';
import { connect } from 'react-redux';
import AirbusAdvancedOptions from './AirbusAdvancedOptions';
import Toggle from '../Toggle';

const AirbusOptions = ({ constellation }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleShowAdvancedChange = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleConstellationChange = (e) => {
    store.dispatch(airbusSlice.actions.setConstellation(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="form__label">Constellation</label>
      <select className="form__input" value={constellation} onChange={handleConstellationChange}>
        <option value="PHR">PHR (Pleiades)</option>
        <option value="SPOT">SPOT</option>
      </select>
      <div className="toggle-with-label">
        <label htmlFor="adv-options" className="form__label">
          Advanced Options
        </label>
        <Toggle id="adv-options" checked={showAdvanced} onChange={handleShowAdvancedChange} />
      </div>
      {showAdvanced ? <AirbusAdvancedOptions /> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  constellation: state.airbus.constellation,
});

export default connect(mapStateToProps)(AirbusOptions);
