import React from 'react';
import { connect } from 'react-redux';
import OutputDimensions from './OutputDimensions';
import OutputResponses from './OutputResponses';

const Output = ({ mode, ogcMode }) => {
  if (mode === 'WMS' && ogcMode === 'FIS') {
    return null;
  }

  return (
    <>
      <h2 className="heading-secondary">Output</h2>
      <div className="form">
        <OutputDimensions />
        <OutputResponses />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  mode: state.request.mode,
  ogcMode: state.wms.mode,
});
export default connect(mapStateToProps)(Output);
