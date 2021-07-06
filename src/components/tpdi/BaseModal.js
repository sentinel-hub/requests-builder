import React, { useRef, useState } from 'react';
import { useBind, useOnClickOutside, useScrollBlock } from '../../utils/hooks';

const BaseModal = ({ trigger, content }) => {
  const [active, setActive] = useState(false);
  const ref = useRef();
  const handleHide = () => {
    setActive(false);
  };
  useBind('esc', handleHide, active);
  useScrollBlock(active);
  useOnClickOutside(ref, handleHide);

  return (
    <>
      <div onClick={() => setActive(true)}>{trigger}</div>
      {active && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-gray-400 bg-opacity-50 z-50 flex items-center justify-center cursor-pointer">
          <div ref={ref} className="overlay-image-container">
            <span className="absolute top-3 right-2 cursor-pointer text-lg font-bold" onClick={handleHide}>
              &#x2715;
            </span>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default BaseModal;
