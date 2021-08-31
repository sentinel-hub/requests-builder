import React from 'react';
import TabBox from './TabBox';

const EvalscriptAdditionalFunctions = ({ additionalFunctions, setAdditionalFunctions }) => {
  const handleAddAdditionalFunction = (e) => {
    const value = e.target.value;
    setAdditionalFunctions((prev) => {
      if (!prev.includes(value)) {
        return prev.concat(value);
      } else {
        return prev.filter((val) => val !== value);
      }
    });
  };

  return (
    <div className="my-2">
      <TabBox title="Additional Functions">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={additionalFunctions.includes('updateOutputMetadata')}
            value="updateOutputMetadata"
            onChange={handleAddAdditionalFunction}
            className="mr-1"
            id="updateOutputMetadata"
          />
          <label className="form__label mr-3 cursor-pointer" htmlFor="updateOutputMetadata">
            updateOutputMetadata
          </label>
          <input
            type="checkbox"
            checked={additionalFunctions.includes('preProcessScenes')}
            value="preProcessScenes"
            onChange={handleAddAdditionalFunction}
            className="mr-1"
            id="preProcessScenes"
          />
          <label className="form__label mr-3 cursor-pointer" htmlFor="preProcessScenes">
            preProcessScenes
          </label>
        </div>
      </TabBox>
    </div>
  );
};

export default EvalscriptAdditionalFunctions;
