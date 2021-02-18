import React, { useRef, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import responsesSlice from '../../store/responses';
import { useOnClickOutside } from '../../utils/hooks';
import Mousetrap from 'mousetrap';
import savedRequestsSlice from '../../store/savedRequests';

const OverlayResponse = ({ show, src, dimensions, error, fisResponse, isTar, request, mode }) => {
  const ref = useRef();
  const displaySaveRequestButton = request !== undefined && mode !== undefined;
  const [requestName, setRequestName] = useState('');
  const [hasSavedRequest, setHasSavedRequest] = useState(false);

  const closeHandler = useCallback(() => {
    store.dispatch(responsesSlice.actions.setShow(false));
    if (src && !hasSavedRequest) {
      URL.revokeObjectURL(src);
    }
    setRequestName('');
    setHasSavedRequest(false);
  }, [src, hasSavedRequest]);

  useEffect(() => {
    if (show) {
      Mousetrap.bind('escape', closeHandler);
      //Prevent scroll when is opened
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll
      document.body.style.overflow = 'auto';
      Mousetrap.unbind('escape', closeHandler);
    }
  }, [show, closeHandler]);

  useOnClickOutside(ref, closeHandler);

  const handleCloseClick = () => closeHandler();

  const handleNameRequestChange = (e) => {
    setRequestName(e.target.value);
  };

  const handleSaveRequest = (e) => {
    e.preventDefault();
    setHasSavedRequest(true);
    store.dispatch(
      savedRequestsSlice.actions.appendRequest({
        name: requestName,
        request,
        response: src,
        mode,
      }),
    );
  };

  const generateOverlayContents = () => {
    if (error) {
      return (
        <>
          <h2 className="heading-secondary u-margin-bottom-small">Something went wrong</h2>
          <p className="text">{error}</p>
        </>
      );
    }
    if (fisResponse) {
      return <textarea rows="30" cols="50" defaultValue={fisResponse} />;
    }
    return (
      <>
        {!isTar ? <img src={src} alt="response" /> : null}
        <a href={src} download>
          Click to download the response
        </a>
        {dimensions.length > 0 ? (
          <>
            <p className="text">
              <span>Meters per pixel on X axis:</span> {dimensions[0].toFixed(3)}
            </p>
            <p className="text">
              <span>Meters per pixel on Y axis:</span> {dimensions[1].toFixed(3)}
            </p>
          </>
        ) : null}
      </>
    );
  };

  return (
    <>
      {show ? (
        <div className="overlay-response">
          <div ref={ref} className="overlay-image-container">
            <span className="overlay-close" onClick={handleCloseClick}>
              &#x2715;
            </span>
            {generateOverlayContents()}
            {displaySaveRequestButton && (
              <form className="u-flex-column-centered" style={{ width: '50%' }} onSubmit={handleSaveRequest}>
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
                <div className="info-banner u-margin-top-tiny">
                  <p>
                    Saved requests will only last until the page is refreshed! Remember to save your requests
                    to local files before closing the tab.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  show: state.response.show,
  src: state.response.src,
  dimensions: state.response.dimensions,
  error: state.response.error,
  fisResponse: state.response.fisResponse,
  isTar: state.response.isTar,
  request: state.response.request,
  mode: state.response.mode,
});

export default connect(mapStateToProps)(OverlayResponse);
