import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import batchSlice from '../../store/batch';
import Toggle from '../common/Toggle';
import GetLowResPreviewButton from './GetLowResPreviewButton';
import CreateBatchRequestButton from './CreateBatchRequestButton';
import CogParameters from './CogParameters';

const generateResolutions = (tillingGridId) => {
  switch (tillingGridId) {
    case 0:
      return [10.0, 20.0, 60.0];
    case 1:
      return [10.0, 20.0];
    case 2:
      return [60.0, 120.0, 240.0, 360.0];
    case 3:
      return [0.0001, 0.0002];
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
  createCollection,
  collectionId,
  setCreateResponse,
}) => {
  const handleGridChange = (e) => {
    store.dispatch(batchSlice.actions.setTillingGrid(Number(e.target.value)));

    const possibleResolutions = generateResolutions(Number(e.target.value));
    if (!possibleResolutions.includes(resolution)) {
      store.dispatch(batchSlice.actions.setResolution(possibleResolutions[0]));
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
    if (!cogOutput) {
      store.dispatch(batchSlice.actions.setSpecifyingBucketName(false));
    }
    store.dispatch(batchSlice.actions.setCogOutput(!cogOutput));
  };

  const handleSpecifyingBucketNameChange = () => {
    if (!cogOutput) {
      store.dispatch(batchSlice.actions.setSpecifyingBucketName(!specifyingBucketName));
    }
  };

  const handleTilePathChange = (e) => {
    store.dispatch(batchSlice.actions.setDefaultTilePath(e.target.value));
  };

  const handleCreateCollectionChange = () => {
    store.dispatch(batchSlice.actions.setCreateCollection(!createCollection));
  };

  const handleCollectionIdChange = (e) => {
    store.dispatch(batchSlice.actions.setCollectionId(e.target.value));
  };

  return (
    <>
      <h2 className="heading-secondary">Batch Options</h2>
      <div className="form">
        <label htmlFor="tiling-grid" className="form__label">
          Tiling Grid
        </label>
        <select id="tiling-grid" className="form__input" value={tillingGrid} onChange={handleGridChange}>
          <option value={0}>S2GM grid</option>
          <option value={1}>10km grid</option>
          <option value={2}>100.08km grid</option>
          <option value={3}>WGS84 1 degree grid</option>
        </select>

        <label htmlFor="resolution" className="form__label">
          Resolution
        </label>
        <select id="resolution" className="form__input" value={resolution} onChange={handleResChange}>
          {generateResolutions(tillingGrid).map((res) => {
            return (
              <option key={res} value={res}>
                {res}
              </option>
            );
          })}
        </select>

        <label htmlFor="bucket-name" className="form__label">
          Bucket Name
        </label>
        <input
          id="bucket-name"
          className="form__input"
          placeholder="Write your S3 bucket here"
          type="text"
          onChange={handleBucketNameChange}
          value={bucketName}
        />

        <label htmlFor="batch-description" className="form__label">
          Description
        </label>
        <input
          id="batch-description"
          className="form__input"
          type="text"
          placeholder="Add a short description to your request"
          onChange={handleDescriptionChange}
          value={description}
          autoComplete="off"
        />

        <div className="toggle-with-label">
          <label htmlFor="cogOutput" className="form__label">
            COG Output
          </label>
          <Toggle id="cogOutput" onChange={handleCogOutputChange} checked={cogOutput} />
          <span
            className="info"
            title="If toggled, the results will be written as COG (cloud optimized GeoTIFFs). All outputs must use the TIFF format."
          >
            &#8505;
          </span>
        </div>

        <div className="toggle-with-label">
          <label htmlFor="create-collection" className="form__label">
            Create Collection?
          </label>
          <Toggle checked={createCollection} onChange={handleCreateCollectionChange} id="create-collection" />
          <span
            className="info"
            title="If toggled, the results will be written as COG (cloud optimized GeoTIFFs) and a collection will be automatically created. All outputs must be single-band and use the TIFF format. Only one of createCollection and collectionId may be specified."
          >
            &#8505;
          </span>
        </div>

        {cogOutput && !createCollection ? <CogParameters /> : null}

        <div className="label-with-info">
          <label htmlFor="batch-collection-id" className="form__label">
            Collection Id
          </label>
          <span
            className="info"
            title="If provided, the results will be written as COG (cloud optimized GeoTIFFs) and added to the existing collection with the specified identifier. All outputs must be single-band and use the TIFF format. The collection must exist and be compatible -- that is, must contain bands equivalent to the batch request's outputs with the same bit depths. Only one of createCollection and collectionId may be specified."
          >
            &#8505;
          </span>
        </div>
        <input
          id="batch-collection-id"
          disabled={createCollection}
          value={collectionId}
          onChange={handleCollectionIdChange}
          className="form__input"
        />

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
              <label htmlFor="tile-path" className="form__label">
                Tile Path
              </label>
              <span
                className="info"
                title="Use this to specify the path on your bucket. Input text comes after: 's3://<your-bucket>/<input-text-here>'"
              >
                &#8505;
              </span>
            </div>
            <input
              id="tile-path"
              className="form__input"
              type="text"
              onChange={handleTilePathChange}
              value={tilePath}
            />
          </>
        ) : null}
        <div className="buttons-container">
          <GetLowResPreviewButton />
          <CreateBatchRequestButton
            setFetchedRequests={setFetchedRequests}
            setCreateResponse={setCreateResponse}
          />
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
  createCollection: store.batch.createCollection,
  collectionId: store.batch.collectionId,
});

export default connect(mapStateToProps)(BatchOptions);
