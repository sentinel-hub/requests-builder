import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { dataCollectionToBands, INPUT_DOCS } from './const';
import TabBox from './TabBox';

const EvalscriptInput = ({
  dataCollection,
  selectedBands,
  setSelectedBands,
  units,
  setUnits,
  metadataBounds,
  setMetadataBounds,
}) => {
  useEffect(() => {
    setSelectedBands([]);
  }, [dataCollection.type, setSelectedBands]);
  const handleBandChange = (band) => () => {
    setSelectedBands((prev) => {
      if (prev.includes(band)) {
        return prev.filter((b) => b !== band);
      } else {
        return prev.concat(band);
      }
    });
  };

  const generateBandsOptions = (dataCollectionType) => {
    return dataCollectionToBands(dataCollectionType).map((band) => (
      <div>
        <input
          type="checkbox"
          value={band}
          onChange={handleBandChange(band)}
          id={band}
          checked={selectedBands.includes(band)}
          className="mr-1"
        />
        <label className="form__label mr-3 cursor-pointer" htmlFor={band}>
          {band}
        </label>
      </div>
    ));
  };

  const handleUnitsChange = (e) => {
    setUnits(e.target.value);
  };

  const handleMetadataChange = () => {
    setMetadataBounds((prev) => !prev);
  };

  return (
    <TabBox title="input" className="mb-3" documentationLink={INPUT_DOCS}>
      <label className="form__label">bands *</label>
      <div className="grid grid-cols-3 pl-2 mb-2">{generateBandsOptions(dataCollection.type)}</div>
      <div className="flex items-center">
        <label className="form__label mr-3">units (optional)</label>
        <input
          type="radio"
          value="DN"
          checked={units === 'DN'}
          onChange={handleUnitsChange}
          className="mr-1"
          id="units-dn"
        />
        <label className="form__label mr-2 cursor-pointer" htmlFor="units-dn">
          DN
        </label>
        <input
          type="radio"
          checked={units === 'REFLECTANCE'}
          onChange={handleUnitsChange}
          value="REFLECTANCE"
          className="mr-1"
          id="units-reflectance"
        />
        <label className="form__label cursor-pointer" htmlFor="units-reflectance">
          Reflectance
        </label>
      </div>

      <div className="flex items-center my-2">
        <label className="form__label mr-3">metadata (optional)</label>
        <input
          type="checkbox"
          className="mr-1"
          id="metadata-bounds"
          onChange={handleMetadataChange}
          checked={metadataBounds}
        />
        <label className="form__label cursor-pointer" htmlFor="metadata-bounds">
          bounds
        </label>
      </div>
    </TabBox>
  );
};

const mapStateToProps = (state) => ({
  dataCollection: state.request.dataCollections[0],
});

export default connect(mapStateToProps)(EvalscriptInput);
