import React, { useRef, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import store, { responsesSlice } from '../store';
import { useOnClickOutside } from '../utils/hooks';
import Mousetrap from 'mousetrap';

const OverlayResponse = ({ show, src, dimensions, error, fisResponse, isTar }) => {
  const ref = useRef();

  const closeHandler = useCallback(() => {
    store.dispatch(responsesSlice.actions.setShow(false));
    if (src) {
      URL.revokeObjectURL(src);
    }
  }, [src]);

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
          Click to download the reponse
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
});

export default connect(mapStateToProps)(OverlayResponse);
