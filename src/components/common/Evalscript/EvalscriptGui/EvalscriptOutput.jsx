import React, { useEffect } from 'react';
import { OUTPUT_DOCS } from './const';
import TabBox from './TabBox';

export const INITIAL_OUTPUT_STATE = {
  bands: '',
  sampleType: 'AUTO',
  noDataValue: '',
};

export const buildFullOutputState = (outputState, filteredResponses) => {
  return filteredResponses.map((output, idx) => ({ ...outputState[idx], id: output['identifier'] }));
};

const EvalscriptOutput = ({ outputState, setOutputState, filteredResponses }) => {
  useEffect(() => {
    if (filteredResponses.length > outputState.length) {
      setOutputState((prev) => [...prev, INITIAL_OUTPUT_STATE]);
    } else if (filteredResponses.length < outputState.length) {
      setOutputState((prev) => prev.slice(0, -1));
    }
  }, [filteredResponses.length, outputState.length, setOutputState]);
  const handleOutputChange = (idx) => (field) => (e) => {
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
              type="text"
              onChange={handleOutputChange(idx)('bands')}
              value={outputState[idx]['bands']}
            />
          </div>
          <div className="flex mt-2">
            <label className="form__label mr-5">sampleType</label>
            <div className="grid grid-cols-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="UINT8"
                  onChange={handleOutputChange(idx)('sampleType')}
                  id={`uint8-${idx}`}
                  checked={outputState[idx]['sampleType'] === 'UINT8'}
                  className="mr-2"
                />
                <label className="form__label" htmlFor={`uint8-${idx}`}>
                  UINT8
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  value="UINT16"
                  onChange={handleOutputChange(idx)('sampleType')}
                  id={`uint16-${idx}`}
                  checked={outputState[idx]['sampleType'] === 'UINT16'}
                  className="mr-2"
                />
                <label className="form__label" htmlFor={`uint16-${idx}`}>
                  UINT16
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  value="FLOAT32"
                  onChange={handleOutputChange(idx)('sampleType')}
                  id={`float32-${idx}`}
                  checked={outputState[idx]['sampleType'] === 'FLOAT32'}
                  className="mr-2"
                />
                <label className="form__label" htmlFor={`float32-${idx}`}>
                  FLOAT32
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  value="AUTO"
                  onChange={handleOutputChange(idx)('sampleType')}
                  id={`sampletype-auto-${idx}`}
                  checked={outputState[idx]['sampleType'] === 'AUTO'}
                  className="mr-2"
                />
                <label className="form__label" htmlFor={`sampletype-auto-${idx}`}>
                  AUTO (default)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center my-2">
            <label className="form__label mr-3" htmlFor="nodatavalue">
              noDataValue (optional)
            </label>
            <input
              className="form__input w-32"
              type="text"
              onChange={handleOutputChange(idx)('noDataValue')}
              value={outputState[idx]['noDataValue']}
            />
          </div>
        </div>
      ))}
    </TabBox>
  );
};

export default EvalscriptOutput;
