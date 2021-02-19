import React, { useRef, useEffect } from 'react';
import { createFileReader } from '../process/SendRequest';
import RequestButton from './RequestButton';
import { calculatePixelSize } from './Map/utils/bboxRatio';
import store from '../../store';
import responsesSlice from '../../store/responses';
import savedRequestsSlice from '../../store/savedRequests';

//Abstraction of Request Button.
const ProcessRequestOverlayButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  requestState,
  collectionRequestIdx,
  skipSaving = true,
}) => {
  const readerRef = useRef();
  const shouldDisplayDimensions =
    requestState &&
    (requestState.heightOrRes === 'HEIGHT' ||
      (requestState.heightOrRes === 'RES' && requestState.isOnAutoRes));

  useEffect(() => {
    readerRef.current = createFileReader();
  }, []);

  const responseHandler = (response, stringRequest) => {
    const responseUrl = URL.createObjectURL(response);
    let dimensions;
    if (shouldDisplayDimensions) {
      dimensions = calculatePixelSize(requestState.geometry, [requestState.width, requestState.height]);
    }
    const isFromCollections = collectionRequestIdx !== undefined ? true : false;
    const saveRequestData = skipSaving ? {} : { request: stringRequest, mode: 'PROCESS', isFromCollections };
    store.dispatch(
      responsesSlice.actions.setResponse({
        src: responseUrl,
        dimensions: dimensions,
        isTar: !response.type.includes('image'),
        ...saveRequestData,
      }),
    );
    if (isFromCollections) {
      store.dispatch(savedRequestsSlice.actions.setResponse({ idx: collectionRequestIdx, responseUrl }));
    }
  };

  const errorHandler = (err) => {
    if (err.response) {
      readerRef.current.readAsText(err.response.data);
    } else {
      console.error('Something went wrong.', err);
    }
  };

  return (
    <RequestButton
      className={className}
      buttonText={buttonText}
      request={request}
      args={args}
      validation={validation}
      responseHandler={responseHandler}
      errorHandler={errorHandler}
      useShortcut={true}
    />
  );
};

export default ProcessRequestOverlayButton;
