import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import RequestButton from '../common/RequestButton';
import AirbusOptions from './AirbusOptions';
import MaxarOptions from './MaxarOptions';
import PlanetOptions from './PlanetOptions';
import { errorHandlerTPDI } from './TPDIOrderOptions';
import { isAirbus } from './utils';
import { getSearchTpdiBody } from '../../api/tpdi/common';
import TpdiResource from '../../api/tpdi/TpdiResource';
import { SUBSCRIPTIONS_MODE } from '../../forms/TPDIRequestForm';

const generateProviderRelatedOptions = (provider) => {
  if (isAirbus(provider)) {
    return <AirbusOptions />;
  } else if (provider === 'PLANET') {
    return <PlanetOptions />;
  } else if (provider === 'MAXAR') {
    return <MaxarOptions />;
  }
};

const validateSearch = (token, state) => Boolean(token);

const getDisabledTitle = (token, state) => {
  if (!token) {
    return 'Log in to use this';
  }
  if (state.tpdi.provider === 'PLANET') {
    return 'You need an API Key to use this.';
  }
};

const searchAllOrders = async (state, reqConfig) => {
  const body = getSearchTpdiBody(state);
  let res = await TpdiResource.search(body, reqConfig);
  const results = res.data.features;
  while (res.data.links?.next) {
    res = await TpdiResource.searchRest(res.data.links.next)(body, reqConfig);
    results.push(...res.data.features);
  }
  return Promise.resolve({ data: { features: results } });
};

const generateProviderOptions = (mode) => {
  if (mode === SUBSCRIPTIONS_MODE) {
    return <option value="PLANET">Planet Scope</option>;
  }
  return (
    <>
      <option value="AIRBUS_SPOT">Airbus (SPOT)</option>
      <option value="AIRBUS_PHR">Airbus (Pleiades)</option>
      <option value="PLANET">Planet Scope</option>
      <option value="MAXAR">MAXAR</option>
    </>
  );
};

const TPDISearchOptions = ({
  tpdi,
  request,
  airbus,
  planet,
  maxar,
  token,
  setSearchResponse,
  setFeaturesWithProvider,
  map,
}) => {
  const state = {
    tpdi,
    request,
    airbus,
    planet,
    map,
    maxar,
  };

  const provider = tpdi.provider;

  const handleChange = (e) => {
    store.dispatch(tpdiSlice.actions.setProvider(e.target.value));
    store.dispatch(tpdiSlice.actions.clearProducts());
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
  }, [tpdi.provider, setFeaturesWithProvider, tpdi.mode]);

  return (
    <>
      <h2 className="heading-secondary">{tpdi.mode === 'ORDERS' ? 'Search' : 'Provider'} Options</h2>
      <div className="form">
        <label htmlFor="tpdi-provider" className="form__label">
          Constellation
        </label>
        <select id="tpdi-provider" className="form__input mb-2" value={provider} onChange={handleChange}>
          {generateProviderOptions(tpdi.mode)}
        </select>
        {generateProviderRelatedOptions(provider)}
        <RequestButton
          request={searchAllOrders}
          args={[state]}
          buttonText="Search for data"
          additionalClassNames={['w-fit', 'mt-2']}
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
  maxar: state.maxar,
  map: state.map,
  token: state.auth.user.access_token,
});

export default connect(mapStateToProps)(TPDISearchOptions);
