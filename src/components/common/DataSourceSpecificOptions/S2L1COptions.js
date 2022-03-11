import React from 'react';
import BasicOptions from './BasicOptions';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Select from '../Select';

const S2L1COptions = ({ reduxPreviewMode, idx }) => {
  const handlePreviewChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ previewMode: value, idx: idx }));
  };

  return (
    <>
      <BasicOptions idx={idx} />
      <Select
        label="Preview Mode"
        selected={reduxPreviewMode}
        buttonClassNames="mb-2"
        onChange={handlePreviewChange}
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'DETAIL', name: 'Detail' },
          { value: 'PREVIEW', name: 'Preview' },
          { value: 'EXTENDED_PREVIEW', name: 'Extended preview' },
        ]}
      />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxPreviewMode: store.request.dataFilterOptions[ownProps.idx].options.previewMode,
});

export default connect(mapStateToProps)(S2L1COptions);
