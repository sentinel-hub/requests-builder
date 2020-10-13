import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import BatchRequestSummary from './BatchRequestSummary';
import GetAllBatchRequestsButton from './GetAllBatchRequestsButton';

const filterRequestsResults = (searchText, requests) => {
  if (searchText === '') {
    return requests;
  } else {
    return requests.filter((req) => {
      if (req.description) {
        return (
          req.description.toLowerCase().includes(searchText.toLowerCase()) || req.id.includes(searchText)
        );
      } else {
        return req.id.includes(searchText);
      }
    });
  }
};
const renderBatchRequestSummary = (requests, limit, token) => {
  let res = [];
  for (let i = 0; i < requests.length; i++) {
    if (i > limit) {
      break;
    }
    res.push(<BatchRequestSummary token={token} key={requests[i].id} props={requests[i]} />);
  }
  return res;
};

const BatchInformation = ({ fetchedRequests, extraInfo, setFetchedRequests, token, specifyingCogParams }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(fetchedRequests);
  //  limit to render amount of BatchRequestSummary
  const [limit, setLimit] = useState(50);

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

  // Check if scroll is in the bottom and update limit if it is.
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setLimit(limit + 50);
    }
  };
  return (
    <>
      <h2 className="heading-secondary">Batch Information</h2>
      <div className="form">
        <GetAllBatchRequestsButton setFetchedRequests={setFetchedRequests} />
        <hr className="u-margin-top-small u-margin-bottom-small" />
        <input
          value={searchText}
          onChange={handleSearchTextChange}
          type="text"
          className="form__input"
          placeholder="Search Requests"
          style={{ width: 'fit-content' }}
        />
        {extraInfo !== '' ? (
          <>
            <p className="text text--info">{extraInfo}</p>
            <hr></hr>
          </>
        ) : null}
        <div
          onScroll={handleScroll}
          style={{ overflowY: 'scroll', maxHeight: `${specifyingCogParams ? '900px' : '600px'}` }}
        >
          {filteredRequests.length > 0 ? renderBatchRequestSummary(filteredRequests, limit, token) : null}
        </div>
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
