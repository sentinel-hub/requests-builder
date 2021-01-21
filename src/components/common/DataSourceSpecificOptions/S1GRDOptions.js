import React from 'react';
import store, { requestSlice } from '../../../store';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import { connect } from 'react-redux';

const getOrthorectifyValue = (orthorectify, demInstance) => {
  if (!Boolean(orthorectify)) {
    return false;
  }
  return demInstance;
};

const S1GRDOptions = ({
  reduxResolution,
  reduxAcquisitionMode,
  reduxPolarization,
  reduxOrbitDirection,
  reduxBackCoeff,
  reduxOrthorectify,
  reduxTimeliness,
  reduxDemInstance,
  idx,
}) => {
  const handleResolutionChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ resolution: e.target.value, idx: idx }));
  };

  const handleAqcuisitionModeChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ acquisitionMode: e.target.value, idx: idx }));
  };

  const handlePolarizationChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ polarization: e.target.value, idx: idx }));
  };

  const handleOrbitDirectionChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ orbitDirection: e.target.value, idx: idx }));
  };

  const handleBackCoeffChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ backCoeff: e.target.value, idx: idx }));
  };

  const handleTimelinessChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ timeliness: e.target.value, idx: idx }));
  };

  const handleOrthorectifyChange = (e) => {
    const orthorectify = Boolean(e.target.value);
    store.dispatch(requestSlice.actions.setProcessingOptions({ orthorectify: orthorectify, idx: idx }));
    if (orthorectify) {
      store.dispatch(requestSlice.actions.setDataFilterOptions({ demInstance: e.target.value, idx: idx }));
    } else {
      store.dispatch(requestSlice.actions.setDataFilterOptions({ demInstance: 'DEFAULT', idx: idx }));
    }
  };

  return (
    <div>
      <BaseOptionsNoCC idx={idx} />
      <label htmlFor={`s1-resolution-${idx}`} className="form__label u-margin-top-tiny">
        Resolution
      </label>
      <select
        id={`s1-resolution-${idx}`}
        onChange={handleResolutionChange}
        value={reduxResolution}
        className="form__input"
      >
        <option value="DEFAULT">Default</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
      </select>
      <label htmlFor={`acquisition-mode-${idx}`} className="form__label">
        Acquisition Mode
      </label>
      <select
        id={`acquisition-mode-${idx}`}
        onChange={handleAqcuisitionModeChange}
        value={reduxAcquisitionMode}
        className="form__input"
      >
        <option value="DEFAULT">Default (any)</option>
        <option value="SM">SM</option>
        <option value="IW">IW</option>
        <option value="EW">EW</option>
        <option value="WV">WV</option>
      </select>
      <label htmlFor={`polarization-${idx}`} className="form__label">
        Polarization
      </label>
      <select
        id={`polarization-${idx}`}
        onChange={handlePolarizationChange}
        value={reduxPolarization}
        className="form__input"
      >
        <option value="DEFAULT">Default (any)</option>
        <option value="SH">SH</option>
        <option value="SV">SV</option>
        <option value="DH">DH</option>
        <option value="DV">DV</option>
        <option value="HH">HH</option>
        <option value="HV">HV</option>
        <option value="VV">VV</option>
        <option value="VH">VH</option>
      </select>
      <label htmlFor={`orbit-direction-${idx}`} className="form__label">
        Orbit Direction
      </label>
      <select
        id={`orbit-direction-${idx}`}
        onChange={handleOrbitDirectionChange}
        value={reduxOrbitDirection}
        className="form__input"
      >
        <option value="DEFAULT">Default (any)</option>
        <option value="ASCENDING">Ascending</option>
        <option value="DESCENDING">Descending</option>
      </select>
      <label htmlFor={`backscatter-coef-${idx}`} className="form__label">
        Backscatter coefficient
      </label>
      <select
        id={`backscatter-coef-${idx}`}
        onChange={handleBackCoeffChange}
        value={reduxBackCoeff}
        className="form__input"
      >
        <option value="DEFAULT">Default (gamma0)</option>
        <option value="BETA0">beta0</option>
        <option value="SIGMA0_ELLIPSOID">sigma0</option>
        <option value="GAMMA0_ELLIPSOID">gamma0</option>
      </select>
      <label htmlFor={`timeliness-${idx}`} className="form__label">
        Timeliness
      </label>
      <select
        id={`timeliness-${idx}`}
        onChange={handleTimelinessChange}
        value={reduxTimeliness}
        className="form__input"
      >
        <option value="DEFAULT">Default</option>
        <option value="NRT10m">NRT10m</option>
        <option value="NRT1h">NRT1h</option>
        <option value="NRT3h">NRT3h</option>
        <option value="Fast24h">Fast24h</option>
        <option value="Offline">Offline</option>
        <option value="Reprocessing">Reprocessing</option>
        <option value="ArchNormal">ArchNormal</option>
      </select>
      <label htmlFor={`orthorectify-${idx}`} className="form__label">
        Orthorectify
      </label>
      <select
        id={`orthorectify-${idx}`}
        value={getOrthorectifyValue(reduxOrthorectify, reduxDemInstance)}
        onChange={handleOrthorectifyChange}
        className="form__input"
      >
        <option value="">Disabled</option>
        <option value="MAPZEN">Yes - using Mapzen DEM</option>
        <option value="COPERNICUS">Yes - using Copernicus 10m/30m DEM</option>
        <option value="COPERNICUS_30">Yes - using Copernicus 30m DEM</option>
        <option value="COPERNICUS_90">Yes - using Copernicus 90m DEM</option>
      </select>
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxResolution: store.request.dataFilterOptions[ownProps.idx].options.resolution,
  reduxAcquisitionMode: store.request.dataFilterOptions[ownProps.idx].options.acquisitionMode,
  reduxPolarization: store.request.dataFilterOptions[ownProps.idx].options.polarization,
  reduxOrbitDirection: store.request.dataFilterOptions[ownProps.idx].options.orbitDirection,
  reduxBackCoeff: store.request.processingOptions[ownProps.idx].options.backCoeff,
  reduxOrthorectify: store.request.processingOptions[ownProps.idx].options.orthorectify,
  reduxTimeliness: store.request.processingOptions[ownProps.idx].options.timeliness,
  reduxDemInstance: store.request.dataFilterOptions[ownProps.idx].options.demInstance,
});

export default connect(mapStateToProps)(S1GRDOptions);
