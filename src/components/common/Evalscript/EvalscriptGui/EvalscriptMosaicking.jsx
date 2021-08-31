import React from 'react';
import { MOSAICKING_DOCS } from './const';
import TabBox from './TabBox';

const EvalscriptMosaicking = ({ selectedMosaicking, setSelectedMosaicking }) => {
  const handleMosaickingChange = (e) => {
    setSelectedMosaicking(e.target.value);
  };
  return (
    <TabBox title="mosaicking" className="mb-2" documentationLink={MOSAICKING_DOCS}>
      <input
        value="SIMPLE"
        type="radio"
        onChange={handleMosaickingChange}
        className="mr-1"
        id="mosaicking-simple"
        checked={selectedMosaicking === 'SIMPLE'}
      />
      <label className="form__label cursor-pointer mr-4" htmlFor="mosaicking-simple">
        SIMPLE
      </label>
      <input
        value="ORBIT"
        type="radio"
        onChange={handleMosaickingChange}
        className="mr-1"
        id="mosaicking-orbit"
        checked={selectedMosaicking === 'ORBIT'}
      />
      <label className="form__label cursor-pointer mr-4" htmlFor="mosaicking-orbit">
        ORBIT
      </label>
      <input
        value="TILE"
        type="radio"
        onChange={handleMosaickingChange}
        className="mr-1"
        id="mosaicking-tile"
        checked={selectedMosaicking === 'TILE'}
      />
      <label className="form__label cursor-pointer mr-4" htmlFor="mosaicking-tile">
        TILE
      </label>
    </TabBox>
  );
};

export default EvalscriptMosaicking;
