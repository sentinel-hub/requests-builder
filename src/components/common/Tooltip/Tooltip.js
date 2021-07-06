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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
      {active && (
        <div
          ref={ref}
          style={{ width: props.width || '300px' }}
          className={`Tooltip-Tip ${props.direction || 'top'} z-50 overflow-visible`}
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
