import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../../utils/hooks';
import './Tooltip.css';

const Tooltip = (props) => {
  const [active, setActive] = useState(false);
  const ref = useRef();

  const handleShow = () => {
    setActive(true);
  };
  const handleHide = () => {
    setActive(false);
  };

  const handleBack = (e) => {
    e.stopPropagation();
    setActive(false);
  };

  useOnClickOutside(ref, handleHide);
  return (
    <div className="Tooltip-Wrapper" onClick={handleShow}>
      {props.children || (
        <span className="info" style={{ ...props.infoStyles }}>
          &#8505;
        </span>
      )}
      {active && (
        <div
          ref={ref}
          style={{ width: props.width || '300px' }}
          className={`Tooltip-Tip ${props.direction || 'top'}`}
        >
          {props.content}
          <div>
            <button onClick={handleBack} className="secondary-button">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
