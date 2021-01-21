//Common to all datasources
import React from 'react';
import store, { requestSlice } from '../../../store';
import { connect } from 'react-redux';
import Toggle from '../Toggle';

//Contains MosaickingOrder, Upsampling, Downsampling.
const DEMOptions = ({ processingOptions, dataFilterOptions, idx }) => {
  const upsampling = processingOptions.upsampling;
  const downsampling = processingOptions.downsampling;
  const clampNegative = processingOptions.clampNegative;
  const egm = processingOptions.egm;
  const demInstance = dataFilterOptions.demInstance;

  const handleUpsamplingChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ upsampling: e.target.value, idx: idx }));
  };

  const handleDownsamplingChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ downsampling: e.target.value, idx: idx }));
  };

  const handleClampChange = () => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ clampNegative: !clampNegative, idx: idx }));
  };

  const handleEgmChange = () => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ egm: !egm, idx: idx }));
  };

  const handleDemInstanceChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ demInstance: e.target.value, idx: idx }));
  };
  return (
    <div>
      <label htmlFor={`dem-upsampling-${idx}`} className="form__label">
        Upsampling
      </label>
      <select
        id={`dem-upsampling-${idx}`}
        value={upsampling}
        onChange={handleUpsamplingChange}
        className="form__input"
      >
        <option value="DEFAULT">Default</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
      <label htmlFor={`dem-downsampling-${idx}`} className="form__label">
        Downsampling
      </label>
      <select
        id={`dem-downsampling-${idx}`}
        value={downsampling}
        onChange={handleDownsamplingChange}
        className="form__input"
      >
        <option value="DEFAULT">Default</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
      <div className="toggle-with-label">
        <label htmlFor={`clampNeg-${idx}`} className="form__label">
          Clamp Negative
        </label>
        <Toggle id={`clampNeg-${idx}`} checked={Boolean(clampNegative)} onChange={handleClampChange} />
      </div>
      <div className="toggle-with-label">
        <label htmlFor={`egm-${idx}`} className="form__label">
          Apply EGM
        </label>
        <Toggle id={`egm-${idx}`} checked={Boolean(egm)} onChange={handleEgmChange} />
      </div>

      <label htmlFor={`demInstance-${idx}`} className="form__label">
        Dem Instance
      </label>
      <select
        id={`demInstance-${idx}`}
        value={demInstance}
        className="form__input"
        onChange={handleDemInstanceChange}
      >
        <option value="DEFAULT">Default</option>
        <option value="MAPZEN">Mapzen DEM</option>
        <option value="COPERNICUS_30">Copernicus 30/90m DEM</option>
        <option value="COPERNICUS_90">Copernicus 90m DEM</option>
      </select>
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  processingOptions: store.request.processingOptions[ownProps.idx].options,
  dataFilterOptions: store.request.dataFilterOptions[ownProps.idx].options,
});

export default connect(mapStateToProps)(DEMOptions);
