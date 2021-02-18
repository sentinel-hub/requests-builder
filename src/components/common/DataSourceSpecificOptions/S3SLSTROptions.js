import React from 'react';
import BasicOptions from './BasicOptions';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';

const S3SLSTROptions = ({ reduxOrbitDirection, reduxView, idx }) => {
  const handleOrbitDirectionChange = (e) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ orbitDirection: e.target.value, idx: idx }));
  };

  const handleViewChange = (e) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ view: e.target.value, idx: idx }));
  };

  return (
    <>
      <BasicOptions idx={idx} />
      <label htmlFor={`orbit-direction-${idx}`} className="form__label u-margin-top-tiny">
        Orbit Direction
      </label>
      <select
        id={`orbit-direction-${idx}`}
        className="form__input"
        value={reduxOrbitDirection}
        onChange={handleOrbitDirectionChange}
      >
        <option value="DEFAULT">Default</option>
        <option value="ASCENDING">Ascending</option>
        <option value="DESCENDING">Descending</option>
      </select>
      <label htmlFor={`slstr-view-${idx}`} className="form__label">
        View
      </label>
      <select id={`slstr-view-${idx}`} className="form__input" value={reduxView} onChange={handleViewChange}>
        <option value="DEFAULT">Default</option>
        <option value="NADIR">Nadir</option>
        <option value="OBLIQUE">Oblique</option>
      </select>
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxOrbitDirection: store.request.dataFilterOptions[ownProps.idx].options.orbitDirection,
  reduxView: store.request.processingOptions[ownProps.idx].options.view,
});

export default connect(mapStateToProps)(S3SLSTROptions);