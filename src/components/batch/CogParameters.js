import React from 'react';
import { connect } from 'react-redux';
import store, { batchSlice } from '../../store';

import Toggle from '../common/Toggle';

const CogParameters = ({
  overviewLevels,
  overviewMinSize,
  blockxsize,
  blockysize,
  isSpecifyingCogParams,
  collectionId,
}) => {
  const handleToggleChange = () => {
    store.dispatch(batchSlice.actions.setSpecifyingCogParams(!isSpecifyingCogParams));
  };
  const handleOverviewLevelsChange = (e) => {
    store.dispatch(batchSlice.actions.setOverviewLevels(e.target.value));
  };
  const handleOverviewMinSizeChange = (e) => {
    store.dispatch(batchSlice.actions.setOverviewMinSize(e.target.value));
  };
  const handleBlockxsize = (e) => {
    store.dispatch(batchSlice.actions.setBlockxsize(e.target.value));
  };
  const handleBlockysize = (e) => {
    store.dispatch(batchSlice.actions.setBlockysize(e.target.value));
  };

  return (
    <>
      <div className="toggle-with-label">
        <label htmlFor="specify-cog-params" className="form__label">
          Show advanced COG Parameters
        </label>
        <Toggle checked={isSpecifyingCogParams} onChange={handleToggleChange} id="specify-cog-params" />
        <span
          className="info"
          title="Allows to specify COG creation parameters. Batch collections must use default values, therefore cogParameters must not be specified together with createCollection or collectionId."
        >
          &#8505;
        </span>
      </div>

      {isSpecifyingCogParams ? (
        <div>
          <div className="label-with-info">
            <label className="form__label">Overview Levels</label>
            <span className="info" title="Separate each overview level with a comma. E.g: 2,4">
              &#8505;
            </span>
          </div>
          <input
            disabled={Boolean(collectionId)}
            onChange={handleOverviewLevelsChange}
            value={overviewLevels}
            className="form__input"
          />

          <label className="form__label">Overview Min Size</label>
          <input
            disabled={Boolean(collectionId)}
            onChange={handleOverviewMinSizeChange}
            type="number"
            value={overviewMinSize}
            className="form__input"
          />

          <label className="form__label">Block X Size</label>
          <input
            disabled={Boolean(collectionId)}
            onChange={handleBlockxsize}
            type="number"
            value={blockxsize}
            className="form__input"
          />

          <label className="form__label">Block Y Size</label>
          <input
            disabled={Boolean(collectionId)}
            onChange={handleBlockysize}
            type="number"
            value={blockysize}
            className="form__input u-margin-bottom-small"
          />
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  overviewMinSize: state.batch.overviewMinSize,
  blockxsize: state.batch.blockxsize,
  blockysize: state.batch.blockysize,
  overviewLevels: state.batch.overviewLevels,
  isSpecifyingCogParams: state.batch.specifyingCogParams,
  collectionId: state.batch.collectionId,
});

export default connect(mapStateToProps)(CogParameters);
