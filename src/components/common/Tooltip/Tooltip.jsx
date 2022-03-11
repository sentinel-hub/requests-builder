import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/svg-arrow.css';

const Tooltip = ({ infoStyles, content, direction = 'right', wrapperClassName }) => {
  const [active, setActive] = useState(false);

  const handleShow = () => {
    setActive(!active);
  };
  const handleHide = () => {
    setActive(false);
  };
  const handleBack = (e) => {
    setActive(false);
  };
  return (
    <Tippy
      interactive
      delay={[0, 0]}
      content={
        <div
          className={`border-primary border rounded-lg py-2 px-3 z-50 bg-white ${
            wrapperClassName ?? ''
          } flex flex-col`}
        >
          {content}
          <button onClick={handleBack} className="secondary-button w-20 mt-2">
            Back
          </button>
        </div>
      }
      onClickOutside={handleHide}
      visible={active}
      placement={direction}
    >
      <button onClick={handleShow} className="w-6">
        <InformationCircleIcon className="w-6" style={infoStyles} />
      </button>
    </Tippy>
  );
};

export default Tooltip;
