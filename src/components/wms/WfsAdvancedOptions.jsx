import { connect } from 'react-redux';
import React from 'react';
import store from '../../store';
import wmsSlice from '../../store/wms';
import {
  CUSTOM,
  LETML1,
  LETML2,
  LMSSL1,
  LOTL1,
  LOTL2,
  LTML1,
  LTML2,
  MODIS,
  S1GRD,
  S2L1C,
  S2L2A,
  S3OLCI,
} from '../../utils/const/const';

export const typenameForCollection = (dataCollection, byocType, byocId) => {
  if (!dataCollection) {
    return '';
  }
  if (dataCollection === CUSTOM) {
    return `${byocType.toLowerCase()}-${byocId}`;
  }
  switch (dataCollection) {
    case S2L1C:
      return 'DSS1';
    case S2L2A:
      return 'DSS2';
    case S1GRD:
      return 'DSS3';
    case S3OLCI:
      return 'DSS9';
    case LOTL1:
      return 'DSS12';
    case LOTL2:
      return 'DSS13';
    case LTML1:
      return 'DSS15';
    case LTML2:
      return 'DSS16';
    case LETML1:
      return 'DSS17';
    case LETML2:
      return 'DSS18';
    case LMSSL1:
      return 'DSS14';
    case MODIS:
      return 'DSS5';
    default:
      return 'NOT-SUPPORTED';
  }
};

const WfsAdvancedOptions = ({ advancedOptions, dataCollection, byocCollectionType, byocCollection }) => {
  const handleMaxFeaturesChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ MAXFEATURES: Number(e.target.value) }));
  };
  const hanldeFeatureOffsetChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ FEATURESOFFSET: Number(e.target.value) }));
  };

  return (
    <>
      <div className="flex flex-col mt-2">
        <label htmlFor="max-features" className="form__label">
          Max Features
        </label>
        <div className="flex items-center">
          <input
            id="max-features"
            type="range"
            onChange={handleMaxFeaturesChange}
            min="0"
            max="100"
            value={advancedOptions.MAXFEATURES ?? 100}
            className="form__input form__input--range mr-1"
          />
          <p>{advancedOptions.MAXFEATURES ?? 100}</p>
        </div>
      </div>

      <label htmlFor="features-offset" className="form__label">
        Features Offset
      </label>
      <input
        id="features-offset"
        type="number"
        onChange={hanldeFeatureOffsetChange}
        value={advancedOptions.FEATURESOFFSET ?? 0}
        className="form__input mb-2"
      />

      <label htmlFor="typenames" className="form__label">
        Typenames
      </label>
      <input
        id="typenames"
        type="text"
        readOnly
        value={typenameForCollection(dataCollection, byocCollectionType, byocCollection)}
        className="form__input"
        placeholder="Select a layer"
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  dataCollection: state.wms.datasource,
  byocCollectionType: state.wms.byocCollectionType,
  byocCollection: state.wms.byocCollection,
  advancedOptions: state.wms.advancedOptions,
});

export default connect(mapStateToProps)(WfsAdvancedOptions);
