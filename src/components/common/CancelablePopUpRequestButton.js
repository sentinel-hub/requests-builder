import React, { useRef, useEffect } from 'react';
import { createFileReader } from '../process/SendRequest';
import RequestButton from './RequestButton';
import { calculatePixelSize } from './Map/utils/bboxRatio';
import store from '../../store';
import responsesSlice from '../../store/responses';

//Abstraction of Request Button.
const CancelablePopUpRequestButton = ({ buttonText, request, args, validation, className, requestState }) => {
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
    store.dispatch(
      responsesSlice.actions.setResponse({
        src: responseUrl,
        dimensions: dimensions,
        isTar: !response.type.includes('image'),
        request: stringRequest,
        mode: 'PROCESS',
      }),
    );
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

export default CancelablePopUpRequestButton;
