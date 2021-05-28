import React, { useState } from 'react';
import store from '../../../store';
import savedRequestsSlice from '../../../store/savedRequests';

const SaveRequestForm = ({ stringRequest, response, mode, hasSavedRequest, setHasSavedRequest }) => {
  const [requestName, setRequestName] = useState('');

  const handleSaveRequest = (e) => {
    e.preventDefault();
    setHasSavedRequest(true);
    store.dispatch(
      savedRequestsSlice.actions.appendRequest({
        name: requestName,
        request: stringRequest,
        response,
        mode,
      }),
    );
  };

  const handleNameRequestChange = (e) => {
    setRequestName(e.target.value);
  };
  return (
    <div className="save-request-form">
      <form className="u-flex-column-centered" style={{ width: '70%' }} onSubmit={handleSaveRequest}>
        <label className="form__label u-margin-top-small" htmlFor="name-request-input">
          Request name (optional)
        </label>
        <input
          autoComplete="off"
          value={requestName}
          type="text"
          placeholder="Add an optional name to your saved request"
          className="form__input"
          id="name-request-input"
          onChange={handleNameRequestChange}
        />
        <button
          className={`secondary-button ${hasSavedRequest ? 'secondary-button--disabled' : ''}`}
          type="submit"
        >
          {hasSavedRequest ? 'Saved' : 'Save Request'}
        </button>
      </form>
      <div className="info-banner u-margin-top-tiny">
        <p>
          Saved requests will only last until the page is refreshed! Remember to export your requests before
          closing the tab.
        </p>
      </div>
    </div>
  );
};

export default SaveRequestForm;
