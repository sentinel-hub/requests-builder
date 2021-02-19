import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import store from '../../../store';
import savedRequestsSlice from '../../../store/savedRequests';
import alertSlice from '../../../store/alert';
import SavedRequestEntry from './SavedRequestEntry';
import ExportCollection from './ExportCollection';

const SavedRequests = ({ savedRequests, mode, expandedSidebar, token }) => {
  const handleExpand = () => {
    store.dispatch(savedRequestsSlice.actions.setExpandedSidebar(!expandedSidebar));
  };

  if (mode !== 'PROCESS') {
    return null;
  }

  const handleImportButtonClick = () => {
    const fileEl = document.getElementById('collection-file-input');
    fileEl.click();
  };

  const handleImport = async () => {
    const fileEl = document.getElementById('collection-file-input');
    const file = fileEl.files[0];
    const text = await file.text();
    try {
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          store.dispatch(savedRequestsSlice.actions.setCollection(parsed));
          store.dispatch(
            alertSlice.actions.addAlert({ type: 'SUCCESS', text: 'Collection upload successfully' }),
          );
        }
      }
    } catch (err) {
      store.dispatch(
        alertSlice.actions.addAlert({
          type: 'WARNING',
          text: 'Something went wrong while loading the collection',
        }),
      );
      console.error('Something went wrong while loading the collection: ', err);
    }
  };

  return (
    <div className="saved-requests-container">
      <div className="saved-requests-toggle">
        <div className="saved-requests-toggle__icon" onClick={handleExpand}>
          <span>Requests</span>
          <FontAwesomeIcon icon={expandedSidebar ? faAngleDoubleRight : faAngleDoubleLeft} />
        </div>
        {expandedSidebar && (
          <div className="saved-requests-body">
            {savedRequests.map((savedReq, idx) => (
              <SavedRequestEntry
                key={idx}
                request={savedReq.request}
                mode={savedReq.mode}
                name={savedReq.name}
                response={savedReq.response}
                creationTime={savedReq.creationTime}
                token={token}
                idx={idx}
              />
            ))}
            {savedRequests.length === 0 && (
              <p className="text">
                <span>Save a request to see it here!</span>
              </p>
            )}
            <p className="text u-margin-top-tiny u-margin-bottom-tiny">
              <span>
                <i>Note: Saved requests will disappear after refreshing or closing the page</i>
              </span>
              <span style={{ display: 'block' }}>
                <i> Export them to a local file to to save them.</i>
              </span>
            </p>
            <div className="u-flex-aligned">
              <ExportCollection savedRequests={savedRequests} />
              <input
                type="file"
                id="collection-file-input"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
              <button className="tertiary-button" onClick={handleImportButtonClick}>
                Upload collection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  savedRequests: state.savedRequests.savedRequests,
  expandedSidebar: state.savedRequests.expandedSidebar,
  mode: state.request.mode,
  token: state.auth.user.access_token,
});
export default connect(mapStateToProps)(SavedRequests);
