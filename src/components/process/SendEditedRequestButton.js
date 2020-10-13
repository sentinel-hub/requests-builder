import React, { useRef, useEffect } from 'react';
import RequestButton from '../common/RequestButton';
import { sendEditedRequest } from './requests';
import store, { responsesSlice } from '../../store';
import { createFileReader } from './SendRequest';

const responseHandler = (response) => {
  const responseUrl = URL.createObjectURL(response);
  store.dispatch(
    responsesSlice.actions.setResponse({
      src: responseUrl,
      isTar: !response.type.includes('image'),
    }),
  );
};
const SendEditedRequestButton = ({ text, token }) => {
  const readerRef = useRef();

  useEffect(() => {
    readerRef.current = createFileReader();
  }, []);

  const errorHandler = (err) => {
    if (err.response) {
      readerRef.current.readAsText(err.response.data);
    } else {
      console.error('Something went wrong.', err);
    }
  };

  return (
    <div>
      <RequestButton
        buttonText="Send Edited Request"
        request={sendEditedRequest}
        args={[token, text]}
        responseHandler={responseHandler}
        className="secondary-button"
        validation={Boolean(text && token)}
        errorHandler={errorHandler}
      />
    </div>
  );
};

export default SendEditedRequestButton;
