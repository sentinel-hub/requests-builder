import React, { useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import responsesSlice from '../../../store/responses';
import { useBind, useOnClickOutside, useScrollBlock } from '../../../utils/hooks';
import StatisticalResponseContainer from './StatisticalResponseContainer';
import SaveRequestForm from '../../process/Collections/SaveRequestForm';
import ImageResponse from './ImageResponse';

const OverlayResponse = ({
  show,
  src,
  dimensions,
  error,
  fisResponse,
  isTar,
  request,
  mode,
  isFromCollections,
}) => {
  const ref = useRef();
  const displaySaveRequestForm = request !== undefined && mode !== undefined && !isFromCollections;
  const [hasSavedRequest, setHasSavedRequest] = useState(false);

  const closeHandler = useCallback(() => {
    store.dispatch(responsesSlice.actions.setShow(false));
    if (src && hasSavedRequest === false && !isFromCollections) {
      URL.revokeObjectURL(src);
    }
    setHasSavedRequest(false);
  }, [hasSavedRequest, src, isFromCollections]);

  useBind('escape', closeHandler, show);
  useScrollBlock(show);
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
      return <StatisticalResponseContainer statisticalResponse={fisResponse} request={request} />;
    }
    return <ImageResponse dimensions={dimensions} isTar={isTar} src={src} />;
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
            {displaySaveRequestForm && (
              <SaveRequestForm
                mode={mode}
                request={request}
                response={mode === 'PROCESS' ? src : fisResponse}
                hasSavedRequest={hasSavedRequest}
                setHasSavedRequest={setHasSavedRequest}
              />
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
  isFromCollections: state.response.isFromCollections,
});

export default connect(mapStateToProps)(OverlayResponse);
