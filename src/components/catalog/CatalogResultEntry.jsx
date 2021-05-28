import React, { useState } from 'react';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faCopy,
  faMapMarkedAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import store from '../../store';
import mapSlice from '../../store/map';
import { focusMap } from '../common/Map/utils/crsTransform';
import requestSlice from '../../store/request';
import { addSuccessAlert, addWarningAlert } from '../../store/alert';
import { collectionToDatasource } from './const';
import CopyIcon from '../common/CopyIcon';
import DisplayableProperties from '../common/DisplayableProperties';
import { CUSTOM } from '../../utils/const';

const CatalogResultEntry = ({ feature, usedCollection, skippedProperties = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const showBbox = () => {
    store.dispatch(mapSlice.actions.setExtraGeometry(feature.bbox));
    focusMap();
  };
  const copyBbox = () => {
    navigator.clipboard.writeText(JSON.stringify(feature.bbox));
  };

  const showGeometry = () => {
    store.dispatch(mapSlice.actions.setExtraGeometry(feature.geometry));
    focusMap();
  };

  const copyGeometry = () => {
    navigator.clipboard.writeText(JSON.stringify(feature.geometry));
  };
  const copyFeature = () => {
    navigator.clipboard.writeText(JSON.stringify(feature, null, 2));
  };

  const handleExpandResult = () => {
    setIsExpanded(!isExpanded);
  };

  const canDoProcessRequest = Boolean(feature.geometry);
  const handleParseToProcess = () => {
    try {
      store.dispatch(requestSlice.actions.resetState({ resetMode: true }));
      store.dispatch(mapSlice.actions.setWgs84Geometry(feature.geometry));
      const hasTime = Boolean(feature.properties?.datetime);
      if (hasTime) {
        const timeFrom = feature.properties.datetime;
        const timeTo = moment.utc(timeFrom).add(1, 'second').format();
        store.dispatch(requestSlice.actions.setTimeRanges([{ timeFrom, timeTo }]));
      } else {
        store.dispatch(requestSlice.actions.disableTimerange(true));
      }
      let datasource = collectionToDatasource[usedCollection];
      if (!datasource) {
        datasource = CUSTOM;
        const [type, ...collection] = usedCollection.split('-');
        store.dispatch(requestSlice.actions.setByocCollectionId(collection.join('-')));
        store.dispatch(requestSlice.actions.setByocCollectionType(type.toUpperCase()));
      }
      store.dispatch(requestSlice.actions.setDatasource(datasource));
      addSuccessAlert('Request parsed successfully!\nRemember to set the evalscript.');
    } catch (err) {
      addWarningAlert('Something went wrong, check the console for more details');
      console.error(err);
    }
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p className="catalog-feature-title" onClick={handleExpandResult}>
          {feature.id ? feature.id : 'Catalog Result'}
          {feature.id && <CopyIcon item={feature.id} style={{ marginLeft: '1rem' }} />}
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

          <DisplayableProperties properties={feature.properties} skippedProperties={skippedProperties} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              width: '100%',
              columnGap: '1rem',
              marginRight: '1rem',
            }}
          >
            <button
              className="secondary-button secondary-button--fit secondary-button--wrapped"
              onClick={copyFeature}
              title="Copy JSON feature on clipboard"
            >
              <FontAwesomeIcon className="text" style={{ marginRight: '1rem' }} icon={faCopy} />
              Copy JSON
            </button>
            {feature.bbox ? (
              <div>
                <button
                  className="secondary-button secondary-button--fit secondary-button--wrapped"
                  style={{ borderRight: '1px dotted black' }}
                  onClick={showBbox}
                  title="Display BBox on the map"
                >
                  <FontAwesomeIcon className="text" style={{ marginRight: '1rem' }} icon={faMapMarkedAlt} />
                  Bbox
                </button>
                <button
                  className="secondary-button secondary-button--fit secondary-button--wrapped"
                  title="Copy Bbox on clipboard"
                >
                  <FontAwesomeIcon className="text" onClick={copyBbox} icon={faCopy} />
                </button>
              </div>
            ) : null}

            {feature.geometry ? (
              <div>
                <button
                  className="secondary-button secondary-button--fit secondary-button--wrapped"
                  style={{ borderRight: '1px dotted black' }}
                  onClick={showGeometry}
                  title="Display geometry on the map"
                >
                  <FontAwesomeIcon className="text" style={{ marginRight: '1rem' }} icon={faMapMarkedAlt} />
                  Geometry
                </button>
                <button
                  className="secondary-button secondary-button--fit secondary-button--wrapped"
                  title="Copy geometry on clipboard"
                >
                  <FontAwesomeIcon onClick={copyGeometry} icon={faCopy} className="text" />
                </button>
              </div>
            ) : null}

            {canDoProcessRequest && (
              <button
                className="secondary-button secondary-button--fit secondary-button--wrapped"
                onClick={handleParseToProcess}
                title="This will set the appropiate data collection, time-range and geometry."
              >
                <FontAwesomeIcon className="text" style={{ marginRight: '1rem' }} icon={faPaperPlane} />
                Request Feature on Process
              </button>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CatalogResultEntry;
