import React, { useRef, useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import Mousetrap from 'mousetrap';
import ConfirmDialog from './ConfirmDialog';
import store from '../../store';
import requestSlice from '../../store/request';

//Abstraction of button that sends a request.
const RequestButton = ({
  buttonText,
  request,
  args,
  validation,
  className,
  additionalClassNames = [],
  responseHandler,
  errorHandler,
  disabledTitle,
  //allow shortcut (ctr+enter)
  useShortcut,
  // params to use ConfirmDialog.
  useConfirmation,
  dialogText,
  style,
  requestConfiguration = {},
  shouldTriggerIsRunningRequest = false,
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
      const usedArgs = args.length === 0 ? [null] : args;
      try {
        if (useConfirmation && openedConfirmDialog) {
          setOpenedConfirmDialog(false);
        }
        setIsFetching(true);
        if (shouldTriggerIsRunningRequest) {
          store.dispatch(requestSlice.actions.setIsRunningRequest(true));
        }
        sourceRef.current = Axios.CancelToken.source();
        const reqConfig = {
          ...requestConfiguration,
          cancelToken: sourceRef.current.token,
        };
        const res = await request(...usedArgs, reqConfig);
        if (res.data || res.status === 204) {
          setIsFetching(false);
          await responseHandler(res.data, res.config?.data);
          if (shouldTriggerIsRunningRequest) {
            store.dispatch(requestSlice.actions.setIsRunningRequest(false));
          }
        }
      } catch (err) {
        if (shouldTriggerIsRunningRequest) {
          store.dispatch(requestSlice.actions.setIsRunningRequest(false));
        }
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
    // eslint-disable-next-line
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
    let cl;
    if (!validation) {
      cl = className + '--disabled';
    } else if (validation && isFetching) {
      cl = className + '--cancel';
    } else if (validation && !isFetching) {
      cl = className + '--active';
    }
    return cl + ' ' + additionalClassNames.join(' ');
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
