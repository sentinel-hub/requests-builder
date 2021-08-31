import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import wmsSlice from '../../store/wms';
import FieldWithManualEntry from '../common/FieldWithManualEntry';

const TILE_MATRIX_SET_OPTIONS = [
  { name: 'Mercator 256', value: 'PopularWebMercator256' },
  { name: 'Mercator 512', value: 'PopularWebMercator512' },
];

const WmtsAdvancedOptions = ({ advancedOptions }) => {
  const handleMatrixSetChange = (value) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ TILEMATRIXSET: value }));
  };
  const handleMatrixChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ TILEMATRIX: e.target.value }));
  };
  const handleTileColumnChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ TILECOL: e.target.value }));
  };
  const handleTileRowChange = (e) => {
    store.dispatch(wmsSlice.actions.setAdvancedOptions({ TILEROW: e.target.value }));
  };
  return (
    <>
      <label className="form__label mt-2" htmlFor="tilematrixset">
        Tile Matrix Set
      </label>

      <FieldWithManualEntry
        onChange={handleMatrixSetChange}
        options={TILE_MATRIX_SET_OPTIONS}
        value={advancedOptions.TILEMATRIXSET ?? ''}
      />
      <label className="form__label" htmlFor="tilematrix">
        Tile Matrix
      </label>
      <input
        className="form__input mb-2"
        type="text"
        onChange={handleMatrixChange}
        id="tilematrix"
        placeholder="Tile Matrix"
        value={advancedOptions.TILEMATRIX ?? ''}
      />

      <label className="form__label" htmlFor="tilerow">
        Tile Row
      </label>
      <input
        className="form__input mb-2"
        type="text"
        onChange={handleTileRowChange}
        id="tilerow"
        placeholder="Tile Row"
        value={advancedOptions.TILEROW ?? ''}
      />

      <label className="form__label" htmlFor="tilecol">
        Tile Column
      </label>
      <input
        className="form__input mb-2"
        type="text"
        onChange={handleTileColumnChange}
        id="tilecol"
        placeholder="Tile Column"
        value={advancedOptions.TILECOL ?? ''}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  advancedOptions: state.wms.advancedOptions,
});
export default connect(mapStateToProps)(WmtsAdvancedOptions);
