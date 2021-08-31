import React, { useRef, useEffect } from 'react';
import { createFileReader } from '../process/SendRequest';
import RequestButton from './RequestButton';
import store from '../../store';
import responsesSlice from '../../store/responses';
import savedRequestsSlice from '../../store/savedRequests';
import { calculatePixelSize } from './Map/utils/bboxRatio';
import { errorProcessReqEvent, successfulProcessReqEvent } from '../../utils/initAnalytics';

//Abstraction of Request Button.
const ProcessRequestOverlayButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  additionalClassNames,
  requestState,
  collectionRequestIdx,
  wgs84Geometry,
  reqConfig,
  skipSaving = true,
  useShortcut,
}) => {
  const readerRef = useRef();
  const shouldDisplayDimensions =
    requestState?.heightOrRes === 'HEIGHT' ||
    (requestState?.heightOrRes === 'RES' && requestState?.isOnAutoRes);

  useEffect(() => {
    readerRef.current = createFileReader();
  }, []);

  const responseHandler = async (response, stringRequest) => {
    successfulProcessReqEvent();
    const responseUrl = URL.createObjectURL(response);
    let dimensions;
    if (shouldDisplayDimensions) {
      dimensions = calculatePixelSize(wgs84Geometry, [requestState.width, requestState.height]);
    }
    const isFromCollections = collectionRequestIdx !== undefined ? true : false;
    let arrayBuffer;
    if (response.type.includes('tif')) {
      arrayBuffer = await response.arrayBuffer();
    }
    store.dispatch(
      responsesSlice.actions.setImageResponse({
        src: responseUrl,
        format: response.type,
        wgs84Geometry,
        stringRequest,
        mode: 'PROCESS',
        displayResponse: true,
        dimensions,
        isFromCollections,
        arrayBuffer,
      }),
    );
    if (isFromCollections) {
      store.dispatch(
        savedRequestsSlice.actions.setResponse({ idx: collectionRequestIdx, response: responseUrl }),
      );
    }
  };

  const errorHandler = (err) => {
    errorProcessReqEvent();
    if (err.response) {
      readerRef.current.readAsText(err.response.data);
    } else {
      console.error('Something went wrong.', err);
    }
  };

  return (
    <RequestButton
      className={className}
      additionalClassNames={additionalClassNames}
      buttonText={buttonText}
      request={request}
      args={[...args]}
      validation={validation}
      responseHandler={responseHandler}
      errorHandler={errorHandler}
      useShortcut={useShortcut}
      requestConfiguration={reqConfig}
      shouldTriggerIsRunningRequest
    />
  );
};

export default ProcessRequestOverlayButton;
