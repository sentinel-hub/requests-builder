import React, { useState } from 'react';
import store, { tpdiSlice } from '../../store';
import { focusMap } from '../common/Map/utils/crsTransform';
import { getFormattedDatetime } from './utils';

const AirbusFeatureInfo = ({ feature }) => {
  const [expandedInfo, setExpandedInfo] = useState(false);

  const handleParseGeometryToMap = () => {
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(feature.geometry));
    focusMap();
  };

  const handleAddToOrder = () => {
    store.dispatch(tpdiSlice.actions.addProduct(feature.properties.id));
  };

  const handleSetExpandedInfo = () => {
    setExpandedInfo(!expandedInfo);
  };

  return (
    <div className="tpdi-feature">
      <div className="tpdi-feature-title">
        <label onClick={handleSetExpandedInfo} className="form__label">
          {getFormattedDatetime(feature.properties.acquisitionDate)}{' '}
          {expandedInfo ? String.fromCharCode(0x25b2) : String.fromCharCode(0x25bc)}
        </label>
        <button className="secondary-button" onClick={handleParseGeometryToMap}>
          See on Map
        </button>
      </div>
      {expandedInfo ? (
        <div className="tpdi-feature-extra-info u-margin-bottom-tiny">
          <p className="text">
            <span>Product Id:</span>
            {feature.properties.id}
          </p>
          <p className="text">
            <span>Acquisition Date: </span>
            {feature.properties.acquisitionDate}
          </p>
          <p className="text">
            <span>Cloud Cover: </span>
            {feature.properties.cloudCover}
          </p>
          <p className="text">
            <span>Snow Cover: </span>
            {feature.properties.snowCover}
          </p>
          <p className="text">
            <span>Constellation: </span>
            {feature.properties.constellation}
          </p>
          <p className="text">
            <span>Resolution: </span>
            {feature.properties.resolution}
          </p>
          <p className="text">
            <span>Incidence Angle: </span>
            {feature.properties.incidenceAngle.toFixed(3)}
          </p>
          <p className="text">
            <span>Processing Level: </span>
            {feature.properties.processingLevel}
          </p>
          <button className="secondary-button" onClick={handleAddToOrder}>
            Add to orders
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AirbusFeatureInfo;
