import React from 'react';
import store from '../../store';
import { planetSlice } from '../../store/tpdi';
import { connect } from 'react-redux';
import Tooltip from '../common/Tooltip/Tooltip';
import TargetBlankLink from '../common/TargetBlankLink';

const PlanetOptions = ({ apiKey, maxCC, productBundle, harmonizeTo }) => {
  const handleApiKeyChange = (e) => {
    store.dispatch(planetSlice.actions.setApiKey(e.target.value));
  };
  const handleMaxCCChange = (e) => {
    store.dispatch(planetSlice.actions.setMaxCloudCoverage(e.target.value));
  };
  const handleProductBundleChange = (e) => {
    if (e.target.value.includes('sr') && harmonizeTo !== 'NONE') {
      store.dispatch(planetSlice.actions.setHarmonizeTo('NONE'));
    }
    store.dispatch(planetSlice.actions.setProductBundle(e.target.value));
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="planet-api-key" className="form__label">
        Planet API Key
      </label>
      <div className="flex items-center justify-between">
        <input
          id="planet-api-key"
          placeholder="Your Planet API key"
          value={apiKey}
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
      <label className="form__label" htmlFor="planet-product-bundle">
        Product Bundle
      </label>
      <div className="flex items-center justify-between">
        <select
          className="form__input mb-2"
          id="planet-product-bundle"
          value={productBundle}
          onChange={handleProductBundleChange}
        >
          <option value="analytic">analytic</option>
          <option value="analytic_udm2">analytic_udm2</option>
          <option value="analytic_sr">analytic_sr</option>
          <option value="analytic_sr_udm2">analytic_sr_udm2</option>
        </select>
        <Tooltip
          content={
            <p>
              PlanetScope data can be ordered through SH either as scaled top of the atmosphere reflectance or
              surface reflectance, according to the requested asset type. Furthermore, ordering usable data
              mask bands (UDM2) is optional. The value of the productBundle parameter specifies what will be
              ordered. Check the{' '}
              <TargetBlankLink
                href="https://docs.sentinel-hub.com/api/latest/data/planet-scope/#productbundle-parameter"
                children="docs"
              />{' '}
              for more information.
            </p>
          }
          direction="right"
        />
      </div>
      <label htmlFor="planet-cc" className="form__label">
        Max Cloud Coverage - {maxCC}%
      </label>
      <input
        id="planet-cc"
        value={maxCC}
        className="form__input mb-2 form__input--range"
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
  productBundle: state.planet.productBundle,
  harmonizeTo: state.planet.harmonizeTo,
});

export default connect(mapStateToProps)(PlanetOptions);
