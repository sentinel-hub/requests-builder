import React from 'react';
import store, { planetSlice } from '../../store';
import { connect } from 'react-redux';

const PlanetOptions = ({ apiKey }) => {
  const handleApiKeyChange = (e) => {
    store.dispatch(planetSlice.actions.setApiKey(e.target.value));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="form__label">Planet API Key</label>
      <input
        placeholder="Your Planet API key"
        value={apiKey}
        required
        type="text"
        className="form__input"
        onChange={handleApiKeyChange}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiKey: state.planet.planetApiKey,
});

export default connect(mapStateToProps)(PlanetOptions);
