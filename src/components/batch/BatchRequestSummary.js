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
    <div className="mb-1" ref={requestRef}>
      <div
        onClick={() => handleExpand(id)}
        className="w-full h-full cursor-pointer items-center flex-col flex mb-1 lg:flex-row"
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text w-80 mr-2 font-bold" title="Click to show information about the request">
              {id}
            </p>
            <CopyIcon className="mr-2" item={id} />
          </div>
          {description !== undefined && (
            <p className="text" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {description}
            </p>
          )}
        </div>
        <FontAwesomeIcon
          className="ml-2 text-center my-2 lg:mr-auto lg:my-0"
          icon={isExpanded ? faAngleDoubleUp : faAngleDoubleDown}
        />
        <p className="text mr-4 font-bold text-center lg:text-left">{status}</p>
      </div>

      {isExpanded && (
        <div className="pl-2 flex flex-col lg:flex-row">
          <div className="flex flex-col justify-between w-full lg:w-1/2">
            <>
              <p className="text mr-1 mb-1">
                <span className="font-bold">Status:</span> {status}
              </p>
              {props.error !== undefined ? (
                <p className="text mr-1 mb-1 text-red-700">
                  <span className="font-bold">Error:</span> {props.error}
                </p>
              ) : null}
              {description ? (
                <p className="text mr-1 mb-1">
                  <span className="font-bold">Description:</span> {description}
                </p>
              ) : null}
              <p className="text mr-1 mb-1">
                <span className="font-bold">Created At:</span> {created}
              </p>
              <p className="text mr-1 mb-1">
                <span className="font-bold">Number of tiles:</span> {tileCount}
              </p>
              <p className="text mr-1 mb-1">
                <span className="font-bold">Bucket Name:</span> {bucketName}
              </p>
              {valueEstimate ? (
                <p className="text mr-1 mb-1">
                  <span className="font-bold">Estimated Value (in PU):</span> {Math.round(valueEstimate / 3)}
                </p>
              ) : null}
              {/* {fetchedTiles.consumedPu ? (
                <p className="text mr-1 mb-1">
                  <span className="font-bold">Consumed PU:</span> {Math.round(fetchedTiles.consumedPu)}
                </p>
              ) : null} */}
              <p className="text mr-1 mb-1">
                <span className="font-bold">Tiling Grid:</span> {tillingGridIdToName(props.tilingGrid.id)}
              </p>
              <p className="text mr-1 mb-1">
                <span className="font-bold">Resolution:</span> {props.tilingGrid.resolution}
              </p>
              <p className="text mr-1 mb-1">
                <span className="font-bold">Last user Action:</span> {props.userAction}
              </p>
            </>
          </div>
          <div className="flex flex-col w-full justify-around items-center">
            <BatchActions
              requestId={id}
              token={token}
              setSingleResponse={setSingleResponse}
              setFetchedRequests={setFetchedRequests}
              setOpenedContainers={setOpenedContainers}
              status={status}
              fetchTiles={fetchTiles}
            />
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-1 mr-1 h-fit">
              <button
                onClick={handleSeeGeometry}
                className="secondary-button wrapped"
                style={{ width: '70%' }}
              >
                See geometry on map
              </button>
              <button
                onClick={handleSetGeometry}
                className="secondary-button wrapped"
                style={{ width: '70%' }}
              >
                Set geometry on map
              </button>
              <button
                onClick={handleParseBatch}
                className="secondary-button wrapped"
                style={{ width: '70%' }}
              >
                Parse Batch Request
              </button>
              {isValidDeleteStatus(status) && (
                <RequestButton
                  request={BatchResource.deleteOrder}
                  args={[{ orderId: id }]}
                  buttonText="Delete Batch Request"
                  additionalClassNames={['secondary-button--cancel', 'wrapped']}
                  className="secondary-button"
                  validation={true}
                  responseHandler={deleteResponseHandler}
                  errorHandler={deleteErrorHandler}
                  style={{ width: '70%', marginTop: '0' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isExpanded ? (
        <>
          {!validStatus(status) ? null : isFetchingTiles ? (
            <p className="text mb-2">Loading...</p>
          ) : (
            <table summary="Tile Information" className="table">
              <caption>
                Tile Information
                <button onClick={handleRefreshTiles} className="secondary-button ml-1">
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
            <p className="text mt-1 ml-1 mb-2">&gt;&nbsp; {generateCopyCommand()}</p>
          </>
        </>
      ) : null}

      <hr className="my-2"></hr>
    </div>
  );
};

export default BatchRequestSummary;
