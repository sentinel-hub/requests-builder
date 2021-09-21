import React, { useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import prop from 'lodash.get';

import PlanetFeatureInfo from './PlanetFeatureInfo';
import AirbusFeatureInfo from './AirbusFeatureInfo';
import MaxarFeatureInfo from './MaxarFeatureInfo';
import { isAirbus } from './utils';
import { getAreaCoverPercentage } from '../common/Map/utils/geoUtils';
import { useDebounce, useScrollGenerationContainer } from '../../utils/hooks';

const sortFeaturesByDate = (path, featuresWithProvider) => {
  return {
    ...featuresWithProvider,
    features: featuresWithProvider.features.sort((a, b) =>
      new Date(prop(a, path)) > new Date(prop(b, path)) ? -1 : 1,
    ),
  };
};

const sortFeaturesByCoverage = (featuresWithProviderAndCoverage) => {
  return {
    ...featuresWithProviderAndCoverage,
    features: featuresWithProviderAndCoverage.features.sort((a, b) =>
      a.areaCoverage > b.areaCoverage ? -1 : 1,
    ),
  };
};

const sortTpdiFeatures = (featuresWithProviderAndCoverage, order) => {
  if (order === 'DATE') {
    if (isAirbus(featuresWithProviderAndCoverage.provider)) {
      return sortFeaturesByDate('properties.acquisitionDate', featuresWithProviderAndCoverage);
    } else if (featuresWithProviderAndCoverage.provider === 'PLANET') {
      return sortFeaturesByDate('properties.acquired', featuresWithProviderAndCoverage);
    } else if (featuresWithProviderAndCoverage.provider === 'MAXAR') {
      return sortFeaturesByDate('acquisitionDateStart', featuresWithProviderAndCoverage);
    }
  } else if (order === 'COVERAGE') {
    return sortFeaturesByCoverage(featuresWithProviderAndCoverage);
  }
  return featuresWithProviderAndCoverage;
};

const generateFeatures = (featuresWithProvider) => {
  if (isAirbus(featuresWithProvider.provider)) {
    return featuresWithProvider.features.map((feature) => (
      <AirbusFeatureInfo key={feature.properties.id} feature={feature} />
    ));
  } else if (featuresWithProvider.provider === 'PLANET') {
    return featuresWithProvider.features.map((feature) => (
      <PlanetFeatureInfo key={feature.id} feature={feature} />
    ));
  } else if (featuresWithProvider.provider === 'MAXAR') {
    return featuresWithProvider.features.map((feature) => (
      <MaxarFeatureInfo key={feature.catalogID} feature={feature} />
    ));
  }
  return [];
};

const SearchResultsContainer = ({ featuresWithProvider, geometry }) => {
  const [sortOrder, setSortOrder] = useState('DATE'); // DATE or COVERAGE;
  const [coverageTreshold, setCoverageTreshold] = useState(0);
  const debouncedTreshold = useDebounce(coverageTreshold, 600);
  const featuresWithCoverage = useMemo(() => {
    return {
      ...featuresWithProvider,
      features: featuresWithProvider.features.map((feature) => ({
        ...feature,
        areaCoverage: getAreaCoverPercentage(geometry, feature.geometry),
      })),
    };
  }, [geometry, featuresWithProvider]);

  const filteredFeatures = useMemo(() => {
    return {
      ...featuresWithCoverage,
      features: featuresWithCoverage.features.filter(
        (feature) => feature.areaCoverage >= debouncedTreshold / 100,
      ),
    };
  }, [featuresWithCoverage, debouncedTreshold]);

  const sortedFeatures = useMemo(() => {
    const features = sortTpdiFeatures(filteredFeatures, sortOrder);
    return features;
  }, [filteredFeatures, sortOrder]);

  const containerRef = useRef();

  const elements = useMemo(() => {
    return generateFeatures(sortedFeatures);
  }, [sortedFeatures]);

  const feturesByScroll = useScrollGenerationContainer(elements, containerRef);

  const handleCoverageTresholdChange = (e) => {
    setCoverageTreshold(Number(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 className="heading-secondary">Search Results (Products Found)</h2>
      <div className="form" style={{ overflowY: 'scroll', maxHeight: '500px' }} ref={containerRef}>
        {featuresWithProvider.features.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p
                className="cursor-pointer underline italic"
                onClick={() => setSortOrder((prev) => (prev === 'DATE' ? 'COVERAGE' : 'DATE'))}
              >
                {sortOrder === 'DATE' ? 'Sort by area coverage' : 'Sort by date'}
              </p>
              <div className="flex items-center">
                <label className="form__label mr-2" htmlFor="coverage-treshold">
                  Coverage treshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={coverageTreshold}
                  onChange={handleCoverageTresholdChange}
                  id="coverage-treshold"
                  className="mr-2"
                />
                {coverageTreshold + '%'}
              </div>
            </div>
            {feturesByScroll}
          </>
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
