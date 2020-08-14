import React, { useRef, useEffect } from 'react';
import { createFileReader } from './SendRequest';
import RequestButton from './RequestButton';
import { calculatePixelSize } from '../utils/bboxRatio';
import store, { responsesSlice } from '../store';

//Abstraction of Request Button.
const CancelablePopUpRequestButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  requestState,
  useShortcut,
}) => {
  const readerRef = useRef();

  useEffect(() => {
    readerRef.current = createFileReader();
  }, []);

  const responseHandler = (response) => {
    const responseUrl = URL.createObjectURL(response);
    let dimensions;
    if (requestState && requestState.heightOrRes === 'HEIGHT') {
      dimensions = calculatePixelSize(requestState.geometry, [requestState.width, requestState.height]);
    }
    store.dispatch(
      responsesSlice.actions.setResponse({
        src: responseUrl,
        dimensions: dimensions,
        isTar: !response.type.includes('image'),
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
