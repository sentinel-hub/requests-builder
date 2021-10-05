import React from 'react';
import { useDidMountEffect } from '../../../../utils/hooks';
import RadioSelector from '../../RadioSelector';
import { OUTPUT_DOCS } from './const';
import TabBox from './TabBox';

export const INITIAL_OUTPUT_STATE = {
  bands: '',
  sampleType: 'AUTO',
  noDataValue: '',
};

const SAMPLE_TYPE_OPTIONS = [
  { name: 'UINT8', value: 'UINT8' },
  { name: 'UINT16', value: 'UINT16' },
  { name: 'FLOAT32', value: 'FLOAT32' },
  { name: 'AUTO (default)', value: 'AUTO' },
];
export const buildFullOutputState = (outputState, filteredResponses) => {
  return Array.from({ length: Math.min(outputState.length, filteredResponses.length) }).map((_, idx) => ({
    ...outputState[idx],
    id: filteredResponses[idx]['identifier'],
  }));
};

const EvalscriptOutput = ({ outputState, setOutputState, filteredResponses }) => {
  useDidMountEffect(() => {
    if (filteredResponses.length > outputState.length) {
      setOutputState((prev) => [...prev, INITIAL_OUTPUT_STATE]);
    } else if (filteredResponses.length < outputState.length) {
      setOutputState((prev) => prev.slice(0, -1));
    }
  }, [filteredResponses.length, outputState.length, setOutputState]);
  const handleOutputChange = (idx) => (field) => (validation) => (e) => {
    if (validation && validation(e) === false) {
      return;
    }
    const val = e.target.value;
    setOutputState((prev) => {
      const newOutput = { ...prev[idx], [field]: val };
      return prev
        .slice(0, idx)
        .concat(newOutput)
        .concat(prev.slice(idx + 1));
    });
  };

  return (
    <TabBox title="output" documentationLink={OUTPUT_DOCS} className="flex flex-col mb-3">
      {Array.from({ length: Math.min(outputState.length, filteredResponses.length) }).map((_, idx) => (
        <div key={`output-${idx}`}>
          {idx > 0 && <hr className="my-2 border border-primary" />}
          <div className="flex items-center mb-2">
            <label className="form__label mr-3">id</label>
            <input type="text" value={outputState[idx]['id']} className="form__input w-32" disabled />
          </div>
          <div className="flex items-center">
            <label className="form__label mr-3">bands *</label>
            <input
              className="form__input w-32"
              type="number"
              onChange={handleOutputChange(idx)('bands')((e) => e.target.value >= 0)}
              value={outputState[idx]['bands']}
            />
          </div>
          <div className="flex mt-2">
            <label className="form__label mr-5">sampleType</label>
            <RadioSelector
              options={SAMPLE_TYPE_OPTIONS}
              onChange={handleOutputChange(idx)('sampleType')()}
              value={outputState[idx]['sampleType']}
            />
          </div>
          <div className="flex items-center my-2">
            <label className="form__label mr-3" htmlFor="nodatavalue">
              noDataValue (optional)
            </label>
            <input
              className="form__input w-32"
              type="text"
              onChange={handleOutputChange(idx)('noDataValue')()}
              value={outputState[idx]['noDataValue']}
            />
          </div>
        </div>
      ))}
    </TabBox>
  );
};

export default EvalscriptOutput;
