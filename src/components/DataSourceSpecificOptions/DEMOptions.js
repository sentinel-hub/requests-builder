//Common to all datasources
import React from 'react';
import store, { requestSlice } from '../../store';
import { connect } from 'react-redux';

//Contains MosaickingOrder, Upsampling, Downsampling.
const DEMOptions = ({ processingOptions, dataFilterOptions, idx }) => {
  const upsampling = processingOptions.upsampling;
  const downsampling = processingOptions.downsampling;
  const clampNegative = processingOptions.clampNegative;
  const egm = processingOptions.egm;

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

  return (
    <div>
      <label className="form__label">Upsampling</label>
      <select value={upsampling} onChange={handleUpsamplingChange} className="form__input">
        <option value="DEFAULT">Default</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
      <label className="form__label">Downsampling</label>
      <select value={downsampling} onChange={handleDownsamplingChange} className="form__input">
        <option value="DEFAULT">Default</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
      <div>
        <label htmlFor="clampNeg" style={{ display: 'inline-block' }} className="form__label">
          Clamp Negative
        </label>
        <input
          id="clampNeg"
          style={{ display: 'inline-block', marginLeft: '1rem' }}
          type="checkbox"
          className="form__input"
          checked={Boolean(clampNegative)}
          onChange={handleClampChange}
        />
      </div>
      <div>
        <label htmlFor="egm" style={{ display: 'inline-block' }} className="form__label">
          Apply EGM
        </label>
        <input
          id="egm"
          style={{ display: 'inline-block', marginLeft: '1rem' }}
          type="checkbox"
          className="form__input"
          checked={Boolean(egm)}
          onChange={handleEgmChange}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  processingOptions: store.request.processingOptions[ownProps.idx].options,
  dataFilterOptions: store.request.dataFilterOptions[ownProps.idx].options,
});

export default connect(mapStateToProps)(DEMOptions);
