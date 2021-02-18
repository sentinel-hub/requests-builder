import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOverlay } from '../../utils/hooks';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const OverlayButton = ({ elementRef }) => {
  const { openOverlay } = useOverlay(elementRef);
  return (
    <i className="clickable-icon" onClick={openOverlay}>
      <FontAwesomeIcon icon={faExpandArrowsAlt} />
    </i>
  );
};

export default OverlayButton;
