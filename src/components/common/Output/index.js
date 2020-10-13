import React from 'react';
import OutputDimensions from './OutputDimensions';
import OutputResponses from './OutputResponses';

const Output = () => {
  return (
    <>
      <h2 className="heading-secondary">Output</h2>
      <div className="form">
        <OutputDimensions />
        <OutputResponses />
      </div>
    </>
  );
};

export default Output;
