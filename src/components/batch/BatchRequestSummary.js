import React, { useState, useEffect, useCallback } from 'react';
import store, { batchSlice, tpdiSlice, requestSlice, alertSlice } from '../../store';
import { getTransformedGeometryFromBounds, focusMap } from '../common/Map/utils/crsTransform';
import { dispatchChanges } from '../process/requests/parseRequest';
import { parseBatchRequest, getBucketName } from './parse';
import { fetchTilesBatchRequest } from './requests';

const tillingGridIdToName = (id) => {
  return ['S2GM Grid', '10km Grid', '100,08km Grid', 'WGS84'][id];
};

const validStatus = (status) => {
  return Boolean(status !== 'CREATED' && status !== 'CANCELED' && status !== 'ANALYSING');
};

const updateTileInfo = (tiles) => {
  let initial = {
    processedTiles: 0,
    processingTiles: 0,
    scheduledTiles: 0,
    consumedPu: 0,
    totalTiles: 0,
    pendingTiles: 0,
    failedTiles: 0,
  };
  return tiles.reduce((acc, tile) => {
    if (tile.status === 'PROCESSED') {
      acc['processedTiles']++;
      acc['consumedPu'] += tile.cost / 3;
    }
    if (tile.status === 'PENDING') {
      acc['pendingTiles']++;
    }
    if (tile.status === 'SCHEDULED') {
      acc['scheduledTiles']++;
    }
    if (tile.status === 'PROCESSING') {
      acc['processingTiles']++;
    }
    if (tile.status === 'FAILED') {
      acc['failedTiles']++;
    }
    acc['totalTiles']++;
    return acc;
  }, initial);
};

const BatchRequestSummary = ({ props, token }) => {
  const { id, status, description, tileCount, valueEstimate, created, processRequest } = props;
  const bucketName = getBucketName(props);

  const [showAllInfo, setShowAllInfo] = useState(false);
  const [isFetchingTiles, setIsFetchingTiles] = useState(false);
  const [fetchedTiles, setFetchedTiles] = useState({
    processedTiles: 0,
    processingTiles: 0,
    scheduledTiles: 0,
    consumedPu: 0,
    totalTiles: 0,
    pendingTiles: 0,
    failedTiles: 0,
  });
  const fetchTiles = useCallback(async () => {
    setIsFetchingTiles(true);
    const res = await fetchTilesBatchRequest(id, token);
    setFetchedTiles(updateTileInfo(res));
    setIsFetchingTiles(false);
  }, [id, token]);

  useEffect(() => {
    if (showAllInfo && validStatus(status)) {
      fetchTiles();
    }
  }, [fetchTiles, showAllInfo, status]);

  const generateCopyCommand = useCallback(() => {
    //if tilePath
    if (props.output && props.output.defaultTilePath) {
      let path = props.output.defaultTilePath.split('<')[0];
      return `aws s3 sync ${path} ./`;
    }
    return `aws s3 sync s3://${bucketName}/${id}/ ./`;
  }, [bucketName, props.output, id]);

  const handleSelectId = () => {
    store.dispatch(batchSlice.actions.setSelectedBatchId(id));
  };

  const handleShowInfoClick = () => {
    if (!props.singleBatch) {
      setShowAllInfo(!showAllInfo);
    }
  };

  const handleSeeGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(props.processRequest.input.bounds);
    store.dispatch(tpdiSlice.actions.setExtraMapGeometry(transformedGeo));
    focusMap();
  };

  const handleSetGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(props.processRequest.input.bounds);
    store.dispatch(requestSlice.actions.setGeometry(transformedGeo));
    focusMap();
  };

  const handleParseBatch = () => {
    try {
      dispatchChanges(processRequest);
      parseBatchRequest(props);
      store.dispatch(alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Request successfully parsed' }));
    } catch (err) {
      console.error(err);
      store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }));
    }
  };

  const handleRefreshTiles = () => {
    fetchTiles();
  };

  return (
    <div className="u-margin-bottom-small">
      <div className="batch-request-summary">
        <div
          title="Click to show information about the request"
          onClick={handleShowInfoClick}
          className="batch-request-summary-header"
        >
          <p className="text" style={{ display: 'inline-block' }}>
            {id}
          </p>
          <p className="text">{status}</p>
        </div>

        <div className="batch-request-summary-button">
          <button onClick={handleSelectId} className="secondary-button">
            Select Request
          </button>
        </div>
      </div>

      <div className="batch-request-summary-info">
        {showAllInfo ? (
          <>
            <p className="text">
              <span>Status:</span> {status}
            </p>
            {description ? (
              <p className="text">
                <span>Description:</span> {description}
              </p>
            ) : null}
            <p className="text">
              <span>Created At:</span> {created}
            </p>
            <p className="text">
              <span>Number of tiles:</span> {tileCount}
            </p>
            <p className="text">
              <span>Bucket Name:</span> {bucketName}
            </p>
            {valueEstimate ? (
              <p className="text">
                <span>Estimated Value (in PU):</span> {Math.round(valueEstimate)}
              </p>
            ) : null}
            {/* {fetchedTiles.consumedPu ? (
              <p className="text">
                <span>Consumed PU:</span> {Math.round(fetchedTiles.consumedPu)}
              </p>
            ) : null} */}
            <p className="text">
              <span>Tilling Grid:</span> {tillingGridIdToName(props.tilingGrid.id)}
            </p>
            <p className="text">
              <span>Resolution:</span> {props.tilingGrid.resolution}
            </p>
            <p className="text">
              <span>Last user Action:</span> {props.userAction}
            </p>
          </>
        ) : null}
      </div>

      {showAllInfo ? (
        <>
          {!validStatus(status) ? null : isFetchingTiles ? (
            <p className="text u-margin-bottom-small">Loading...</p>
          ) : (
            <table summary="Tile Information" className="table">
              <caption>
                Tile Information
                <button onClick={handleRefreshTiles} className="secondary-button u-margin-left-small">
                  Refresh Tiles
                </button>
              </caption>
              <thead>
                <tr>
                  <th scope="col">Processed</th>
                  <th scope="col">Processing</th>
                  <th scope="col">Scheduled</th>
                  <th scope="col">Failed</th>
                  <th scope="col">Pending</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fetchedTiles.processedTiles}</td>
                  <td>{fetchedTiles.processingTiles}</td>
                  <td>{fetchedTiles.scheduledTiles}</td>
                  <td>{fetchedTiles.failedTiles}</td>
                  <td>{fetchedTiles.pendingTiles}</td>
                  <td>{fetchedTiles.totalTiles}</td>
                </tr>
              </tbody>
            </table>
          )}
          <>
            <p className="text">
              <i>Note: To copy produced data to your location, you can use the following command:</i>
            </p>
            <p className="text u-margin-top-tiny u-margin-left-tiny u-margin-bottom-small">
              &gt;&nbsp; {generateCopyCommand()}
            </p>
          </>
        </>
      ) : null}

      {showAllInfo ? (
        <div>
          <button
            onClick={handleSeeGeometry}
            style={{ width: 'fit-content', marginRight: '1rem' }}
            className="secondary-button u-margin-bottom-small"
          >
            See geometry on map
          </button>
          <button
            onClick={handleSetGeometry}
            style={{ width: 'fit-content', marginRight: '1rem' }}
            className="secondary-button u-margin-bottom-small"
          >
            Set geometry on map
          </button>
          <button onClick={handleParseBatch} className="secondary-button">
            Parse Batch Request
          </button>
        </div>
      ) : null}
      <hr></hr>
    </div>
  );
};

export default BatchRequestSummary;
