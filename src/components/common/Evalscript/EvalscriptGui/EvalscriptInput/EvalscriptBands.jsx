import React, { useEffect } from 'react';
import { dataCollectionToBands } from '../const';

const EvalscriptBands = ({ dataCollection, setSelectedBands, selectedBands, idx }) => {
  useEffect(() => {
    setSelectedBands((prevBands) =>
      prevBands
        .slice(0, idx)
        .concat([[]])
        .concat(prevBands.slice(idx + 1)),
    );
  }, [dataCollection, setSelectedBands, idx]);

  const handleBandChange = (band) => () => {
    setSelectedBands((prev) => {
      if (prev[idx].includes(band)) {
        return prev
          .slice(0, idx)
          .concat([prev[idx].filter((b) => b !== band)])
          .concat(prev.slice(idx + 1));
      } else {
        return prev
          .slice(0, idx)
          .concat([prev[idx].concat(band)])
          .concat(prev.slice(idx + 1));
      }
    });
  };

  return (
    <div className="grid grid-cols-3 pl-2 mb-2">
      {dataCollectionToBands(dataCollection.type).map((band) => (
        <div key={band}>
          <input
            type="checkbox"
            value={band}
            onChange={handleBandChange(band)}
            id={`${band}-${idx}`}
            checked={selectedBands[idx].includes(band)}
            className="mr-1"
          />
          <label className="form__label mr-3 cursor-pointer" htmlFor={`${band}-${idx}`}>
            {band}
          </label>
        </div>
      ))}
    </div>
  );
};

export default EvalscriptBands;
