import React from 'react';
import OutputResponses from '../common/Output/OutputResponses';

const BatchOutput = () => {
  return (
    <>
      <h2 className="heading-secondary u-margin-top-small">Responses</h2>
      <div className="form batch-responses">
        <OutputResponses />
      </div>
    </>
  );
};

export default BatchOutput;
