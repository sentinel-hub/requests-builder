import React from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import BaseOptionsNoCC from './BaseOptionsNoCC';
import { connect } from 'react-redux';
import Select from '../Select';

const getOrthorectifyValue = (orthorectify, demInstance) => {
  if (!Boolean(orthorectify)) {
    return '';
  }
  return demInstance !== undefined ? demInstance : 'MAPZEN';
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
  const handleResolutionChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ resolution: value, idx: idx }));
  };

  const handleAqcuisitionModeChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ acquisitionMode: value, idx: idx }));
  };

  const handlePolarizationChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ polarization: value, idx: idx }));
  };

  const handleOrbitDirectionChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ orbitDirection: value, idx: idx }));
  };

  const handleBackCoeffChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ backCoeff: value, idx: idx }));
  };

  const handleTimelinessChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ timeliness: value, idx: idx }));
  };

  const handleOrthorectifyChange = (value) => {
    const orthorectify = Boolean(value);
    store.dispatch(requestSlice.actions.setProcessingOptions({ orthorectify: orthorectify, idx: idx }));
    if (orthorectify) {
      store.dispatch(requestSlice.actions.setProcessingOptions({ demInstance: value, idx: idx }));
    } else {
      store.dispatch(requestSlice.actions.setProcessingOptions({ demInstance: 'DEFAULT', idx: idx }));
    }
  };

  return (
    <>
      <BaseOptionsNoCC idx={idx} />
      <Select
        label="Resolution"
        onChange={handleResolutionChange}
        selected={reduxResolution}
        buttonClassNames="mb-2"
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'HIGH', name: 'High' },
          { value: 'MEDIUM', name: 'Medium' },
        ]}
      />
      <Select
        label="Acquisition Mode"
        onChange={handleAqcuisitionModeChange}
        selected={reduxAcquisitionMode}
        buttonClassNames="mb-2"
        options={[
          { value: 'DEFAULT', name: 'Default(any)' },
          { value: 'SM', name: 'SM' },
          { value: 'IW', name: 'IW' },
          { value: 'EW', name: 'EW' },
          { value: 'WV', name: 'WV' },
        ]}
      />

      <Select
        label="Polarization"
        onChange={handlePolarizationChange}
        selected={reduxPolarization}
        options={[
          { value: 'DEFAULT', name: 'Default (any)' },
          { value: 'SH', name: 'SH' },
          { value: 'SV', name: 'SV' },
          { value: 'DH', name: 'DH' },
          { value: 'DV', name: 'DV' },
          { value: 'HH', name: 'HH' },
          { value: 'HV', name: 'HV' },
          { value: 'VV', name: 'VV' },
          { value: 'VH', name: 'VH' },
        ]}
      />

      <Select
        label="Orbit Direction"
        selected={reduxOrbitDirection}
        buttonClassNames="mb-2"
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'ASCENDING', name: 'Ascending' },
          { value: 'DESCENDING', name: 'Descending' },
        ]}
        onChange={handleOrbitDirectionChange}
      />

      <Select
        label="Backscatter coefficient"
        selected={reduxBackCoeff}
        onChange={handleBackCoeffChange}
        buttonClassNames="mb-2"
        options={[
          { value: 'DEFAULT', name: 'Default (gamma0 ellipsoid)' },
          { value: 'BETA0', name: 'beta0' },
          { value: 'SIGMA0_ELLIPSOID', name: 'sigma0' },
          { value: 'GAMMA0_ELLIPSOID', name: 'gamma0 (ellipsoid)' },
          { value: 'GAMMA0_TERRAIN', name: 'gamma0 (terrain)' },
        ]}
      />

      <Select
        label="Timeliness"
        selected={reduxTimeliness}
        buttonClassNames="mb-2"
        onChange={handleTimelinessChange}
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'NRT10m', name: 'NRT10m' },
          { value: 'NRT1h', name: 'NRT1h' },
          { value: 'NRT3h', name: 'NRT3h' },
          { value: 'Fast24h', name: 'Fast24h' },
          { value: 'Offline', name: 'Offline' },
          { value: 'Reprocessing', name: 'Reprocessing' },
          { value: 'ArchNormal', name: 'ArchNormal' },
        ]}
      />

      <Select
        label="Orthorectify"
        selected={getOrthorectifyValue(reduxOrthorectify, reduxDemInstance)}
        onChange={handleOrthorectifyChange}
        options={[
          { value: '', name: 'Disabled' },
          { value: 'MAPZEN', name: 'Yes - using Mapzen DEM' },
          { value: 'COPERNICUS', name: 'Yes - using Copernicus 10m/30m DEM' },
          { value: 'COPERNICUS_30', name: 'Yes - using Copernicus 30m DEM' },
          { value: 'COPERNICUS_90', name: 'Yes - using Copernicus 90m DEM' },
        ]}
      />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxResolution: store.request.dataFilterOptions[ownProps.idx].options.resolution,
  reduxAcquisitionMode: store.request.dataFilterOptions[ownProps.idx].options.acquisitionMode,
  reduxPolarization: store.request.dataFilterOptions[ownProps.idx].options.polarization,
  reduxOrbitDirection: store.request.dataFilterOptions[ownProps.idx].options.orbitDirection,
  reduxBackCoeff: store.request.processingOptions[ownProps.idx].options.backCoeff,
  reduxOrthorectify: store.request.processingOptions[ownProps.idx].options.orthorectify,
  reduxTimeliness: store.request.dataFilterOptions[ownProps.idx].options.timeliness,
  reduxDemInstance: store.request.processingOptions[ownProps.idx].options.demInstance,
});

export default connect(mapStateToProps)(S1GRDOptions);
