import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import RequestButton from '../common/RequestButton';
import AirbusOptions from './AirbusOptions';
import { getTPDISearchRequest } from './generateTPDIRequests';
import PlanetOptions from './PlanetOptions';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import { isAirbus } from './utils';

const generateProviderRelatedOptions = (provider) => {
  if (isAirbus(provider)) {
    return <AirbusOptions />;
  } else if (provider === 'PLANET') {
    return <PlanetOptions />;
  }
};

const validateSearch = (token, state) => {
  if (state.tpdi.provider === 'PLANET') {
    return Boolean(token && state.planet.planetApiKey);
  } else {
    return Boolean(token);
  }
};

const getDisabledTitle = (token, state) => {
  if (!token) {
    return 'Log in to use this';
  }
  if (state.tpdi.provider === 'PLANET') {
    return 'You need an API Key to use this.';
  }
};

const TPDISearchOptions = ({
  tpdi,
  request,
  airbus,
  planet,
  token,
  setSearchResponse,
  setFeaturesWithProvider,
}) => {
  const state = {
    tpdi,
    request,
    airbus,
    planet,
  };

  const provider = tpdi.provider;

  const handleChange = (e) => {
    store.dispatch(tpdiSlice.actions.setProvider(e.target.value));
  };
  const handleSearchFeatures = (response) => {
    if (response.features) {
      setFeaturesWithProvider({
        provider: tpdi.provider,
        features: response.features,
      });
    }
    setSearchResponse(JSON.stringify(response, null, 2));
  };

  useEffect(() => {
    setFeaturesWithProvider({
      provider: '',
      features: [],
    });
  }, [tpdi.provider, setFeaturesWithProvider]);

  return (
    <>
      <h2 className="heading-secondary">Search Options</h2>
      <div className="form">
        <label htmlFor="tpdi-provider" className="form__label">
          Constellation
        </label>
        <select id="tpdi-provider" className="form__input" value={provider} onChange={handleChange}>
          <option value="AIRBUS_SPOT">Airbus (SPOT)</option>
          <option value="AIRBUS_PHR">Airbus (Pleaides)</option>
          <option value="PLANET">Planet Scope</option>
        </select>
        {generateProviderRelatedOptions(provider)}
        <RequestButton
          request={getTPDISearchRequest}
          args={[state, token]}
          buttonText="Search for data"
          validation={validateSearch(token, state)}
          className="secondary-button"
          responseHandler={handleSearchFeatures}
          disabledTitle={getDisabledTitle(token, state)}
          errorHandler={errorHandlerTPDI}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  tpdi: state.tpdi,
  request: state.request,
  airbus: state.airbus,
  planet: state.planet,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDISearchOptions);
