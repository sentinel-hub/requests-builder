import React from 'react';
import store, { planetSlice } from '../../store';
import { connect } from 'react-redux';

const PlanetOptions = ({ apiKey, maxCC }) => {
  const handleApiKeyChange = (e) => {
    store.dispatch(planetSlice.actions.setApiKey(e.target.value));
  };
  const handleMaxCCChange = (e) => {
    store.dispatch(planetSlice.actions.setMaxCloudCoverage(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor="planet-api-key" className="form__label">
        Planet API Key
      </label>
      <input
        id="planet-api-key"
        placeholder="Your Planet API key"
        value={apiKey}
        required
        type="text"
        className="form__input"
        onChange={handleApiKeyChange}
      />
      <label htmlFor="planet-cc" className="form__label">
        Max Cloud Coverage
      </label>
      <input
        id="planet-cc"
        value={maxCC}
        className="form__input form__input--range"
        onChange={handleMaxCCChange}
        type="range"
        min="0"
        max="100"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiKey: state.planet.planetApiKey,
  maxCC: state.planet.maxCloudCoverage,
});

export default connect(mapStateToProps)(PlanetOptions);
