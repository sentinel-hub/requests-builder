import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import requestSlice from '../../store/request';
import {
  DATASOURCES,
  S2L2A,
  S2L1C,
  L8L1C,
  LOTL1,
  LOTL2,
  MODIS,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  S1GRD,
  DEM,
  CUSTOM,
  DATAFUSION,
  DATASOURCES_NAMES,
} from '../../utils/const/const';
import BasicOptions from './DataSourceSpecificOptions/BasicOptions';
import S2L1COptions from './DataSourceSpecificOptions/S2L1COptions';
import S3SLSTROptions from './DataSourceSpecificOptions/S3SLSTROptions';
import S5PL2Options from './DataSourceSpecificOptions/S5PL2Options';
import S1GRDOptions from './DataSourceSpecificOptions/S1GRDOptions';
import BaseOptionsNoCC from './DataSourceSpecificOptions/BaseOptionsNoCC';
import DEMOptions from './DataSourceSpecificOptions/DEMOptions';
import BYOCOptions from './DataSourceSpecificOptions/BYOCOptions';
import DataFusionOptions from './DataSourceSpecificOptions/DataFusionOptions';
import Toggle from './Toggle';
import OverlayButton from './OverlayButton';

export const generateDatasourcesOptions = (appMode) => {
  let filteredDatasourcesKeys = DATASOURCES_NAMES;
  if (appMode === 'BATCH') {
    filteredDatasourcesKeys = DATASOURCES_NAMES.filter((key) => DATASOURCES[key].isBatchSupported);
  } else if (appMode === 'STATISTICAL') {
    filteredDatasourcesKeys = DATASOURCES_NAMES.filter((key) => DATASOURCES[key].isStatApiSupported);
  }
  return filteredDatasourcesKeys.map((key) => (
    <option key={key} value={key}>
      {DATASOURCES[key].selectName ?? key}
    </option>
  ));
};

//idx is to reference different datasource options (in case of datafusion)
export const generateDataSourceRelatedOptions = (datasource, idx = 0) => {
  switch (datasource) {
    case S2L2A:
      return <BasicOptions idx={idx} />;
    case S2L1C:
      return <S2L1COptions idx={idx} />;
    case L8L1C:
    case LOTL1:
    case LOTL2:
      return <BasicOptions idx={idx} />;
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
    case DATAFUSION:
      return <DataFusionOptions idx={idx} />;
    default:
      return '';
  }
};

const DataSourceSelect = ({ datasource, appMode }) => {
  const overlayRef = useRef();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    store.dispatch(requestSlice.actions.setDatasource(e.target.value));
  };

  const handleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleReset = () => {
    store.dispatch(requestSlice.actions.resetAdvancedOptions());
    setShowAdvanced(false);
  };

  return (
    <>
      <h2 className="heading-secondary">
        <div className="u-expand-title">
          Data Collection
          <OverlayButton elementRef={overlayRef} />
        </div>
      </h2>
      <div className="form" ref={overlayRef}>
        <label htmlFor="datasource-select" className="form__label">
          Data Collection
        </label>
        <select
          id="datasource-select"
          value={datasource}
          required
          className="form__input"
          onChange={handleChange}
        >
          {generateDatasourcesOptions(appMode)}
        </select>
        {datasource !== CUSTOM && datasource !== DATAFUSION ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="toggle-with-label">
              <label className="form__label" htmlFor="advanced-options">
                {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
              </label>
              <Toggle id="advanced-options" onChange={handleShowAdvanced} checked={showAdvanced} />
            </div>
          </div>
        ) : null}
        <div style={{ paddingTop: 0 }}>
          {datasource === CUSTOM || datasource === DATAFUSION ? (
            generateDataSourceRelatedOptions(datasource)
          ) : showAdvanced ? (
            <>
              {generateDataSourceRelatedOptions(datasource)}
              <button
                onClick={handleReset}
                className="secondary-button secondary-button--fit u-margin-right-small"
              >
                Reset to default
              </button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  datasource: store.request.datasource,
  appMode: store.request.mode,
});

export default connect(mapStateToProps, null)(DataSourceSelect);
