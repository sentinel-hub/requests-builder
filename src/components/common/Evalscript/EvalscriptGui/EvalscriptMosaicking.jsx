import React from 'react';
import RadioSelector from '../../RadioSelector';
import { MOSAICKING_DOCS } from './const';
import TabBox from './TabBox';

const MOSAICKING_OPTIONS = [
  { value: 'SIMPLE', name: 'Simple' },
  { value: 'ORBIT', name: 'Orbit' },
  { value: 'Tile', name: 'Tile' },
];

const EvalscriptMosaicking = ({ selectedMosaicking, setSelectedMosaicking }) => {
  const handleMosaickingChange = (e) => {
    setSelectedMosaicking(e.target.value);
  };
  return (
    <TabBox title="mosaicking" className="mb-2" documentationLink={MOSAICKING_DOCS}>
      <RadioSelector
        onChange={handleMosaickingChange}
        value={selectedMosaicking}
        options={MOSAICKING_OPTIONS}
      />
    </TabBox>
  );
};

export default EvalscriptMosaicking;
