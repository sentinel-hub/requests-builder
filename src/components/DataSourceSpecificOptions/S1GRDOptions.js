import React from 'react';
import store, { requestSlice } from '../../store';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import { connect } from 'react-redux';

const S1GRDOptions = ({
  reduxResolution,
  reduxAcquisitionMode,
  reduxPolarization,
  reduxOrbitDirection,
  reduxBackCoeff,
  reduxOrthorectify,
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

  const handleOrthorectifyChange = () => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ orthorectify: !reduxOrthorectify, idx: idx }));
  };

  return (
    <div>
      <BaseOptionsNoCC idx={idx} />
      <label className="form__label u-margin-top-tiny">Resolution</label>
      <select onChange={handleResolutionChange} value={reduxResolution} className="form__input">
        <option value="DEFAULT">Default</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
      </select>
      <label className="form__label">Acquisition Mode</label>
      <select onChange={handleAqcuisitionModeChange} value={reduxAcquisitionMode} className="form__input">
        <option value="DEFAULT">Default (any)</option>
        <option value="SM">SM</option>
        <option value="IW">IW</option>
        <option value="EW">EW</option>
        <option value="WV">WV</option>
      </select>
      <label className="form__label">Polarization</label>
      <select onChange={handlePolarizationChange} value={reduxPolarization} className="form__input">
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
      <label className="form__label">Orbit Direction</label>
      <select onChange={handleOrbitDirectionChange} value={reduxOrbitDirection} className="form__input">
        <option value="DEFAULT">Default (any)</option>
        <option value="ASCENDING">Ascending</option>
        <option value="DESCENDING">Descending</option>
      </select>
      <label className="form__label">Backscatter coefficient</label>
      <select onChange={handleBackCoeffChange} value={reduxBackCoeff} className="form__input">
        <option value="DEFAULT">Default (gamma0)</option>
        <option value="BETA0">beta0</option>
        <option value="SIGMA0_ELLIPSOID">sigma0</option>
        <option value="GAMMA0_ELLIPSOID">gamma0</option>
      </select>
      <div>
        <label style={{ display: 'inline-block' }} className="form__label">
          Orthorectify
        </label>
        <input
          style={{ display: 'inline-block', marginLeft: '1rem' }}
          type="checkbox"
          className="form__input"
          checked={Boolean(reduxOrthorectify)}
          onChange={handleOrthorectifyChange}
        />
      </div>
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
});

export default connect(mapStateToProps)(S1GRDOptions);
