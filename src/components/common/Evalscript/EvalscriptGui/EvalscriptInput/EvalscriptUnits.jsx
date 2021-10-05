import React, { useEffect, useMemo } from 'react';
import { S2L1C, S2L2A } from '../../../../../utils/const/const';
import RadioSelector from '../../../RadioSelector';

const shouldDisplayUnits = (dataCollection) => dataCollection === S2L2A || dataCollection === S2L1C;

const UNITS_OPTIONS = [
  { name: 'Digital Numbers', value: 'DN' },
  { name: 'Reflectance', value: 'REFLECTANCE' },
];

const EvalscriptUnits = ({ dataCollection, units, setUnits, idx }) => {
  const shouldDisplay = useMemo(() => shouldDisplayUnits(dataCollection.type), [dataCollection.type]);
  useEffect(() => {
    if (!shouldDisplayUnits(dataCollection.type)) {
      setUnits((prevUnits) =>
        prevUnits
          .slice(0, idx)
          .concat('')
          .concat(prevUnits.slice(idx + 1)),
      );
    } else {
      setUnits((prevUnits) =>
        prevUnits
          .slice(0, idx)
          .concat('REFLECTANCE')
          .concat(prevUnits.slice(idx + 1)),
      );
    }
  }, [dataCollection, setUnits, idx]);

  if (!shouldDisplay) {
    return null;
  }

  const handleUnitsChange = (e) => {
    const value = e.target.value;
    setUnits((prevUnits) =>
      prevUnits
        .slice(0, idx)
        .concat([value])
        .concat(prevUnits.slice(idx + 1)),
    );
  };

  return (
    <div className="flex items-center">
      <label className="form__label mr-3">units (optional)</label>
      <RadioSelector options={UNITS_OPTIONS} value={units[idx]} onChange={handleUnitsChange} />
    </div>
  );
};

export default EvalscriptUnits;
