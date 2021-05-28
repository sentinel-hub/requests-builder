import React, { useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import store from '../../../store';
import responsesSlice from '../../../store/responses';
import { useBind, useOnClickOutside, useScrollBlock } from '../../../utils/hooks';
import StatisticalResponseContainer from './StatisticalResponseContainer';
import SaveRequestForm from '../../process/Collections/SaveRequestForm';
import ImageResponse from './ImageResponse';

const SUPPORTED_SAVE_MODES = ['PROCESS', 'STATISTICAL'];

const shouldDisplaySaveRequestForm = (stringRequest, mode, isFromCollections) =>
  stringRequest !== undefined && SUPPORTED_SAVE_MODES.includes(mode) && !isFromCollections;

const OverlayResponse = ({
  displayResponse,
  error,
  imageResponse,
  fisResponse,
  stringRequest,
  mode,
  isFromCollections,
}) => {
  const ref = useRef();

  const [hasSavedRequest, setHasSavedRequest] = useState(false);
  const [hasBeenAddedToMap, setHasBeenAddedToMap] = useState(false);

  const { src } = imageResponse;

  const closeHandler = useCallback(() => {
    store.dispatch(responsesSlice.actions.setDisplayResponse(false));
    if (src && hasSavedRequest === false && !isFromCollections && hasBeenAddedToMap === false) {
      URL.revokeObjectURL(src);
    }
    setHasSavedRequest(false);
    setHasBeenAddedToMap(false);
  }, [hasSavedRequest, src, isFromCollections, hasBeenAddedToMap]);

  useBind('escape', closeHandler, displayResponse);
  useScrollBlock(displayResponse);
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
      return <StatisticalResponseContainer statisticalResponse={fisResponse} stringRequest={stringRequest} />;
    }
    return (
      <ImageResponse
        imageResponse={imageResponse}
        hasBeenAddedToMap={hasBeenAddedToMap}
        setHasBeenAddedToMap={setHasBeenAddedToMap}
      />
    );
  };

  return (
    <>
      {displayResponse ? (
        <div className="overlay-response">
          <div ref={ref} className="overlay-image-container">
            <span className="overlay-close" onClick={handleCloseClick}>
              &#x2715;
            </span>
            {shouldDisplaySaveRequestForm(stringRequest, mode, isFromCollections) && (
              <SaveRequestForm
                mode={mode}
                stringRequest={stringRequest}
                response={mode === 'PROCESS' ? src : fisResponse}
                hasSavedRequest={hasSavedRequest}
                setHasSavedRequest={setHasSavedRequest}
              />
            )}
            {generateOverlayContents()}
          </div>
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = ({ response }) => ({
  displayResponse: response.displayResponse,
  error: response.error,
  imageResponse: response.imageResponse,
  fisResponse: response.fisResponse,
  stringRequest: response.stringRequest,
  mode: response.mode,
  isFromCollections: response.isFromCollections,
});

export default connect(mapStateToProps)(OverlayResponse);
