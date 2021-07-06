import React from 'react';
import BasicOptions from './BasicOptions';
import store from '../../../store';
import requestSlice from '../../../store/request';
import { connect } from 'react-redux';
import Select from '../Select';

const S3SLSTROptions = ({ reduxOrbitDirection, reduxView, idx }) => {
  const handleOrbitDirectionChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ orbitDirection: value, idx: idx }));
  };

  const handleViewChange = (value) => {
    store.dispatch(requestSlice.actions.setProcessingOptions({ view: value, idx: idx }));
  };

  return (
    <>
      <BasicOptions idx={idx} />
      <Select
        label="Orbit Direction"
        buttonClassNames="mb-2"
        selected={reduxOrbitDirection}
        onChange={handleOrbitDirectionChange}
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'ASCENDING', name: 'Ascending' },
          { value: 'DESCENDING', name: 'Descending' },
        ]}
      />
      <Select
        label="View"
        selected={reduxView}
        onChange={handleViewChange}
        options={[
          { value: 'DEFAULT', name: 'Default' },
          { value: 'NADIR', name: 'Nadir' },
          { value: 'OBLIQUE', name: 'Oblique' },
        ]}
      />
    </>
  );
};

const mapStateToProps = (store, ownProps) => ({
  reduxOrbitDirection: store.request.dataFilterOptions[ownProps.idx].options.orbitDirection,
  reduxView: store.request.processingOptions[ownProps.idx].options.view,
});

export default connect(mapStateToProps)(S3SLSTROptions);
