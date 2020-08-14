import React from 'react';
import { connect } from 'react-redux';
import store, { batchSlice } from '../../store';
import Toggle from '../Toggle';
import GetLowResPreviewButton from './GetLowResPreviewButton';
import CreateBatchRequestButton from './CreateBatchRequestButton';

const generateResolutions = (tillingGridId) => {
  switch (tillingGridId) {
    case 0:
      return [10.0, 20.0, 60.0];
    case 1:
      return [10.0, 20.0];
    case 2:
      return [60.0, 120.0, 240.0, 360.0];
    default:
      return [];
  }
};

const BatchOptions = ({
  resolution,
  tillingGrid,
  description,
  bucketName,
  cogOutput,
  tilePath,
  specifyingBucketName,
  setFetchedRequests,
}) => {
  const handleGridChange = (e) => {
    store.dispatch(batchSlice.actions.setTillingGrid(Number(e.target.value)));
    // If 100.08 select 60.0 as resolution.
    if (Number(e.target.value) === 2) {
      store.dispatch(batchSlice.actions.setResolution(60.0));
    }
  };

  const handleResChange = (e) => {
    store.dispatch(batchSlice.actions.setResolution(Number(e.target.value)));
  };

  const handleBucketNameChange = (e) => {
    store.dispatch(batchSlice.actions.setBucketName(e.target.value));
  };

  const handleDescriptionChange = (e) => {
    store.dispatch(batchSlice.actions.setDescription(e.target.value));
  };

  const handleCogOutputChange = () => {
    store.dispatch(batchSlice.actions.setCogOutput(!cogOutput));
  };

  const handleSpecifyingBucketNameChange = () => {
    store.dispatch(batchSlice.actions.setSpecifyingBucketName(!specifyingBucketName));
  };

  const handleTilePathChange = (e) => {
    store.dispatch(batchSlice.actions.setDefaultTilePath(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary">Batch Options</h2>
      <div className="form">
        <label className="form__label">Tilling Grid</label>
        <select className="form__input" value={tillingGrid} onChange={handleGridChange}>
          <option value={0}>S2GM Grid</option>
          <option value={1}>10km Grid</option>
          <option value={2}>100,08km Grid</option>
        </select>

        <label className="form__label">Resolution</label>
        <select className="form__input" value={resolution} onChange={handleResChange}>
          {generateResolutions(tillingGrid).map((res) => {
            return (
              <option key={res} value={res}>
                {res}
              </option>
            );
          })}
        </select>

        <label className="form__label">Bucket Name</label>
        <input className="form__input" type="text" onChange={handleBucketNameChange} value={bucketName} />

        <label className="form__label">Description</label>
        <input className="form__input" type="text" onChange={handleDescriptionChange} value={description} />

        <div className="toggle-with-label">
          <label htmlFor="cogOutput" className="form__label">
            COG Output
          </label>
          <Toggle id="cogOutput" onChange={handleCogOutputChange} checked={cogOutput} />
        </div>

        <div className="toggle-with-label">
          <label htmlFor="specify-bucket" className="form__label">
            {!specifyingBucketName ? 'Specifying Tile Path' : 'Specifying bucket name'}
          </label>
          <Toggle
            checked={specifyingBucketName}
            onChange={handleSpecifyingBucketNameChange}
            id="specify-bucket"
          />
        </div>

        {!specifyingBucketName ? (
          <>
            <div className="label-with-info">
              <label className="form__label">Tile Path</label>
              <span
                className="info"
                title="Use this to specify the path on your bucket. Input text comes after: 's3://<your-bucket>/<input-text-here>'"
              >
                &#8505;
              </span>
            </div>
            <input className="form__input" type="text" onChange={handleTilePathChange} value={tilePath} />
          </>
        ) : null}
        <div className="buttons-container">
          <GetLowResPreviewButton />
          <CreateBatchRequestButton setFetchedRequests={setFetchedRequests} />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  resolution: store.batch.resolution,
  tillingGrid: store.batch.tillingGrid,
  description: store.batch.description,
  bucketName: store.batch.bucketName,
  cogOutput: store.batch.cogOutput,
  specifyingBucketName: store.batch.specifyingBucketName,
  tilePath: store.batch.defaultTilePath,
});

export default connect(mapStateToProps)(BatchOptions);
