import React, { useState, useRef } from 'react';
import { useBind, useOnClickOutside, useScrollBlock } from '../../../utils/hooks';

const ExportCollection = ({ savedRequests }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const closeDialog = () => setIsDialogOpen(false);
  const dialogRef = useRef();
  useScrollBlock(isDialogOpen);
  useOnClickOutside(dialogRef, closeDialog);
  useBind('esc', closeDialog, isDialogOpen);

  const handleExport = (e) => {
    e.preventDefault();
    const exportedRequests = savedRequests.map((req) => ({ ...req, response: undefined }));
    const blob = new Blob([JSON.stringify(exportedRequests)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    let fakeLink = document.createElement('a');
    fakeLink.setAttribute('href', url);
    fakeLink.setAttribute('download', collectionName);
    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    closeDialog();
  };

  if (savedRequests.length === 0) {
    return null;
  }

  const handleCollectionNameChange = (e) => {
    setCollectionName(e.target.value);
  };

  const openDialog = () => setIsDialogOpen(true);

  if (isDialogOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center py-2 px-0 max-h-full">
        <form onSubmit={handleExport} className="w-1/2 bg-white cursor-auto p-4" ref={dialogRef}>
          <label className="form__label" required htmlFor="collection-name-input">
            Collection name
          </label>
          <input
            required
            className="form__input"
            id="collection-name-input"
            placeholder="Set your collection name"
            onChange={handleCollectionNameChange}
          />
          <button className="secondary-button" type="submit">
            Export
          </button>
        </form>
      </div>
    );
  }

  return (
    <button className="tertiary-button mr-1" onClick={openDialog}>
      Export
    </button>
  );
};

export default ExportCollection;
