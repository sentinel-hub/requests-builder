import React, { useState } from 'react';
import { connect } from 'react-redux';
import store, { requestSlice } from '../../store';
import {
  DATASOURCES,
  S2L2A,
  S2L1C,
  L8L1C,
  MODIS,
  S3OLCI,
  S3SLSTR,
  S5PL2,
  S1GRD,
  DEM,
  CUSTOM,
  DATAFUSION,
} from '../../utils/const';
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

export const generateDatasourcesOptions = () =>
  Object.keys(DATASOURCES).map((key) => (
    <option key={key} value={key}>
      {DATASOURCES[key].selectName ?? key}
    </option>
  ));

//idx is to reference different datasource options (in case of datafusion)
export const generateDataSourceRelatedOptions = (datasource, idx = 0) => {
  switch (datasource) {
    case S2L2A:
      return <BasicOptions idx={idx} />;
    case S2L1C:
      return <S2L1COptions idx={idx} />;
    case L8L1C:
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

const DataSourceSelect = ({ datasource }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    store.dispatch(requestSlice.actions.setDatasourceAndEvalscript(e.target.value));
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
      <h2 className="heading-secondary">Data source</h2>
      <div className="form">
        <label htmlFor="datasource-select" className="form__label">
          Datasource
        </label>
        <select
          id="datasource-select"
          value={datasource}
          required
          className="form__input"
          onChange={handleChange}
        >
          {generateDatasourcesOptions()}
        </select>
        {datasource !== 'CUSTOM' && datasource !== 'DATAFUSION' ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="toggle-with-label">
              <label className="form__label" htmlFor="advanced-options">
                {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
              </label>
              <Toggle id="advanced-options" onChange={handleShowAdvanced} checked={showAdvanced} />
            </div>
          </div>
        ) : null}
        {datasource === 'CUSTOM' || datasource === 'DATAFUSION' ? (
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
    </>
  );
};

const mapStateToProps = (store) => ({
  datasource: store.request.datasource,
});

export default connect(mapStateToProps, null)(DataSourceSelect);
