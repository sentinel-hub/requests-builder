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
    <div className="z-50 fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-50 flex justify-center items-center">
      <div
        ref={ref}
        className="bg-white w-80 h-fit flex flex-col items-center justify-center rounded-md p-8 shadow-xl"
      >
        <FontAwesomeIcon className="text-3xl text-yellow-600 m-3" icon={faExclamation} />
        {dialogText.split('\n').map((line, idx) => (
          <p key={idx} className="mb-2 text-center text-lg">
            {line}
          </p>
        ))}
        <div className="flex items-end w-full justify-evenly m-2">
          <button onClick={onConfirm} className="secondary-button w-20">
            Yes
          </button>
          <button onClick={onDecline} className="secondary-button secondary-button--cancel w-20">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
