import React, { useEffect } from 'react';
import { INPUT_DOCS } from '../const';
import TabBox from '../TabBox';
import EvalscriptBands from './EvalscriptBands';
import EvalscriptUnits from './EvalscriptUnits';

const EvalscriptInput = ({
  dataCollections,
  selectedBands,
  setSelectedBands,
  units,
  setUnits,
  metadataBounds,
  setMetadataBounds,
}) => {
  const handleMetadataChange = (idx) => () => {
    setMetadataBounds((prev) =>
      prev
        .slice(0, idx)
        .concat(!prev[idx])
        .concat(prev.slice(idx + 1)),
    );
  };

  const isOnDataFusion = dataCollections.length > 1;

  useEffect(() => {
    if (dataCollections.length > selectedBands.length) {
      setSelectedBands((prevBands) => prevBands.concat([[]]));
      setUnits((prevUnits) => prevUnits.concat(''));
    } else if (dataCollections.length < selectedBands.length) {
      setSelectedBands((prevBands) => prevBands.slice(0, -1));
      setUnits((prevUnits) => prevUnits.slice(0, -1));
    }
    // eslint-disable-next-line
  }, [dataCollections.length]);

  return (
    <TabBox title="input" className="mb-3" documentationLink={INPUT_DOCS}>
      {selectedBands.map((_, idx) => {
        const dataCollection = dataCollections[idx];
        if (!dataCollection) {
          return null;
        }
        return (
          <React.Fragment key={`eval-gui-input-${idx}`}>
            {isOnDataFusion && (
              <h3 className="heading-tertiary">
                {dataCollection.id ? dataCollection.id : `Data Collection ${idx + 1}`}
              </h3>
            )}
            <label className="form__label">bands *</label>
            <EvalscriptBands
              dataCollection={dataCollection}
              selectedBands={selectedBands}
              setSelectedBands={setSelectedBands}
              idx={idx}
            />
            <EvalscriptUnits dataCollection={dataCollection} units={units} setUnits={setUnits} idx={idx} />
            <div className="flex items-center my-2">
              <label className="form__label mr-3">metadata (optional)</label>
              <input
                type="checkbox"
                className="mr-1"
                id={`metadata-bounds-${idx}`}
                onChange={handleMetadataChange(idx)}
                checked={metadataBounds[idx]}
              />
              <label className="form__label cursor-pointer" htmlFor={`metadata-bounds-${idx}`}>
                bounds
              </label>
            </div>
            {isOnDataFusion > 0 && <hr className="border-primary border my-2" />}
          </React.Fragment>
        );
      })}
    </TabBox>
  );
};

export default EvalscriptInput;
