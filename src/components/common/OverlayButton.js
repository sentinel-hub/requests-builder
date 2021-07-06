import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOverlayComponent } from '../../utils/hooks';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const OverlayButton = ({ elementRef }) => {
  const { openOverlay } = useOverlayComponent(elementRef);
  return (
    <i className="cursor-pointer flex items-center" onClick={openOverlay}>
      <FontAwesomeIcon icon={faExpandArrowsAlt} />
    </i>
  );
};

export default OverlayButton;
