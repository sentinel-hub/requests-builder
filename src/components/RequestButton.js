import React, { useRef, useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import Mousetrap from 'mousetrap';

//Abstraction of button that sends a request. To be implemented on the main Send Request (ProcessAPI)
const RequestButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  responseHandler,
  errorHandler,
  disabledTitle,
  useShortcut,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const sourceRef = useRef();

  useEffect(() => {
    return () => {
      Mousetrap.reset();
      if (sourceRef.current) {
        sourceRef.current.cancel();
      }
    };
  }, []);

  const handleSendRequest = useCallback(async () => {
    if (isFetching) {
      sourceRef.current.cancel();
    } else {
      try {
        setIsFetching(true);
        sourceRef.current = Axios.CancelToken.source();
        const reqConfig = {
          cancelToken: sourceRef.current.token,
        };
        const res = await request(...args, reqConfig);
        if (res.data || res.status === 204) {
          setIsFetching(false);
          responseHandler(res.data);
        }
      } catch (err) {
        setIsFetching(false);
        if (!Axios.isCancel(err)) {
          if (errorHandler) {
            errorHandler(err);
          } else {
            console.error(err);
          }
        }
      }
    }
  }, [isFetching, args, request, errorHandler, responseHandler]);

  //Mousetrap effect, binds
  useEffect(() => {
    if (useShortcut) {
      Mousetrap.bind('ctrl+enter', () => {
        if (validation) {
          handleSendRequest();
        }
      });
      //Prevent default behaviour allowing using shortcuts in forms, textareas, etc.
      Mousetrap.prototype.stopCallback = () => false;
    }
  }, [useShortcut, handleSendRequest, validation]);

  const generateClassName = () => {
    if (!validation) {
      return className + '--disabled';
    } else if (validation && isFetching) {
      return className + '--cancel';
    } else if (validation && !isFetching) {
      return className + '--active';
    }
  };

  return (
    <button
      className={`${className} ${generateClassName()}`}
      disabled={!validation}
      onClick={handleSendRequest}
      title={!validation ? disabledTitle : null}
    >
      {isFetching ? 'Cancel Request' : buttonText}
    </button>
  );
};

export default RequestButton;
