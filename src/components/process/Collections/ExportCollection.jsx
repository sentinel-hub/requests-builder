import React, { useState, useRef } from 'react';
import { useBind, useOnClickOutside, useScrollBlock } from '../../../utils/hooks';

export const collectionToExportCollection = (collection) => {
  const requestsWithoutResponses = collection.requests.map((req) => {
    // Keep statistical response
    if (req.response && req.mode === 'PROCESS') {
      const { response, ...withOutResponse } = req;
      return withOutResponse;
    }
    return req;
  });
  return { ...collection, requests: requestsWithoutResponses };
};

const ExportCollection = ({ savedCollections }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const closeDialog = () => setIsDialogOpen(false);
  const dialogRef = useRef();
  useScrollBlock(isDialogOpen);
  useOnClickOutside(dialogRef, closeDialog);
  useBind('esc', closeDialog, isDialogOpen);

  const handleExport = (e) => {
    e.preventDefault();
    const exportedCollections = savedCollections.map(collectionToExportCollection);
    const blob = new Blob([JSON.stringify(exportedCollections)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    let fakeLink = document.createElement('a');
    fakeLink.setAttribute('href', url);
    fakeLink.setAttribute('download', fileName);
    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    closeDialog();
    URL.revokeObjectURL(blob);
  };

  if (savedCollections.length === 0) {
    return null;
  }

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const openDialog = () => setIsDialogOpen(true);

  if (isDialogOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full bg-gray-700 bg-opacity-50 z-50 flex items-center justify-center py-2 px-0 max-h-full">
        <form
          onSubmit={handleExport}
          className="w-1/2 bg-white cursor-auto p-4 flex flex-col"
          ref={dialogRef}
        >
          <label className="form__label" required htmlFor="file-name-input">
            File name
          </label>
          <input
            required
            className="form__input mb-2"
            id="file-name-input"
            placeholder="Set your file name"
            onChange={handleFileNameChange}
          />
          <button className="secondary-button w-20" type="submit">
            Export
          </button>
        </form>
      </div>
    );
  }

  return (
    <button className="tertiary-button mr-1 mt-2" onClick={openDialog}>
      Export
    </button>
  );
};

export default ExportCollection;
