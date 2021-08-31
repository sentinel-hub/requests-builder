import React, { useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import requestSlice, { isInvalidDatafusionState } from '../../store/request';
import {
  DATASOURCES,
  S2L2A,
  S2L1C,
  LOTL1,
  LOTL2,
  MODIS,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  S1GRD,
  DEM,
  CUSTOM,
  DATASOURCES_NAMES,
  LTML1,
  LTML2,
  batchDataCollectionNames,
  statisticalDataCollectionNames,
  LETML1,
  LETML2,
  LMSSL1,
} from '../../utils/const/const';
import BasicOptions from './DataSourceSpecificOptions/BasicOptions';
import S2L1COptions from './DataSourceSpecificOptions/S2L1COptions';
import S3SLSTROptions from './DataSourceSpecificOptions/S3SLSTROptions';
import S5PL2Options from './DataSourceSpecificOptions/S5PL2Options';
import S1GRDOptions from './DataSourceSpecificOptions/S1GRDOptions';
import BaseOptionsNoCC from './DataSourceSpecificOptions/BaseOptionsNoCC';
import DEMOptions from './DataSourceSpecificOptions/DEMOptions';
import BYOCOptions from './DataSourceSpecificOptions/BYOCOptions';
import Toggle from './Toggle';
import OverlayButton from './OverlayButton';
import Select from './Select';
import LandsatOptions from './DataSourceSpecificOptions/LandsatOptions';

const getDataCollectionNamesByMode = (appMode) => {
  let filteredDatasourcesKeys = DATASOURCES_NAMES;
  if (appMode === 'BATCH') {
    filteredDatasourcesKeys = batchDataCollectionNames;
  } else if (appMode === 'STATISTICAL') {
    filteredDatasourcesKeys = statisticalDataCollectionNames;
  }
  return filteredDatasourcesKeys;
};

const generateDataCollectionSelectOptions = (appMode) => {
  return getDataCollectionNamesByMode(appMode).map((key) => ({
    value: key,
    name: DATASOURCES[key].selectName ?? key,
  }));
};

//idx is to reference different datasource options (in case of datafusion)
const generateDataCollectionAdvancedOptions = (datasource, idx = 0) => {
  switch (datasource) {
    case S2L2A:
      return <BasicOptions idx={idx} />;
    case S2L1C:
      return <S2L1COptions idx={idx} />;
    case LOTL1:
    case LOTL2:
    case LTML1:
    case LTML2:
    case LETML1:
    case LETML2:
    case LMSSL1:
      return <LandsatOptions idx={idx} dataCollection={datasource} />;
    case MODIS:
      return <BaseOptionsNoCC idx={idx} />;
    case S3OLCI:
      return <BaseOptionsNoCC idx={idx} />;
    case S3SLSTR:
      return <S3SLSTROptions idx={idx} />;
    case S5PL2:
      return <S5PL2Options idx={idx} />;
    case S1GRD:
      return <S1GRDOptions idx={idx} />;
    case DEM:
      return <DEMOptions idx={idx} />;
    case CUSTOM:
      return <BYOCOptions idx={idx} />;
    default:
      return null;
  }
};

const DataSourceSelect = ({ dataCollections, appMode }) => {
  const overlayRef = useRef();
  const isOnDatafusion = useMemo(() => {
    return dataCollections.length > 1;
  }, [dataCollections.length]);

  const handleAddDataCollection = () => {
    store.dispatch(requestSlice.actions.addDataCollection());
  };
  const isInvalidDatafusion = isInvalidDatafusionState({ dataCollections, appMode });
  return (
    <>
      <h2 className="heading-secondary">
        <div className="flex items-center">
          <div className="mr-2">
            Data Collection
            {isInvalidDatafusion && <span className="text-red-600 ml-2"> !</span>}
          </div>
          <OverlayButton elementRef={overlayRef} />
        </div>
      </h2>
      <div className="form" ref={overlayRef} style={{ maxHeight: '730px', overflowY: 'scroll' }}>
        {dataCollections.map((dataCol, idx) => (
          <SingleDataCollection
            key={`data-collection-${idx}`}
            dataCollection={dataCol}
            appMode={appMode}
            isOnDatafusion={isOnDatafusion}
            idx={idx}
          />
        ))}
        <button className="secondary-button w-fit mt-4" onClick={handleAddDataCollection}>
          {!isOnDatafusion ? 'Start Data Fusion request' : 'Add Data Collection'}
        </button>
        {isInvalidDatafusion && (
          <p className="text text--warning mt-3">
            <b>
              WARNING!
              <br />
              Current data fusion request is not valid. <br />
              {appMode} mode does not support cross deployment requests.
            </b>
          </p>
        )}
      </div>
    </>
  );
};

const SingleDataCollection = ({ dataCollection, idx, appMode, isOnDatafusion }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleDataCollectionChange = (val) => {
    store.dispatch(requestSlice.actions.setDataCollection({ idx, dataCollection: val }));
  };
  const handleShowAdvanced = () => {
    setShowAdvanced((prev) => !prev);
  };
  const handleReset = () => {
    store.dispatch(requestSlice.actions.resetAdvancedOptions({ idx }));
    setShowAdvanced(false);
  };
  const { type } = dataCollection;

  const handleRemoveDataCollection = () => {
    store.dispatch(requestSlice.actions.removeDataCollection({ idx }));
  };
  const handleDataCollectionIdChange = (e) => {
    store.dispatch(requestSlice.actions.setDataCollectionId({ idx, id: e.target.value }));
  };
  return (
    <>
      {isOnDatafusion && (
        <label className="form__label" htmlFor={`data-collection-${idx}`}>
          Data Collection {idx + 1}
        </label>
      )}
      <Select
        options={generateDataCollectionSelectOptions(appMode)}
        selected={type}
        onChange={handleDataCollectionChange}
        buttonClassNames="mb-2"
      />
      {isOnDatafusion && (
        <>
          <label className="form__label" htmlFor={`data-collection-id-${idx}`}>
            Identifier
          </label>
          <input
            className="form__input"
            type="text"
            value={dataCollection.id}
            onChange={handleDataCollectionIdChange}
            id={`data-collection-id-${idx}`}
            placeholder="Identifier"
          />
        </>
      )}

      {type !== CUSTOM && (
        <div className="flex items-center mb-2">
          <label htmlFor={`advanced-options-${idx}`} className="form__label cursor-pointer mr-2 my-1">
            {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
          </label>
          <Toggle id={`advanced-options-${idx}`} onChange={handleShowAdvanced} checked={showAdvanced} />
        </div>
      )}

      {type === CUSTOM ? (
        <div className="pl-3 mb-2">{generateDataCollectionAdvancedOptions(type, idx)}</div>
      ) : (
        showAdvanced && (
          <div className="pl-3 mb-2">
            {generateDataCollectionAdvancedOptions(type, idx)}
            <button onClick={handleReset} className="secondary-button w-fit mr-2 mb-2">
              Reset to default
            </button>
          </div>
        )
      )}

      {idx > 0 && (
        <>
          <button
            className="secondary-button w-fit secondary-button--cancel"
            onClick={handleRemoveDataCollection}
          >
            Remove Data Collection
          </button>
        </>
      )}

      {isOnDatafusion && <hr className="my-2 border-2 border-primary-dark" />}
    </>
  );
};

const mapStateToProps = (store) => ({
  dataCollections: store.request.dataCollections,
  appMode: store.request.mode,
});

export default connect(mapStateToProps, null)(DataSourceSelect);
