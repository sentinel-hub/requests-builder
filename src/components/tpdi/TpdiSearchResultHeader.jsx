import React from 'react';
import { faAngleDoubleDown, faAngleDoubleUp, faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import store from '../../store';
import mapSlice from '../../store/map';
import tpdiSlice from '../../store/tpdi';
import CopyIcon from '../common/CopyIcon';
import { focusMap } from '../common/Map/utils/crsTransform';
import { getFormattedDatetime } from './utils';

export const TpdiSearchResultHeader = ({
  id,
  date,
  isDisabled,
  featureGeometry,
  expandedInfo,
  setExpandedInfo,
}) => {
  const handleExpand = () => {
    setExpandedInfo((prev) => !prev);
  };

  const handleAddToOrder = () => {
    store.dispatch(tpdiSlice.actions.addProduct({ id, geometry: featureGeometry }));
    store.dispatch(tpdiSlice.actions.setIsUsingQuery(false));
  };

  const handleParseExtraGeometry = () => {
    store.dispatch(mapSlice.actions.setExtraGeometry(featureGeometry));
    focusMap();
  };
  return (
    <div className="tpdi-feature-title">
      <div
        onClick={handleExpand}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: '2rem',
          cursor: 'pointer',
          width: '55%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p className="text">
            <span>{getFormattedDatetime(date)}</span>
          </p>
          <p className="text">
            <span>ID: </span>
            {id}
            <CopyIcon style={{ marginLeft: '1rem' }} item={id} />
          </p>
        </div>
        {expandedInfo ? (
          <FontAwesomeIcon className="icon" icon={faAngleDoubleUp} />
        ) : (
          <FontAwesomeIcon className="icon" icon={faAngleDoubleDown} />
        )}
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between w-1/2 lg:w-1/3">
        <button
          className={`secondary-button ${isDisabled ? 'secondary-button--disabled' : ''}`}
          onClick={handleAddToOrder}
          disabled={isDisabled}
        >
          {isDisabled ? 'Added to orders' : 'Add to order'}
        </button>
        <button className="secondary-button" onClick={handleParseExtraGeometry}>
          <FontAwesomeIcon icon={faGlobeEurope} />
        </button>
      </div>
    </div>
  );
};

export default TpdiSearchResultHeader;
