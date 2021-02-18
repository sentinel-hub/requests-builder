import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import store from '../../store';
import tpdiSlice from '../../store/tpdi';
import { S1GRD_CATALOG_ID, S2L2A_CATALOG_ID, S2L1C_CATALOG_ID } from './const';
import { focusMap } from '../common/Map/utils/crsTransform';

const filterResults = (features, filterText) => {
  if (filterText === '') {
    return features;
  }
  return features.filter((feature) => feature.id.toLowerCase().includes(filterText.toLowerCase()));
};

const CatalogResults = ({ results }) => {
  const [filterText, setFilterText] = useState('');
  const [filteredResults, setFilteredResults] = useState(results.results);
  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    setFilteredResults(filterResults(results.results, filterText));
  }, [results, filterText]);
  return (
    <>
      <h2 className="heading-secondary">Catalog Results</h2>
      <div className="form">
        <label htmlFor="catalog-search" className="form__label">
          Search Features
        </label>
        <input
          id="catalog-search"
          placeholder="Search features by id"
          onChange={handleFilterTextChange}
          type="text"
          className="form__input"
        />
        {filteredResults.length > 0 ? (
          renderFeatureByType({ ...results, results: filteredResults })
        ) : (
          <p className="text">No results</p>
        )}
      </div>
    </>
  );
};

// CommonWrapper is used to pass isExpanded and setIsExpanded as props.
const CommonWrapper = ({ feature, FeatureComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <FeatureComponent feature={feature} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
    </>
  );
};

const renderFeatureByType = (results) => {
  if (results.type === S1GRD_CATALOG_ID) {
    return results.results.map((feature, idx) => {
      if (!feature.id) {
        return <CommonWrapper FeatureComponent={S1FeatureInfo} key={idx} feature={feature} />;
      }
      return <CommonWrapper FeatureComponent={S1FeatureInfo} key={feature.id} feature={feature} />;
    });
  } else if (results.type === S2L2A_CATALOG_ID || results.type === S2L1C_CATALOG_ID) {
    return results.results.map((feature, idx) => {
      if (!feature.id) {
        return <CommonWrapper FeatureComponent={S2FeatureInfo} key={idx} feature={feature} />;
      }
      return <CommonWrapper FeatureComponent={S2FeatureInfo} key={feature.id} feature={feature} />;
    });
  } else {
    return results.results.map((feature, idx) => {
      if (!feature.id) {
        return <CommonWrapper FeatureComponent={CommonFeatureInfo} key={idx} feature={feature} />;
      }
      return <CommonWrapper FeatureComponent={CommonFeatureInfo} key={feature.id} feature={feature} />;
    });
  }
};

const CommonFeatureInfo = ({ feature, isExpanded, setIsExpanded }) => {
  const showBbox = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(feature.bbox));
    focusMap();
  };

  const showGeometry = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(feature.geometry));
    focusMap();
  };

  const handleExpandResult = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p className="catalog-feature-title" onClick={handleExpandResult}>
          {feature.id ? feature.id : 'Catalog Result'}
        </p>
        <FontAwesomeIcon icon={isExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
      </div>
      {isExpanded ? (
        <div className="catalog-feature-info">
          {feature.stac_version ? (
            <p className="text">
              <span>Stac Version: </span> {feature.stac_version}
            </p>
          ) : null}

          {feature.bbox ? (
            <div className="label-checkbox">
              <p className="text">
                <span>Bbox: </span>
              </p>
              <FontAwesomeIcon className="map-button" onClick={showBbox} icon={faMapMarkedAlt} />
            </div>
          ) : null}

          {feature.geometry ? (
            <div className="label-checkbox">
              <p className="text">
                <span>Geometry: </span>
              </p>
              <FontAwesomeIcon className="map-button" onClick={showGeometry} icon={faMapMarkedAlt} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const iterateProperties = (ppties, skip = []) => {
  let jsx = [];
  for (let key of Object.keys(ppties)) {
    if (skip.find((el) => el === key)) {
      continue;
    }
    if (typeof ppties[key] === 'string' || typeof ppties[key] === 'number') {
      jsx.push(
        <p key={key} className="text">
          <span>{capitalize(key)}:</span>
          {ppties[key]}
        </p>,
      );
    }
  }
  return jsx;
};

const S1FeatureInfo = ({ feature, isExpanded, setIsExpanded }) => {
  const { properties } = feature;
  return (
    <>
      <CommonFeatureInfo isExpanded={isExpanded} setIsExpanded={setIsExpanded} feature={feature} />
      <div className="catalog-feature-info">
        {isExpanded && feature.properties ? <>{iterateProperties(properties)}</> : null}
      </div>
    </>
  );
};

const S2FeatureInfo = ({ feature, isExpanded, setIsExpanded }) => {
  const { properties } = feature;
  return (
    <>
      <CommonFeatureInfo isExpanded={isExpanded} setIsExpanded={setIsExpanded} feature={feature} />
      <div className="catalog-feature-info">
        {isExpanded && feature.properties ? <>{iterateProperties(properties, ['eo:bands'])}</> : null}
      </div>
    </>
  );
};

export default CatalogResults;