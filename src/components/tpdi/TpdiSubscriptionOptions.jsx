import React from 'react';
import { connect } from 'react-redux';
import { getAreaFromGeometry } from '../common/Map/utils/geoUtils';
import PlanetApiKeyField from './PlanetApiKeyField';

import TPDICollectionSelection from './TPDICollectionSelection';
import TpdiNameField from './TpdiNameField';
import TpdiPlaceSubscriptionButton from './TpdiPlaceSubscriptionButton';

const TpdiSubscriptionOptions = ({
  name,
  productBundle,
  provider,
  geometry,
  planetApiKey,
  setSubscriptions,
}) => {
  const area = getAreaFromGeometry(geometry);
  return (
    <>
      <h2 className="heading-secondary">Subscription Options</h2>
      <div className="form">
        <TpdiNameField name={name} />

        <label htmlFor="tpdi-collection-id" className="form__label mt-3">
          Target Collection
        </label>
        <TPDICollectionSelection provider={provider} productBundle={productBundle} />

        <p className="my-2">
          <b>Area selected:</b> {(area / 1e6).toFixed(3)} km <sup>2</sup>
        </p>

        <PlanetApiKeyField planetApiKey={planetApiKey} />
        <TpdiPlaceSubscriptionButton setSubscriptions={setSubscriptions} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  name: state.tpdi.name,
  provider: state.tpdi.provider,
  productBundle: state.planet.productBundle,
  planetApiKey: state.planet.planetApiKey,
  geometry: state.map.wgs84Geometry,
});

export default connect(mapStateToProps)(TpdiSubscriptionOptions);
