import React, { useRef, useEffect } from 'react';
import { useOnClickOutside } from '../../utils/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import Mousetrap from 'mousetrap';

const ConfirmDialog = ({ dialogText, onConfirm, onDecline }) => {
  const ref = useRef();

  // on click outside, decline.
  useOnClickOutside(ref, onDecline);

  useEffect(() => {
    //prevent scroll when modal is open
    document.body.style.overflow = 'hidden';
    //bind escape to onDecline
    Mousetrap.bind('escape', onDecline);
    return () => {
      //restore scroll when unmounting.
      document.body.style.overflow = 'auto';
      //unbind escape
      Mousetrap.unbind('escape', onDecline);
    };
  }, [onDecline]);

  return (
    <div className="confirm-dialog">
      <div ref={ref} className="confirm-dialog-container">
        <FontAwesomeIcon className="confirm-dialog-icon" icon={faExclamation} />
        {dialogText.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
        <div className="confirm-dialog-buttons">
          <button onClick={onConfirm} className="secondary-button">
            Yes
          </button>
          <button onClick={onDecline} className="secondary-button secondary-button--cancel">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
