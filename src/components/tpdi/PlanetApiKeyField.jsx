import React from 'react';
import store from '../../store';
import { planetSlice } from '../../store/tpdi';
import Tooltip from '../common/Tooltip/Tooltip';

const PlanetApiKeyField = ({ planetApiKey }) => {
  const handleApiKeyChange = (e) => {
    store.dispatch(planetSlice.actions.setApiKey(e.target.value));
  };

  return (
    <>
      <label htmlFor="planet-api-key" className="form__label">
        Planet API Key
      </label>

      <div className="flex items-center justify-between">
        <input
          id="planet-api-key"
          placeholder="Your Planet API key"
          value={planetApiKey}
          required
          type="text"
          className="form__input mb-2"
          onChange={handleApiKeyChange}
        />
        <Tooltip
          content="Enter a Planet API key, that you received via email after purchasing a PlanetScope Sentinel Hub Package"
          direction="right"
        />
      </div>
    </>
  );
};

export default PlanetApiKeyField;
