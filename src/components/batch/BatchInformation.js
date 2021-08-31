import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import batchSlice from '../../store/batch';
import { groupBy } from '../../utils/commonUtils';
import { BATCH_SUPPORTED_DEPLOYMENTS } from '../../utils/const/const';
import Select from '../common/Select';
import BatchStatusRequestsContainer from './BatchStatusRequestsContainer';
import GetAllBatchRequestsButton from './GetAllBatchRequestsButton';
import GetLatestRequestButton from './GetLatestRequestButton';
import { isCreatedStatus, isFinishedStatus, isRunningStatus } from './lib/utils';

const filterRequestsResults = (searchText, requests) => {
  if (searchText === '') {
    return requests;
  } else {
    const lowerCasedSearchText = searchText.toLowerCase();
    return requests.filter((req) => {
      if (req.description) {
        return (
          req.description.toLowerCase().includes(lowerCasedSearchText) ||
          req.id.includes(searchText) ||
          req.status.toLowerCase().includes(lowerCasedSearchText) ||
          req.output?.collectionId?.includes(lowerCasedSearchText)
        );
      } else {
        return req.id.includes(searchText) || req.status.toLowerCase().includes(lowerCasedSearchText);
      }
    });
  }
};

export const groupBatchAggregator = (el) => {
  const { status } = el;
  if (isCreatedStatus(status)) {
    return 'CREATED';
  }
  if (isRunningStatus(status)) {
    return 'RUNNING';
  }
  if (isFinishedStatus(status)) {
    return 'FINISHED';
  }
};

const BatchInformation = ({
  fetchedRequests,
  extraInfo,
  setFetchedRequests,
  token,
  specifyingCogParams,
  setGetAllResponse,
  setTilesResponse,
  setSingleResponse,
  openedContainers,
  setOpenedContainers,
  batchSelectedDeployment,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(fetchedRequests);

  useEffect(() => {
    if (fetchedRequests.length > 0) {
      setFilteredRequests(filterRequestsResults(searchText, fetchedRequests));
    } else {
      setFilteredRequests([]);
    }
  }, [fetchedRequests, searchText]);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleDeleteBatchRequest = useCallback(
    (batchId) => {
      setFetchedRequests((prevFetched) => prevFetched.filter((batchReq) => batchReq.id !== batchId));
    },
    [setFetchedRequests],
  );
  const { CREATED, RUNNING, FINISHED } = groupBy(filteredRequests, groupBatchAggregator);

  const handleExpand = useCallback(
    (requestId) => {
      setFetchedRequests((prev) => {
        const idx = prev.findIndex((req) => req.id === requestId);
        const itemToUpdate = prev[idx];
        return prev
          .slice(0, idx)
          .concat([{ ...itemToUpdate, isExpanded: !itemToUpdate.isExpanded }, ...prev.slice(idx + 1)]);
      });
    },
    [setFetchedRequests],
  );

  const handleExpandContainer = useCallback(
    (idx) => (newValue) => {
      setOpenedContainers((prevOpenedContainers) => {
        const cloned = [...prevOpenedContainers];
        cloned[idx] = newValue;
        return cloned;
      });
    },
    [setOpenedContainers],
  );

  const handleBatchDeploymentChange = (value) => {
    store.dispatch(batchSlice.actions.setSelectedBatchDeployment(value));
  };

  return (
    <>
      <h2 className="heading-secondary">Batch Information</h2>
      <div className="form" style={{ minHeight: '800px' }}>
        <div className="flex items-center">
          <div className="w-60">
            <Select
              selected={batchSelectedDeployment}
              options={BATCH_SUPPORTED_DEPLOYMENTS.map((deploy) => ({
                value: deploy,
                name: deploy,
              }))}
              onChange={handleBatchDeploymentChange}
            />
          </div>
          <GetAllBatchRequestsButton
            batchSelectedDeployment={batchSelectedDeployment}
            setFetchedRequests={setFetchedRequests}
            setGetAllResponse={setGetAllResponse}
          />

          <GetLatestRequestButton
            batchSelectedDeployment={batchSelectedDeployment}
            setFetchedRequests={setFetchedRequests}
            handleExpandContainer={handleExpandContainer}
          />
          <input
            value={searchText}
            onChange={handleSearchTextChange}
            type="text"
            className="form__input"
            placeholder="Search Requests by description, id, status or collection id."
            style={{ width: '30%' }}
          />
        </div>
        <hr className="mt-1 mb-1" />
        {extraInfo !== '' ? (
          <>
            <div className="info-banner" style={{ marginBottom: '1rem' }}>
              <p>{extraInfo}</p>
            </div>
            <hr className="mb-1" />
          </>
        ) : null}

        <BatchStatusRequestsContainer
          requests={CREATED}
          handleDeleteBatchRequest={handleDeleteBatchRequest}
          setFetchedRequests={setFetchedRequests}
          setSingleResponse={setSingleResponse}
          setTilesResponse={setTilesResponse}
          token={token}
          specifyingCogParams={specifyingCogParams}
          containerTitle="Created Requests (Not started)"
          handleExpand={handleExpand}
          isContainerOpen={openedContainers[0]}
          handleExpandContainer={handleExpandContainer(0)}
          setOpenedContainers={setOpenedContainers}
          batchSelectedDeployment={batchSelectedDeployment}
        />

        <BatchStatusRequestsContainer
          requests={RUNNING}
          handleDeleteBatchRequest={handleDeleteBatchRequest}
          setFetchedRequests={setFetchedRequests}
          setSingleResponse={setSingleResponse}
          setTilesResponse={setTilesResponse}
          token={token}
          specifyingCogParams={specifyingCogParams}
          handleExpand={handleExpand}
          containerTitle="Running Requests"
          handleExpandContainer={handleExpandContainer(1)}
          isContainerOpen={openedContainers[1]}
          setOpenedContainers={setOpenedContainers}
          batchSelectedDeployment={batchSelectedDeployment}
        />

        <BatchStatusRequestsContainer
          requests={FINISHED}
          handleDeleteBatchRequest={handleDeleteBatchRequest}
          setFetchedRequests={setFetchedRequests}
          setSingleResponse={setSingleResponse}
          setTilesResponse={setTilesResponse}
          token={token}
          specifyingCogParams={specifyingCogParams}
          handleExpand={handleExpand}
          handleExpandContainer={handleExpandContainer(2)}
          isContainerOpen={openedContainers[2]}
          containerTitle="Finished Requests"
          setOpenedContainers={setOpenedContainers}
          batchSelectedDeployment={batchSelectedDeployment}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  extraInfo: state.batch.extraInfo,
  token: state.auth.user.access_token,
  specifyingCogParams: state.batch.specifyingCogParams,
  batchSelectedDeployment: state.batch.batchSelectedDeployment,
});

export default connect(mapStateToProps)(BatchInformation);
