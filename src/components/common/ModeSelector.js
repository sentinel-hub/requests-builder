import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import requestSlice from '../../store/request';

const ModeSelector = ({ mode }) => {
  const handleModeChange = (e) => {
    store.dispatch(requestSlice.actions.setMode(e.target.value));
  };

  return (
    <div>
      <h2 className="heading-secondary u-margin-bottom-small">Select API</h2>
      <div className="mode-selector">
        <div className="u-flex-aligned">
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
        </div>

        <div className="u-flex-aligned">
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
        </div>

        <div className="u-flex-aligned">
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
        </div>

        <div className="u-flex-aligned">
          <input
            className="mode-selector mode-selector--input"
            checked={mode === 'CATALOG'}
            onChange={handleModeChange}
            type="radio"
            id="catalog"
            value="CATALOG"
          />
          <label className="mode-selector mode-selector--label" htmlFor="catalog">
            CATALOG
          </label>
        </div>

        <div className="u-flex-aligned">
          <input
            className="mode-selector mode-selector--input"
            checked={mode === 'STATISTICAL'}
            onChange={handleModeChange}
            type="radio"
            id="statistical"
            value="STATISTICAL"
          />
          <label className="mode-selector mode-selector--label" htmlFor="statistical">
            STATISTICAL
          </label>
        </div>

        <div className="u-flex-aligned">
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
    </div>
  );
};

const mapStateToProps = (store) => ({
  mode: store.request.mode,
});
export default connect(mapStateToProps)(ModeSelector);
