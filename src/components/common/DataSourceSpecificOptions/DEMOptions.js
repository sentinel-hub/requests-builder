//Common to all datasources
import React from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Toggle from '../Toggle';
import { samplingOptions } from './BaseOptionsNoCC';
import Select from '../Select';

const demInstanceOptions = [
  { value: 'DEFAULT', name: 'Default' },
  { value: 'MAPZEN', name: 'Mapzen' },
  { value: 'COPERNICUS_30', name: 'Copernicus 30/90m DEM' },
  { value: 'COPERNICUS_90', name: 'Copernicus 90m DEM' },
];
//Contains MosaickingOrder, Upsampling, Downsampling.
const DEMOptions = ({ processingOptions, dataFilterOptions, idx }) => {
  const upsampling = processingOptions.upsampling;
  const downsampling = processingOptions.downsampling;
  const clampNegative = processingOptions.clampNegative;
  const egm = processingOptions.egm;
  const demInstance = dataFilterOptions.demInstance;

  const handleUpsamplingChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ upsampling: value, idx: idx }));
  };

  const handleDownsamplingChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ downsampling: value, idx: idx }));
  };

  const handleClampChange = () => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ clampNegative: !clampNegative, idx: idx }));
  };

  const handleEgmChange = () => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ egm: !egm, idx: idx }));
  };

  const handleDemInstanceChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ demInstance: value, idx: idx }));
  };
  return (
    <>
      <Select
        label="Upsampling"
        onChange={handleUpsamplingChange}
        selected={upsampling}
        options={samplingOptions}
        buttonClassNames="mb-2"
      />
      <Select
        label="Upsampling"
        onChange={handleDownsamplingChange}
        selected={downsampling}
        options={samplingOptions}
        buttonClassNames="mb-2"
      />
      <div className="flex items-center mb-2">
        <label htmlFor={`clampNeg-${idx}`} className="form__label cursor-pointer mr-2">
          Clamp Negative
        </label>
        <Toggle id={`clampNeg-${idx}`} checked={Boolean(clampNegative)} onChange={handleClampChange} />
      </div>
      <div className="flex items-center mb-2">
        <label htmlFor={`egm-${idx}`} className="form__label cursor-pointer mr-2">
          Apply EGM
        </label>
        <Toggle id={`egm-${idx}`} checked={Boolean(egm)} onChange={handleEgmChange} />
      </div>
      <Select
        label="Dem Instance"
        buttonClassNames="mb-2"
        options={demInstanceOptions}
        selected={demInstance}
        onChange={handleDemInstanceChange}
      />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  processingOptions: store.request.processingOptions[ownProps.idx].options,
  dataFilterOptions: store.request.dataFilterOptions[ownProps.idx].options,
});

export default connect(mapStateToProps)(DEMOptions);
