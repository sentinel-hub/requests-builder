import React, { useState } from 'react';
import RequestButton from '../RequestButton';
import { getTPDISearchRequest } from './generateTPDIRequests';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import { connect } from 'react-redux';
import PlanetFeatureInfo from './PlanetFeatureInfo';
import AirbusFeatureInfo from './AirbusFeatureInfo';

const validateSearch = (token, state) => {
  if (state.tpdi.provider === 'PLANET') {
    return Boolean(token && state.planet.planetApiKey);
  } else {
    return Boolean(token);
  }
};

const generateFeatures = (featuresWithProvider) => {
  if (featuresWithProvider.provider === 'AIRBUS') {
    return featuresWithProvider.features.map((feature) => (
      <AirbusFeatureInfo key={feature.properties.id} feature={feature} />
    ));
  } else if (featuresWithProvider.provider === 'PLANET') {
    return featuresWithProvider.features.map((feature) => (
      <PlanetFeatureInfo key={feature.id} feature={feature} />
    ));
  }
};

const SearchResultsContainer = ({ tpdi, request, airbus, planet, token }) => {
  const state = {
    tpdi,
    request,
    airbus,
    planet,
  };

  const [featuresWithProvider, setFeaturesWithProvider] = useState({
    provider: '',
    features: [],
  });

  const handleSearchFeatures = (response) => {
    if (response.features) {
      setFeaturesWithProvider({
        provider: tpdi.provider,
        features: response.features,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h2 className="heading-secondary">Search Results</h2>
      <div className="form" style={{ overflowY: 'scroll', maxHeight: '450px' }}>
        <div className="u-margin-bottom-small">
          <RequestButton
            request={getTPDISearchRequest}
            args={[state, token]}
            buttonText="Search for data"
            validation={validateSearch(token, state)}
            className="secondary-button"
            responseHandler={handleSearchFeatures}
            disabledTitle="Log in to use this"
            errorHandler={errorHandlerTPDI}
          />
        </div>
        {featuresWithProvider.features.length > 0 ? generateFeatures(featuresWithProvider) : null}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  tpdi: state.tpdi,
  request: state.request,
  airbus: state.airbus,
  planet: state.planet,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(SearchResultsContainer);
