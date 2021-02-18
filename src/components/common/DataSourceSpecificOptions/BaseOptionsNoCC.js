//Common to all datasources
import React from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';

//Contains MosaickingOrder, Upsampling, Downsampling.
const BaseOptionsNoCC = ({ processingOptions, dataFilterOptions, withCC = false, idx }) => {
  const mosaickingOrder = dataFilterOptions.mosaickingOrder;
  const upsampling = processingOptions.upsampling;
  const downsampling = processingOptions.downsampling;

  const handleMosaickingChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ mosaickingOrder: e.target.value, idx }));
  };

  const handleUpsamplingChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ upsampling: e.target.value, idx }));
  };

  const handleDownsamplingChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ downsampling: e.target.value, idx }));
  };

  return (
    <>
      <label htmlFor={`mosaicking-order-${idx}`} className="form__label">
        Mosaicking Order
      </label>
      <select
        id={`mosaicking-order-${idx}`}
        value={mosaickingOrder}
        className="form__input"
        onChange={handleMosaickingChange}
      >
        <option value="DEFAULT">Default</option>
        <option value="mostRecent">Most recent</option>
        <option value="leastRecent">Least recent</option>
        {withCC ? <option value="leastCC">Least CC</option> : ''}
      </select>
      <label htmlFor={`upsampling-${idx}`} className="form__label">
        Upsampling
      </label>
      <select
        id={`upsampling-${idx}`}
        value={upsampling}
        onChange={handleUpsamplingChange}
        className="form__input"
      >
        <option value="DEFAULT">Default (Nearest)</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
      <label htmlFor={`downsampling-${idx}`} className="form__label">
        Downsampling
      </label>
      <select
        id={`downsampling-${idx}`}
        value={downsampling}
        onChange={handleDownsamplingChange}
        className="form__input"
      >
        <option value="DEFAULT">Default (Nearest)</option>
        <option value="NEAREST">Nearest</option>
        <option value="BILINEAR">Bilinear</option>
        <option value="BICUBIC">Bicubic</option>
      </select>
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  processingOptions: store.request.processingOptions[ownProps.idx].options,
  dataFilterOptions: store.request.dataFilterOptions[ownProps.idx].options,
});

export default connect(mapStateToProps)(BaseOptionsNoCC);
