import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { groupBy } from '../../utils/const';
import BatchStatusRequestsContainer from './BatchStatusRequestsContainer';
import GetAllBatchRequestsButton from './GetAllBatchRequestsButton';

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
          req.status.toLowerCase().includes(lowerCasedSearchText)
        );
      } else {
        return req.id.includes(searchText) || req.status.toLowerCase().includes(lowerCasedSearchText);
      }
    });
  }
};

export const groupBatchAggregator = (el) => {
  const { status } = el;
  if (status === 'ANALYSING' || status === 'ANALYSIS_DONE' || status === 'CREATED') {
    return 'CREATED';
  }
  if (status === 'PROCESSING') {
    return 'RUNNING';
  }
  if (status === 'DONE' || status === 'PARTIAL' || status === 'FAILED' || status === 'CANCELED') {
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

  return (
    <>
      <h2 className="heading-secondary">Batch Information</h2>
      <div className="form" style={{ minHeight: '800px' }}>
        <div className="u-flex-aligned">
          <GetAllBatchRequestsButton
            setFetchedRequests={setFetchedRequests}
            setGetAllResponse={setGetAllResponse}
          />
          <input
            value={searchText}
            onChange={handleSearchTextChange}
            type="text"
            className="form__input"
            placeholder="Search Requests by description, id or status"
            style={{ width: '30%' }}
          />
        </div>
        <hr className="u-margin-top-tiny u-margin-bottom-tiny" />
        {extraInfo !== '' ? (
          <>
            <div className="info-banner" style={{ marginBottom: '1rem' }}>
              <p>{extraInfo}</p>
            </div>
            <hr className="u-margin-bottom-tiny" />
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
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  extraInfo: state.batch.extraInfo,
  token: state.auth.user.access_token,
  specifyingCogParams: state.batch.specifyingCogParams,
});

export default connect(mapStateToProps)(BatchInformation);
