import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { dispatchChanges } from '../process/requests/parseRequest';

const SavedRequests = ({ savedRequests, mode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded((exp) => !exp);
  };

  if (mode !== 'PROCESS') {
    return null;
  }

  return (
    <div className="saved-requests-container">
      <div className="saved-requests-toggle">
        <div className="saved-requests-toggle__icon" onClick={handleExpand}>
          <FontAwesomeIcon icon={isExpanded ? faArrowRight : faArrowLeft} />
        </div>
        {isExpanded && (
          <div className="saved-requests-body">
            {savedRequests.map((savedReq, idx) => (
              <SavedRequest
                key={idx}
                request={savedReq.request}
                mode={savedReq.mode}
                name={savedReq.name}
                response={savedReq.response}
                creationTime={savedReq.creationTime}
              />
            ))}
            {savedRequests.length === 0 && (
              <p className="text">
                <span>Save a request to see it here!</span>
              </p>
            )}
            <p className="text u-margin-top-tiny">
              <span>
                <i>Note: Saved requests will disappear after refreshing or closing the page.</i>
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SavedRequest = ({ request, response, creationTime, mode, name }) => {
  const handleParse = () => {
    if (mode === 'PROCESS') {
      try {
        dispatchChanges(JSON.parse(request));
      } catch (err) {
        console.error('Something went wrong while parsing the request');
      }
    }
  };
  return (
    <div className="saved-request-entry">
      {name && (
        <p className="text">
          <span>Name: </span>
          {name}
        </p>
      )}
      <p className="text">
        <span>Created: </span>
        {moment
          .unix(creationTime / 1000)
          .utc()
          .format()
          .replace('T', ' ')
          .replace('Z', '')}
      </p>
      <div className="u-flex-aligned u-margin-top-tiny">
        <p className="text">
          <span>Request:</span>
        </p>
        <button
          className="tertiary-button u-margin-right-tiny"
          onClick={() => navigator.clipboard.writeText(request)}
        >
          Copy
        </button>
        <button className="tertiary-button" onClick={handleParse}>
          Parse
        </button>
      </div>
      <p className="text u-margin-top-tiny">
        <span>Response: </span>
        <a href={response} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      </p>
      <hr className="u-margin-top-tiny u-margin-bottom-tiny" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  savedRequests: state.savedRequests.savedRequests,
  mode: state.request.mode,
});
export default connect(mapStateToProps)(SavedRequests);
