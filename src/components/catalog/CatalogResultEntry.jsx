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
import { focusMap } from '../common/Map/utils/geoUtils';
import requestSlice from '../../store/request';
import { addSuccessAlert, addWarningAlert } from '../../store/alert';
import CopyIcon from '../common/CopyIcon';
import DisplayableProperties from '../common/DisplayableProperties';
import { CUSTOM, DATASOURCES_NAMES } from '../../utils/const/const';

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
      let dataCollection = DATASOURCES_NAMES.find((dc) => dc === usedCollection);
      if (!dataCollection) {
        dataCollection = CUSTOM;
        const [type, ...collection] = usedCollection.split('-');
        store.dispatch(requestSlice.actions.setByocCollectionId({ idx: 0, id: collection.join('-') }));
        store.dispatch(requestSlice.actions.setByocCollectionType({ idx: 0, type: type.toUpperCase() }));
      }
      store.dispatch(requestSlice.actions.setDataCollection({ dataCollection: dataCollection, idx: 0 }));
      addSuccessAlert('Request parsed successfully!\nRemember to set the evalscript.');
    } catch (err) {
      addWarningAlert('Something went wrong, check the console for more details');
      console.error(err);
    }
  };
  return (
    <>
      <div className="flex items-center mb-3">
        <p
          className="text-md font-bold px-2 cursor-pointer mr-2 overflow-wr w-11/12"
          style={{ overflowWrap: 'break-word' }}
          onClick={handleExpandResult}
        >
          {feature.id ? feature.id : 'Catalog Result'}
          {feature.id && <CopyIcon item={feature.id} style={{ marginLeft: '1rem' }} />}
        </p>
        <FontAwesomeIcon icon={isExpanded ? faAngleDoubleUp : faAngleDoubleDown} />
      </div>
      {isExpanded ? (
        <div className="ml-4">
          {feature.stac_version ? (
            <p className="text">
              <span>Stac Version: </span> {feature.stac_version}
            </p>
          ) : null}

          <DisplayableProperties properties={feature.properties} skippedProperties={skippedProperties} />

          <div className="grid grid-cols-2 w-full gap-2 my-3">
            <button
              className="secondary-button w-fit wrapped"
              onClick={copyFeature}
              title="Copy JSON feature on clipboard"
            >
              <FontAwesomeIcon className="text mr-2" icon={faCopy} />
              Copy JSON
            </button>
            {feature.bbox ? (
              <div>
                <button
                  className="secondary-button w-fit wrapped border-r-2 border-black"
                  onClick={showBbox}
                  title="Display BBox on the map"
                >
                  <FontAwesomeIcon className="text mr-2" icon={faMapMarkedAlt} />
                  Bbox
                </button>
                <button className="secondary-button w-fit wrapped" title="Copy Bbox on clipboard">
                  <FontAwesomeIcon className="text" onClick={copyBbox} icon={faCopy} />
                </button>
              </div>
            ) : null}

            {feature.geometry ? (
              <div>
                <button
                  className="secondary-button w-fit wrapped border-r-2 border-black"
                  onClick={showGeometry}
                  title="Display geometry on the map"
                >
                  <FontAwesomeIcon className="text" style={{ marginRight: '1rem' }} icon={faMapMarkedAlt} />
                  Geometry
                </button>
                <button className="secondary-button w-fit wrapped" title="Copy geometry on clipboard">
                  <FontAwesomeIcon onClick={copyGeometry} icon={faCopy} className="text" />
                </button>
              </div>
            ) : null}

            {canDoProcessRequest && (
              <button
                className="secondary-button w-fit wrapped"
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
