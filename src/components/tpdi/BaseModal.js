import React, { useEffect, useRef, useState } from 'react';
import Mousetrap from 'mousetrap';
import { useOnClickOutside } from '../../utils/hooks';

const BaseModal = ({ trigger, content }) => {
  const [active, setActive] = useState(false);
  const ref = useRef();
  const handleHide = () => {
    setActive(false);
  };

  // Block scroll and bind escape to close.
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
      Mousetrap.bind('escape', handleHide);
    } else {
      document.body.style.overflow = 'auto';
      Mousetrap.unbind('escape', handleHide);
    }
  }, [active]);

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
