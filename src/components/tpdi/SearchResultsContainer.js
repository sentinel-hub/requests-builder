import React from 'react';
import { connect } from 'react-redux';
import PlanetFeatureInfo from './PlanetFeatureInfo';
import AirbusFeatureInfo from './AirbusFeatureInfo';
import MaxarFeatureInfo from './MaxarFeatureInfo';
import { isAirbus } from './utils';

const sortTpdiFeatures = (featuresWithProvider) => {
  if (isAirbus(featuresWithProvider.provider)) {
    return {
      ...featuresWithProvider,
      features: featuresWithProvider.features.sort(
        (a, b) => new Date(a.properties?.acquisitionDate) > new Date(b.properties?.acquisitionDate),
      ),
    };
  } else if (featuresWithProvider.provider === 'PLANET') {
    return {
      ...featuresWithProvider,
      features: featuresWithProvider.features.sort(
        (a, b) => new Date(a.properties?.acquired) > new Date(b.properties?.acquired),
      ),
    };
  } else if (featuresWithProvider.provider === 'MAXAR') {
    return {
      ...featuresWithProvider,
      features: featuresWithProvider.features.sort(
        (a, b) => new Date(a.acquisitionDateStart) > new Date(b.acquisitionDateStart),
      ),
    };
  }
};

const generateFeatures = (featuresWithProvider, geometry, productIds) => {
  if (isAirbus(featuresWithProvider.provider)) {
    return featuresWithProvider.features.map((feature) => (
      <AirbusFeatureInfo
        geometry={geometry}
        key={feature.properties.id}
        feature={feature}
        isDisabled={productIds.find((id) => id === feature.properties.id)}
      />
    ));
  } else if (featuresWithProvider.provider === 'PLANET') {
    return featuresWithProvider.features.map((feature) => (
      <PlanetFeatureInfo
        geometry={geometry}
        key={feature.id}
        feature={feature}
        isDisabled={productIds.find((id) => id === feature.id)}
      />
    ));
  } else if (featuresWithProvider.provider === 'MAXAR') {
    return featuresWithProvider.features.map((feature) => (
      <MaxarFeatureInfo
        key={feature.catalogID}
        feature={feature}
        isDisabled={productIds.find((id) => id === feature.catalogID)}
        geometry={geometry}
      />
    ));
  }
};

const SearchResultsContainer = ({ featuresWithProvider, geometry, products }) => {
  const productIds = products.map((prod) => prod.id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 className="heading-secondary">Search Results (Products Found)</h2>
      <div className="form" style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        {featuresWithProvider.features.length > 0 ? (
          generateFeatures(sortTpdiFeatures(featuresWithProvider), geometry, productIds)
        ) : (
          <p className="text">No results found</p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  geometry: state.map.wgs84Geometry,
  products: state.tpdi.products,
});

export default connect(mapStateToProps)(SearchResultsContainer);
