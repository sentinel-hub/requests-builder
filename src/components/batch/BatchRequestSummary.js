import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import store from '../../store';
import alertSlice from '../../store/alert';
import { getTransformedGeometryFromBounds, focusMap } from '../common/Map/utils/crsTransform';
import RequestButton from '../common/RequestButton';
import { dispatchChanges } from '../process/requests/parseRequest';
import { parseBatchRequest, getBucketName } from './parse';
import mapSlice from '../../store/map';
import BatchActions from './BatchActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import CopyIcon from '../common/CopyIcon';
import BatchResource from '../../api/batch/BatchResource';
import TileResource from '../../api/batch/TileResource';

export const fetchTilesBatchRequest = async (id) => {
  let res = await TileResource.getTiles({ orderId: id });
  let tiles = res.data.data;
  while (res.data.links.next) {
    res = await TileResource.getNextTiles(res.data.links.next)();
    tiles = tiles.concat(res.data.data);
  }
  return new Promise((resolve, reject) => {
    resolve(tiles);
  });
};

const gridsArray = [
  '20km grid', // 0
  '10km Grid', // 1
  '100km Grid', // 2
  'WGS84 1 degree Grid', // 3
  'WGS84 0.25 degree', // 4
  'New Zealand Topo50', // 5
];
const tillingGridIdToName = (id) => gridsArray[id];

const validStatus = (status) => {
  return Boolean(status !== 'CREATED' && status !== 'CANCELED' && status !== 'ANALYSING');
};

const updateTileInfo = (tiles) => {
  let initial = {
    processedTiles: 0,
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
    if (tile.status === 'FAILED') {
      acc['failedTiles']++;
    }
    acc['totalTiles']++;
    return acc;
  }, initial);
};

const validDeleteStatus = ['FAILED', 'CREATED', 'ANALYSIS_DONE'];
const isValidDeleteStatus = (status) => {
  return validDeleteStatus.includes(status);
};

const getPathToCopyFromTilePath = (tilePath) => {
  const splitted = tilePath.split('/');
  const resPathArr = [];
  const testRegex = /<\w+>/g;
  for (let word of splitted) {
    if (testRegex.test(word)) {
      break;
    } else {
      resPathArr.push(word);
    }
  }
  return resPathArr.join('/');
};

const BatchRequestSummary = ({
  props,
  token,
  setTilesResponse,
  handleDeleteBatchRequest,
  setSingleResponse,
  setFetchedRequests,
  handleExpand,
  setOpenedContainers,
}) => {
  const { id, status, description, tileCount, valueEstimate, created, processRequest, isExpanded } = props;
  const bucketName = getBucketName(props);
  const requestRef = useRef();

  // const [showAllInfo, setShowAllInfo] = useState(false);
  const [isFetchingTiles, setIsFetchingTiles] = useState(false);
  const [fetchedTiles, setFetchedTiles] = useState({
    processedTiles: 0,
    scheduledTiles: 0,
    consumedPu: 0,
    totalTiles: 0,
    pendingTiles: 0,
    failedTiles: 0,
  });
  const fetchTiles = useCallback(async () => {
    setIsFetchingTiles(true);
    const res = await fetchTilesBatchRequest(id);
    setFetchedTiles(updateTileInfo(res));
    setTilesResponse(JSON.stringify(res, null, 2));
    setIsFetchingTiles(false);
  }, [id, setTilesResponse]);

  useEffect(() => {
    if (isExpanded && validStatus(status)) {
      fetchTiles();
    }
  }, [fetchTiles, isExpanded, status]);

  useLayoutEffect(() => {
    if (isExpanded && requestRef.current) {
      requestRef.current.scrollIntoView();
    }
  }, [isExpanded]);

  const generateCopyCommand = useCallback(() => {
    if (props.output && props.output.defaultTilePath) {
      const path = getPathToCopyFromTilePath(props.output.defaultTilePath);
      return `aws s3 sync ${path} ./`;
    }
    return `aws s3 sync s3://${bucketName}/${id}/ ./`;
  }, [bucketName, props.output, id]);

  const handleSeeGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(props.processRequest.input.bounds);
    store.dispatch(mapSlice.actions.setExtraGeometry(transformedGeo));
    focusMap();
  };

  const handleSetGeometry = () => {
    const transformedGeo = getTransformedGeometryFromBounds(props.processRequest.input.bounds);
    store.dispatch(mapSlice.actions.setWgs84Geometry(transformedGeo));
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

  const deleteResponseHandler = () => {
    store.dispatch(alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Request successfully deleted.' }));
    handleDeleteBatchRequest(id);
  };

  const deleteErrorHandler = (err) => {
    const errMsg = err.message;
    store.dispatch(
      alertSlice.actions.addAlert({
        type: 'WARNING',
        text: `Something went wrong while trying to delete the request. ${
          errMsg ?? 'Check console for more details.'
        }`,
      }),
    );
    console.error(err);
  };

  return (
    <div className="batch-request-summary" ref={requestRef}>
      <div onClick={() => handleExpand(id)} className="batch-request-summary-header">
        <div className="batch-request-summary-header-title">
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <p
              className="text"
              style={{ width: '280px', marginRight: '1rem', fontWeight: '700' }}
              title="Click to show information about the request"
            >
              {id}
            </p>
            <CopyIcon
              className="batch-request-summary-header-icon"
              style={{ marginRight: '2rem' }}
              item={id}
            />
          </div>
          {description !== undefined && (
            <p className="text" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {description}
            </p>
          )}
        </div>
        <FontAwesomeIcon
          className="batch-request-summary-header-icon"
          style={{ marginLeft: '2rem' }}
          icon={isExpanded ? faAngleDoubleUp : faAngleDoubleDown}
        />
        <p className="text" style={{ marginRight: '2rem', fontWeight: '700' }}>
          {status}
        </p>
      </div>

      {isExpanded && (
        <div className="batch-request-summary-container">
          <div className="batch-request-summary-info">
            <>
              <p className="text">
                <span>Status:</span> {status}
              </p>
              {props.error !== undefined ? (
                <p className="text" style={{ color: 'red' }}>
                  <span>Error:</span> {props.error}
                </p>
              ) : null}
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
                  <span>Estimated Value (in PU):</span> {Math.round(valueEstimate / 3)}
                </p>
              ) : null}
              {/* {fetchedTiles.consumedPu ? (
                <p className="text">
                  <span>Consumed PU:</span> {Math.round(fetchedTiles.consumedPu)}
                </p>
              ) : null} */}
              <p className="text">
                <span>Tiling Grid:</span> {tillingGridIdToName(props.tilingGrid.id)}
              </p>
              <p className="text">
                <span>Resolution:</span> {props.tilingGrid.resolution}
              </p>
              <p className="text">
                <span>Last user Action:</span> {props.userAction}
              </p>
            </>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <BatchActions
              requestId={id}
              token={token}
              setSingleResponse={setSingleResponse}
              setFetchedRequests={setFetchedRequests}
              setOpenedContainers={setOpenedContainers}
              status={status}
              fetchTiles={fetchTiles}
            />
            <div className="batch-request-summary-actions">
              <button
                onClick={handleSeeGeometry}
                className="secondary-button secondary-button--wrapped"
                style={{ width: '70%' }}
              >
                See geometry on map
              </button>
              <button
                onClick={handleSetGeometry}
                className="secondary-button secondary-button--wrapped"
                style={{ width: '70%' }}
              >
                Set geometry on map
              </button>
              <button
                onClick={handleParseBatch}
                className="secondary-button secondary-button--wrapped"
                style={{ width: '70%' }}
              >
                Parse Batch Request
              </button>
              {isValidDeleteStatus(status) && (
                <RequestButton
                  request={BatchResource.deleteOrder}
                  args={[{ orderId: id }]}
                  buttonText="Delete Batch Request"
                  className="secondary-button secondary-button--cancel"
                  validation={true}
                  responseHandler={deleteResponseHandler}
                  errorHandler={deleteErrorHandler}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isExpanded ? (
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
                  <th scope="col">Scheduled</th>
                  <th scope="col">Failed</th>
                  <th scope="col">Pending</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fetchedTiles.processedTiles}</td>
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

      <hr></hr>
    </div>
  );
};

export default BatchRequestSummary;
