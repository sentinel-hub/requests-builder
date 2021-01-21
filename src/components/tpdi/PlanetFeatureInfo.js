import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeEurope, faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import store, { tpdiSlice } from '../../store';
import { formatPercentage } from '../../utils/stringUtils';
import { focusMap, getAreaCoverPercentage } from '../common/Map/utils/crsTransform';
import { getFormattedDatetime } from './utils';
import TPDIThumbnail from './TPDIThumbnail';

const PlanetFeatureInfo = ({ feature, geometry, isDisabled }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);

  const handleParseGeometryToMap = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(feature.geometry));
    focusMap();
  };

  const handleAddToOrder = () => {
    store.dispatch(tpdiSlice.actions.addProduct({ id: feature.id, geometry: feature.geometry }));
  };

  const handleSetExpandedInfo = () => {
    setExpandedInfo(!expandedInfo);
  };

  return (
    <div className="tpdi-feature">
      <div className="tpdi-feature-title">
        <div
          onClick={handleSetExpandedInfo}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: '2rem',
            cursor: 'pointer',
            width: '45%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="text">
              <span>{getFormattedDatetime(feature.properties.acquired)}</span>
            </p>
            <p className="text">
              <span>ID: </span>
              {feature.id}
            </p>
          </div>
          {expandedInfo ? (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleUp} />
          ) : (
            <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} />
          )}
        </div>
        <div className="u-flex-aligned" style={{ justifyContent: 'space-between', width: '40%' }}>
          <button
            disabled={isDisabled}
            onClick={handleAddToOrder}
            className={`secondary-button secondary-button--wrapped ${
              isDisabled ? 'secondary-button--disabled' : ''
            }`}
          >
            {isDisabled ? 'Added to orders' : 'Add to order'}
          </button>
          <button className="secondary-button" onClick={handleParseGeometryToMap}>
            <FontAwesomeIcon icon={faGlobeEurope} />
          </button>
        </div>
      </div>
      {expandedInfo ? (
        <div className="u-flex-aligned">
          <div className="tpdi-feature-extra-info u-margin-bottom-tiny">
            <p className="text">
              <span>Acquisition Date: </span>
              {feature.properties.acquired}
            </p>
            <p className="text">
              <span>Product geometry coverage: </span>
              {formatPercentage(getAreaCoverPercentage(geometry, feature.geometry))}
            </p>
            <p className="text">
              <span>Cloud Cover: </span>
              {formatPercentage(feature.properties.cloud_cover)}
            </p>
            <p className="text">
              <span>Snow Cover: </span>
              {feature.properties.snow_ice_percent.toFixed(2) + '%'}
            </p>
            <p className="text">
              <span>Shadow Percent: </span>
              {feature.properties.shadow_percent.toFixed(2) + '%'}
            </p>
            <p className="text">
              <span>Pixel Resolution: </span>
              {feature.properties.pixel_resolution}
            </p>
          </div>
          <TPDIThumbnail collectionId="PLANET_SCOPE" productId={feature.id} />
        </div>
      ) : null}
      <hr />
    </div>
  );
};

export default PlanetFeatureInfo;
