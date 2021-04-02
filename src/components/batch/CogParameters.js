import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import batchSlice from '../../store/batch';

import Toggle from '../common/Toggle';
import Tooltip from '../common/Tooltip/Tooltip';

const CogParameters = ({ isSpecifyingCogParams, collectionId, cogParameters }) => {
  const handleToggleChange = () => {
    store.dispatch(batchSlice.actions.setSpecifyingCogParams(!isSpecifyingCogParams));
  };
  const curriyedCogPropertyUpdater = (key) => (event) => {
    store.dispatch(batchSlice.actions.setCogParameter({ key, value: event.target.value }));
  };

  const handleUsePredictorChange = () => {
    const newValue = cogParameters.usePredictor === undefined ? false : !cogParameters.usePredictor;
    store.dispatch(batchSlice.actions.setCogParameter({ key: 'usePredictor', value: newValue }));
  };

  return (
    <>
      <div className="toggle-with-label">
        <label htmlFor="specify-cog-params" className="form__label">
          Show advanced COG Parameters
        </label>
        <Toggle
          checked={isSpecifyingCogParams}
          onChange={handleToggleChange}
          id="specify-cog-params"
          style={{ marginRight: 'auto' }}
        />
        <Tooltip
          direction="right"
          content="Allows to specify COG creation parameters. Batch collections must use default values, therefore cogParameters must not be specified together with createCollection or collectionId."
          infoStyles={{ marginRight: '1rem' }}
        />
      </div>

      {isSpecifyingCogParams ? (
        <div style={{ paddingLeft: '1rem' }}>
          <div className="label-with-info">
            <label className="form__label" htmlFor="overviewlevels" style={{ marginRight: 'auto' }}>
              Overview Levels
            </label>
            <Tooltip
              direction="right"
              content="Separate each overview level with a comma. E.g: 2,4"
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <input
            disabled={Boolean(collectionId)}
            onChange={curriyedCogPropertyUpdater('overviewLevels')}
            value={cogParameters.overviewLevels ?? ''}
            className="form__input"
            placeholder="e.g: 2,4. Levels on gdaladdo"
            id="overviewlevels"
          />

          <div className="label-with-info">
            <label className="form__label" htmlFor="overviewminsize" style={{ marginRight: 'auto' }}>
              Overview Min Size
            </label>
            <Tooltip
              direction="right"
              content="Corresponds to the minsize parameter of gdaladdo"
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <input
            disabled={Boolean(collectionId)}
            onChange={curriyedCogPropertyUpdater('overviewMinSize')}
            type="number"
            value={cogParameters.overviewMinSize ?? ''}
            className="form__input"
            placeholder="Corresponds to the minsize parameter of gdaladdo"
            id="overviewminsize"
          />

          <div className="label-with-info">
            <label className="form__label" htmlFor="blockxsize" style={{ marginRight: 'auto' }}>
              Block X Size
            </label>
            <Tooltip
              direction="right"
              content="Corresponds to the BLOCKXSIZE parameter of GDAL GTiff driver"
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <input
            disabled={Boolean(collectionId)}
            onChange={curriyedCogPropertyUpdater('blockxsize')}
            value={cogParameters.blockxsize ?? ''}
            type="number"
            className="form__input"
            placeholder="Corresponds to the BLOCKXSIZE parameter of GDAL GTiff driver"
            id="blockxsize"
          />

          <div className="label-with-info">
            <label className="form__label" htmlFor="blockysize" style={{ marginRight: 'auto' }}>
              Block Y Size
            </label>
            <Tooltip
              direction="right"
              content="Corresponds to the BLOCKYSIZE parameter of GDAL GTiff driver"
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <input
            disabled={Boolean(collectionId)}
            type="number"
            onChange={curriyedCogPropertyUpdater('blockysize')}
            value={cogParameters.blockysize ?? ''}
            className="form__input"
            placeholder="Corresponds to the BLOCKYSIZE parameter of GDAL GTiff driver"
            id="blockysize"
          />

          <div className="label-with-info">
            <label className="form__label" htmlFor="resampling-algo" style={{ marginRight: 'auto' }}>
              Resampling Algorithm
            </label>
            <Tooltip
              direction="right"
              content="Corresponds to the value of the -r parameter of gdaladdo."
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <select
            className="form__input"
            disabled={Boolean(collectionId)}
            onChange={curriyedCogPropertyUpdater('resamplingAlgorithm')}
            value={cogParameters.resamplingAlgorithm ?? 'average'}
            id="resampling-algo"
          >
            <option value="average">Default (average)</option>
            <option value="nearest">nearest</option>
            <option value="gauss">gauss</option>
            <option value="cubic">cubic</option>
            <option value="cubicspline">cubicspline</option>
            <option value="lanczos">lanczos</option>
            <option value="average_magphase">average_magphase</option>
            <option value="mode">mode</option>
          </select>

          <div className="toggle-with-label">
            <label className="form__label" htmlFor="use-predictor">
              Use Predictor
            </label>
            <Toggle
              defaultChecked
              onChange={handleUsePredictorChange}
              id="use-predictor"
              style={{ marginRight: 'auto' }}
            />
            <Tooltip
              direction="right"
              content='Whether predictor should be used for TIFF compression. If true, the predictor "2" will be passed to GDAL GTiff raster driver in case of integer output and "3" for FLOAT32 output. If false, the value "1" (no predictor) will be used.'
              infoStyles={{ marginRight: '1rem' }}
            />
          </div>
          <hr className="u-margin-bottom-tiny" />
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  isSpecifyingCogParams: state.batch.specifyingCogParams,
  collectionId: state.batch.collectionId,
  cogParameters: state.batch.cogParameters,
});

export default connect(mapStateToProps)(CogParameters);
