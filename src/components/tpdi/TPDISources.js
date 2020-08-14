import React from 'react';
import { connect } from 'react-redux';
import store, { tpdiSlice } from '../../store';
import AirbusOptions from '../tpdi/AirbusOptions';
import PlanetOptions from '../tpdi/PlanetOptions';

const generateProviderRelatedOptions = (provider) => {
  if (provider === 'AIRBUS') {
    return <AirbusOptions />;
  } else if (provider === 'PLANET') {
    return <PlanetOptions />;
  }
};

const TPDISources = ({ provider }) => {
  const handleChange = (e) => {
    store.dispatch(tpdiSlice.actions.setProvider(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary">Search Options</h2>
      <div className="form">
        <label className="form__label">Provider</label>
        <select className="form__input" value={provider} onChange={handleChange}>
          <option value="AIRBUS">Airbus</option>
          <option value="PLANET">Planet Scope</option>
        </select>
        {generateProviderRelatedOptions(provider)}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  provider: state.tpdi.provider,
});

export default connect(mapStateToProps)(TPDISources);
