//Common to all datasources
import React from 'react';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Select from '../Select';

const baseMosaickingOptions = [
  { value: 'DEFAULT', name: 'Default' },
  { value: 'mostRecent', name: 'Most recent' },
  { value: 'leastRecent', name: 'Least Recent' },
];

const mosaickingOptions = (withCC) => {
  if (withCC) {
    return [...baseMosaickingOptions, { value: 'leastCC', name: 'Least CC' }];
  }
  return baseMosaickingOptions;
};

export const samplingOptions = [
  { value: 'DEFAULT', name: 'Default (nearest)' },
  { value: 'NEAREST', name: 'Nearest' },
  { value: 'BILINEAR', name: 'Bilinear' },
  { value: 'BICUBIC', name: 'Bicubic' },
];

//Contains MosaickingOrder, Upsampling, Downsampling.
const BaseOptionsNoCC = ({ processingOptions, dataFilterOptions, withCC = false, idx }) => {
  const mosaickingOrder = dataFilterOptions.mosaickingOrder;
  const upsampling = processingOptions.upsampling;
  const downsampling = processingOptions.downsampling;
  const handleMosaickingChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ mosaickingOrder: value, idx }));
  };

  const handleUpsamplingChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ upsampling: value, idx }));
  };

  const handleDownsamplingChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ downsampling: value, idx }));
  };

  return (
    <>
      <Select
        label="Mosaicking Order"
        buttonClassNames="mb-2"
        onChange={handleMosaickingChange}
        selected={mosaickingOrder}
        options={mosaickingOptions(withCC)}
      />
      <Select
        label="Upsampling"
        onChange={handleUpsamplingChange}
        selected={upsampling}
        buttonClassNames="mb-2"
        options={samplingOptions}
      />
      <Select
        label="Downsampling"
        onChange={handleDownsamplingChange}
        selected={downsampling}
        buttonClassNames="mb-2"
        options={samplingOptions}
      />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  processingOptions: store.request.processingOptions[ownProps.idx].options,
  dataFilterOptions: store.request.dataFilterOptions[ownProps.idx].options,
});

export default connect(mapStateToProps)(BaseOptionsNoCC);
