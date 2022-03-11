import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { closeConfirmationModal } from '../../../store/modal';
import { useBind, useOnClickOutside, useScrollBlock } from '../../../utils/hooks';

const ConfirmationModal = ({ isOpen, onConfirm, content }) => {
  const ref = useRef();
  useScrollBlock(isOpen);
  useOnClickOutside(ref, closeConfirmationModal);
  useBind('escape', closeConfirmationModal, isOpen);

  if (!isOpen) {
    return null;
  }

  const handleProceed = () => {
    onConfirm();
    closeConfirmationModal();
  };

  return (
    <div className="overlay-container">
      <div ref={ref} className="bg-white rounded-md w-1/2 h-1/2 flex flex-col items-center justify-center">
        {content}
        <div className="flex items-center mt-4">
          <button className="secondary-button secondary-button--cancel mr-2" onClick={closeConfirmationModal}>
            Cancel
          </button>
          <button className="secondary-button" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isOpen: state.modal.isOpen,
  onConfirm: state.modal.onConfirm,
  content: state.modal.content,
});

export default connect(mapStateToProps)(React.memo(ConfirmationModal));
