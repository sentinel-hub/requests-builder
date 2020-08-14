import React from 'react';
import { connect } from 'react-redux';
import store, { requestSlice } from '../store';

const ModeSelector = ({ mode }) => {
  const handleModeChange = (e) => {
    store.dispatch(requestSlice.actions.setMode(e.target.value));
  };

  return (
    <div>
      <h2 className="heading-secondary u-margin-bottom-small">Mode</h2>
      <div className="mode-selector">
        <input
          className="mode-selector mode-selector--input"
          checked={mode === 'PROCESS'}
          onChange={handleModeChange}
          type="radio"
          id="process"
          value="PROCESS"
        />
        <label className="mode-selector mode-selector--label" htmlFor="process">
          PROCESS
        </label>

        <input
          className="mode-selector mode-selector--input"
          checked={mode === 'BATCH'}
          onChange={handleModeChange}
          type="radio"
          id="batch"
          value="BATCH"
        />
        <label className="mode-selector mode-selector--label" htmlFor="batch">
          BATCH
        </label>

        <input
          className="mode-selector mode-selector--input"
          checked={mode === 'TPDI'}
          onChange={handleModeChange}
          type="radio"
          id="tpdi"
          value="TPDI"
        />
        <label className="mode-selector mode-selector--label" htmlFor="tpdi">
          3RD PARTY DATA
        </label>

        <input
          className="mode-selector mode-selector--input"
          checked={mode === 'WMS'}
          onChange={handleModeChange}
          type="radio"
          id="wms"
          value="WMS"
        />
        <label className="mode-selector mode-selector--label" htmlFor="wms">
          OGC
        </label>
      </div>
    </div>
  );
};

const mapStateToProps = (store) => ({
  mode: store.request.mode,
});
export default connect(mapStateToProps)(ModeSelector);
