import React, { useRef, useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import Mousetrap from 'mousetrap';
import ConfirmDialog from './ConfirmDialog';

//Abstraction of button that sends a request.
const RequestButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  responseHandler,
  errorHandler,
  disabledTitle,
  //allow shortcut (ctr+enter)
  useShortcut,
  // params to use ConfirmDialog.
  useConfirmation,
  dialogText,
  style,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [openedConfirmDialog, setOpenedConfirmDialog] = useState(false);
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
      setIsFetching(false);
    } else if (useConfirmation && !openedConfirmDialog) {
      setOpenedConfirmDialog(true);
    } else {
      try {
        if (useConfirmation && openedConfirmDialog) {
          setOpenedConfirmDialog(false);
        }
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
        if (!Axios.isCancel(err)) {
          setIsFetching(false);
          if (errorHandler) {
            errorHandler(err);
          } else {
            console.error(err);
          }
        }
      }
    }
  }, [isFetching, args, request, errorHandler, responseHandler, openedConfirmDialog, useConfirmation]);

  const handleCloseDialog = () => {
    setOpenedConfirmDialog(false);
  };

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
    <>
      <button
        className={`${className} ${generateClassName()}`}
        disabled={!validation}
        onClick={handleSendRequest}
        title={!validation ? disabledTitle : null}
        style={style}
      >
        {isFetching ? 'Cancel Request' : buttonText}
      </button>
      {useConfirmation && openedConfirmDialog ? (
        <ConfirmDialog onConfirm={handleSendRequest} onDecline={handleCloseDialog} dialogText={dialogText} />
      ) : null}
    </>
  );
};

export default RequestButton;
