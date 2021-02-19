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
        <div className="overlay-response">
          <div ref={ref} className="overlay-image-container">
            <span className="overlay-close" onClick={handleHide}>
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
