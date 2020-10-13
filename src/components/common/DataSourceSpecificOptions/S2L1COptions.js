import React from 'react';
import BasicOptions from './BasicOptions';
import store, { requestSlice } from '../../../store';
import { connect } from 'react-redux';

const S2L1COptions = ({ reduxPreviewMode, idx }) => {
  const handlePreviewChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ previewMode: e.target.value, idx: idx }));
  };

  return (
    <div>
      <BasicOptions idx={idx} />
      <label htmlFor={`preview-mode-${idx}`} className="form__label u-margin-top-tiny">
        Preview Mode
      </label>
      <select
        id={`preview-mode-${idx}`}
        className="form__input"
        value={reduxPreviewMode}
        onChange={handlePreviewChange}
      >
        <option value="DEFAULT">Default</option>
        <option value="DETAIL">Detail</option>
        <option value="PREVIEW">Preview</option>
        <option value="EXTENDED_PREVIEW">Extended preview</option>
      </select>
    </div>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxPreviewMode: store.request.dataFilterOptions[ownProps.idx].options.previewMode,
});

export default connect(mapStateToProps)(S2L1COptions);
