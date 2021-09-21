import React, { useState } from 'react';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import store from '../../../store';
import savedRequestsSlice from '../../../store/savedRequests';
import BaseModal from '../../tpdi/BaseModal';
import { isUnnamedCollectionName } from './SavedRequests';

const SavedCollectionHeader = ({ primaryKey, collectionName, isExpanded, setIsExpanded }) => {
  const handleExpandCollection = () => setIsExpanded((prev) => !prev);
  const [collectionRename, setCollectionRename] = useState(collectionName);
  const [isEditing, setIsEditing] = useState(false);
  const handleEditName = () => {
    store.dispatch(
      savedRequestsSlice.actions.setCollectionName({ collectionName, newName: collectionRename }),
    );
    setIsEditing(false);
  };
  const handleChangeRename = (e) => {
    setCollectionRename(e.target.value);
  };
  const handleStartEditing = (e) => {
    e.stopPropagation();
    if (isEditing) {
      setCollectionRename(collectionName);
    }
    setIsEditing((prev) => !prev);
  };
  const handleCancelEdit = () => {
    setCollectionRename(collectionName);
    setIsEditing(false);
  };
  const handleRemoveCollection = (handleClose) => () => {
    store.dispatch(savedRequestsSlice.actions.removeCollection({ primaryKey }));
    handleClose();
  };
  const isUnnamed = isUnnamedCollectionName(collectionName);
  return (
    <div className="bg-primary-light cursor-pointer p-2 hover:bg-primary" onClick={handleExpandCollection}>
      <div
        className="flex justify-between items-center"
        onClick={(e) => {
          if (isEditing) {
            e.stopPropagation();
          }
        }}
      >
        {isEditing ? (
          <input
            className="form__input mr-2"
            type="text"
            value={collectionRename}
            onChange={handleChangeRename}
            autoFocus
          />
        ) : (
          <p className="overflow-ellipsis whitespace-nowrap overflow-hidden" style={{ width: '200px' }}>
            {isUnnamed && (
              <span
                className="text-red-800 font-bold mr-2 bg-red-400 px-2 py-1 rounded-md"
                title="Please add a valid name to the collection"
              >
                !
              </span>
            )}
            {collectionName}
          </p>
        )}
        {isExpanded ? <ChevronDoubleUpIcon className="w-5" /> : <ChevronDoubleDownIcon className="w-5" />}
        {isEditing ? (
          <>
            <button onClick={handleEditName} className="secondary-button hover:bg-primary-dark mx-2">
              <CheckIcon className="w-5" />
            </button>
            <button onClick={handleCancelEdit} className="secondary-button hover:bg-primary-dark">
              <XIcon className="w-5" />
            </button>
          </>
        ) : (
          <button
            className="secondary-button hover:bg-primary-dark"
            onClick={handleStartEditing}
            title="Edit the collection name"
          >
            <PencilIcon className="w-5" />
          </button>
        )}
        {!isEditing && (
          <BaseModal
            trigger={
              <button className="secondary-button hover:bg-primary-dark mt-1" title="Remove the collection">
                <TrashIcon className="w-5" />
              </button>
            }
            content={(handleClose) => (
              <div className="flex flex-col justify-center h-full mt-6" onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to delete this collection</p>

                <div className="flex items-center justify-center mt-3">
                  <button className="secondary-button mr-4" onClick={handleRemoveCollection(handleClose)}>
                    Remove
                  </button>
                  <button className="secondary-button secondary-button--cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SavedCollectionHeader;
