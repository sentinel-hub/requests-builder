import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import BatchRequestSummary from './BatchRequestSummary';

const renderBatchRequestSummary = (
  requests,
  limit,
  token,
  setTilesResponse,
  handleDeleteBatchRequest,
  setSingleResponse,
  setFetchedRequests,
  handleExpand,
  setOpenedContainers,
  batchSelectedDeployment,
) => {
  let res = [];
  for (let i = 0; i < requests.length; i++) {
    if (i > limit) {
      break;
    }
    res.push(
      <BatchRequestSummary
        token={token}
        key={requests[i].id}
        props={requests[i]}
        setTilesResponse={setTilesResponse}
        handleDeleteBatchRequest={handleDeleteBatchRequest}
        setSingleResponse={setSingleResponse}
        setFetchedRequests={setFetchedRequests}
        handleExpand={handleExpand}
        setOpenedContainers={setOpenedContainers}
        batchSelectedDeployment={batchSelectedDeployment}
      />,
    );
  }
  return res;
};

const BatchStatusRequestsContainer = ({
  requests,
  token,
  setTilesResponse,
  handleDeleteBatchRequest,
  setSingleResponse,
  setFetchedRequests,
  specifyingCogParams,
  containerTitle,
  handleExpand,
  isContainerOpen,
  handleExpandContainer,
  setOpenedContainers,
  batchSelectedDeployment,
}) => {
  const [limit, setLimit] = useState(50);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setLimit(limit + 50);
    }
  };

  const handleExpandCont = () => {
    handleExpandContainer(!isContainerOpen);
  };
  return (
    <>
      <h3 className="heading-secondary mb-2" onClick={handleExpandCont} style={{ cursor: 'pointer' }}>
        {containerTitle}
        <FontAwesomeIcon
          style={{ marginLeft: '1rem' }}
          icon={isContainerOpen ? faAngleDoubleUp : faAngleDoubleDown}
        />
      </h3>
      {isContainerOpen && (
        <div
          onScroll={handleScroll}
          style={{
            marginLeft: '1rem',
            overflowY: 'scroll',
            marginBottom: '1rem',
            maxHeight: specifyingCogParams ? '600px' : '600px',
          }}
        >
          {requests === undefined || requests.length === 0 ? (
            <p className="text mb-2">No requests found.</p>
          ) : (
            renderBatchRequestSummary(
              requests,
              limit,
              token,
              setTilesResponse,
              handleDeleteBatchRequest,
              setSingleResponse,
              setFetchedRequests,
              handleExpand,
              setOpenedContainers,
              batchSelectedDeployment,
            )
          )}
        </div>
      )}
    </>
  );
};

export default BatchStatusRequestsContainer;
