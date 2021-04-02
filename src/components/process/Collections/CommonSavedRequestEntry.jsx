import React from 'react';
import moment from 'moment';

export const CommonSavedRequestEntryFields = ({ name, creationTime, mode }) => {
  return (
    <>
      {name && (
        <p className="text">
          <span>Name: </span>
          {name}
        </p>
      )}
      {creationTime && (
        <p className="text">
          <span>Created: </span>
          {moment
            .unix(creationTime / 1000)
            .utc()
            .format()
            .replace('T', ' ')
            .replace('Z', '')}
        </p>
      )}
      {
        <p className="text">
          <span>Mode: </span>
          {mode}
        </p>
      }
    </>
  );
};
