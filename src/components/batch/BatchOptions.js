import React, { useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import batchSlice from '../../store/batch';
import Toggle from '../common/Toggle';
import GetLowResPreviewButton from './GetLowResPreviewButton';
import CreateBatchRequestButton from './CreateBatchRequestButton';
import CogParameters from './CogParameters';
import Tooltip from '../common/Tooltip/Tooltip';
import TargetBlankLink from '../common/TargetBlankLink';
import OutputDimensions from '../common/Output/OutputDimensions';
import Select from '../common/Select';

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
    case 4:
      return [0.0001, 0.0002];
    case 5:
      return [10.0, 20.0, 60.0];
    default:
      return [];
  }
};

const tilingGridOptions = [
  {
    value: 0,
    name: '20km grid',
  },
  {
    value: 1,
    name: '10km grid',
  },
  {
    value: 2,
    name: '100km grid',
  },
  {
    value: 3,
    name: 'WGS84 1 degree grid',
  },
];
const additionalGrids = [
  {
    value: 4,
    name: 'WGS84 0.25 degree grid',
  },
  {
    value: 5,
    name: 'New Zealand Topo 50',
  },
];

const BatchOptions = ({
  resolution,
  tillingGrid,
  description,
  bucketName,
  cogOutput,
  tilePath,
  setFetchedRequests,
  createCollection,
  collectionId,
  setCreateResponse,
  openOnlyCreateContainer,
  batchOverwrite,
  extendedSettings,
}) => {
  const [displayDimensions, setDisplayDimensions] = useState(false);
  const handleGridChange = (value) => {
    store.dispatch(batchSlice.actions.setTillingGrid(Number(value)));

    const possibleResolutions = generateResolutions(Number(value));
    if (!possibleResolutions.includes(resolution)) {
      store.dispatch(batchSlice.actions.setResolution(possibleResolutions[0]));
    }
  };

  const handleResChange = (value) => {
    store.dispatch(batchSlice.actions.setResolution(Number(value)));
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

  const handleTilePathChange = (e) => {
    store.dispatch(batchSlice.actions.setDefaultTilePath(e.target.value));
  };

  const handleCreateCollectionChange = () => {
    store.dispatch(batchSlice.actions.setCreateCollection(!createCollection));
  };

  const handleCollectionIdChange = (e) => {
    store.dispatch(batchSlice.actions.setCollectionId(e.target.value));
  };

  const handleOverwriteChange = () => {
    store.dispatch(batchSlice.actions.setOverwrite(!batchOverwrite));
  };

  return (
    <>
      <h2 className="heading-secondary">Batch Options</h2>
      <div className="form">
        <Select
          selected={tillingGrid}
          onChange={handleGridChange}
          options={extendedSettings ? [...tilingGridOptions, ...additionalGrids] : tilingGridOptions}
          label={
            <div className="flex items-center mb-2">
              <label htmlFor="tiling-grid" className="form__label mr-auto">
                Tiling Grid
              </label>
              <Tooltip
                direction="right"
                content={
                  <TargetBlankLink
                    href="https://docs.sentinel-hub.com/api/latest/api/batch/#tiling-grids"
                    children="Check the docs for more information"
                  />
                }
                infoStyles={{ marginRight: '1rem' }}
              />
            </div>
          }
          buttonClassNames="mb-2"
        />

        <Select
          label="Resolution"
          options={generateResolutions(tillingGrid).map((res) => ({
            name: res,
            value: res,
          }))}
          onChange={handleResChange}
          selected={resolution}
          buttonClassNames="mb-2"
        />

        <label htmlFor="bucket-name" className="form__label">
          Bucket Name
        </label>
        <input
          id="bucket-name"
          className="form__input mb-2"
          placeholder="(Required) Write your S3 bucket name here"
          type="text"
          onChange={handleBucketNameChange}
          value={bucketName}
        />

        <div className="flex items-center justify-between">
          <label htmlFor="tile-path" className="form__label">
            Tile Path {cogOutput ? '(Required)' : ''}
          </label>
          <Tooltip
            direction="right"
            content={
              <p>
                Specify an optional tile path where tiles will be ingested on your s3 bucket. <br />
                Use this to input to specify the files path on your bucket. Input follows:
                's3://your-bucket/input-text-here'
              </p>
            }
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>
        <input
          id="tile-path"
          className="form__input"
          type="text"
          onChange={handleTilePathChange}
          value={tilePath}
          placeholder={!cogOutput ? '(Optional): Specify tile path' : '(Required): Specify tile path'}
        />

        <label htmlFor="batch-description" className="form__label">
          Description
        </label>
        <input
          id="batch-description"
          className="form__input mb-2"
          type="text"
          placeholder="(Optional) Add a short description to your request"
          onChange={handleDescriptionChange}
          value={description}
          autoComplete="off"
        />

        <div className="flex items-center mb-2">
          <label htmlFor="cogOutput" className="form__label cursor-pointer mr-2">
            COG Output
          </label>
          <Toggle
            id="cogOutput"
            onChange={handleCogOutputChange}
            checked={cogOutput}
            style={{ marginRight: 'auto' }}
          />
          <Tooltip
            direction="right"
            content="If toggled, the results will be written as COG (cloud optimized GeoTIFFs). All outputs must use the TIFF format."
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>

        {cogOutput && !createCollection ? <CogParameters /> : null}

        <div className="flex items-center mb-2">
          <label htmlFor="create-collection" className="form__label mr-2">
            Create Collection?
          </label>
          <Toggle
            style={{ marginRight: 'auto' }}
            checked={createCollection}
            onChange={handleCreateCollectionChange}
            id="create-collection"
          />
          <Tooltip
            direction="right"
            content="If toggled, the results will be written as COG (cloud optimized GeoTIFFs) and a collection will be automatically created. All outputs must be single-band and use the TIFF format. Only one of createCollection and collectionId may be specified."
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>

        <div className="flex items-center mb-2">
          <label htmlFor="batch-collection-id" className="form__label" style={{ marginRight: 'auto' }}>
            Collection Id
          </label>
          <Tooltip
            direction="right"
            content="If provided, the results will be written as COG (cloud optimized GeoTIFFs) and added to the existing collection with the specified identifier. All outputs must be single-band and use the TIFF format. The collection must exist and be compatible -- that is, must contain bands equivalent to the batch request's outputs with the same bit depths. Only one of createCollection and collectionId may be specified."
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>
        <input
          id="batch-collection-id"
          disabled={createCollection}
          value={collectionId}
          onChange={handleCollectionIdChange}
          className="form__input mb-2"
          placeholder="(Optional) Write your collection id"
        />

        <div className="flex items-center">
          <label htmlFor="batch-overwrite" className="form__label mr-2">
            Overwrite
          </label>
          <Toggle
            id="batch-overwrite"
            onChange={handleOverwriteChange}
            checked={batchOverwrite}
            style={{ marginRight: 'auto' }}
          />
          <Tooltip
            direction="right"
            content="If toggled, the request will NOT fail if files already exist. Instead, any existing files will be overwritten."
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>

        <div className="flex items-center flex-wrap mt-2">
          <GetLowResPreviewButton />
          <CreateBatchRequestButton
            setFetchedRequests={setFetchedRequests}
            setCreateResponse={setCreateResponse}
            openOnlyCreateContainer={openOnlyCreateContainer}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '1rem 1rem 1rem 0',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label
              className="form__label"
              style={{ marginBottom: '0', marginRight: '1rem', cursor: 'pointer' }}
              htmlFor="display-dimensions"
            >
              Display low res dimensions
            </label>
            <Toggle
              checked={displayDimensions}
              onChange={() => {
                setDisplayDimensions((prev) => !prev);
              }}
              id="display-dimensions"
            />
          </div>
          <Tooltip
            content="Low resolution dimensions are only applied to the equivalent Process API request made when clicking 'Get Low Res Preview' and it doesn't affect the batch request."
            direction="right"
            infoStyles={{ marginRight: '1rem' }}
          />
        </div>
        <div style={{ display: displayDimensions ? 'block' : 'none' }}>
          <OutputDimensions />
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
  tilePath: store.batch.defaultTilePath,
  createCollection: store.batch.createCollection,
  collectionId: store.batch.collectionId,
  batchOverwrite: store.batch.overwrite,
  //additional grids
  extendedSettings: store.params.extendedSettings,
});

export default connect(mapStateToProps)(BatchOptions);
