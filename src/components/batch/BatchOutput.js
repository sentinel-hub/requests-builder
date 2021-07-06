import React from 'react';
import OutputResponses from '../common/Output/OutputResponses';

const BatchOutput = () => {
  return (
    <>
      <h2 className="heading-secondary mt-2">Responses</h2>
      <div className="form h-full xl:h-92 overflow-y-auto xl:overflow-y-scroll">
        <OutputResponses />
      </div>
    </>
  );
};

export default BatchOutput;
