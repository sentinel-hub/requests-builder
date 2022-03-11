import React from 'react';
import { connect } from 'react-redux';

import store from '../../store';
import { maxarSlice } from '../../store/tpdi';
import Select from '../common/Select';

const MAXAR_KERNEL_OPTIONS = [
  { name: 'Nearest Neighbour (NN)', value: 'NN' },
  { name: '4x4 cubic convolution (CC)', value: 'CC' },
  { name: 'MTF', value: 'MTF' },
];
const MaxarOptions = ({
  maxCloudCoverage,
  minOffNadir,
  maxOffNadir,
  minSunElevation,
  maxSunElevation,
  sensor,
  productKernel,
}) => {
  const handleParamChange = (key, toNumber = false) => (e) => {
    store.dispatch(
      maxarSlice.actions.setMaxarDataFilterParam({
        key,
        value: toNumber ? Number(e.target.value) : e.target.value,
      }),
    );
  };

  const handleKernelChange = (value) => {
    store.dispatch(maxarSlice.actions.setProductKernel(value));
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor="maxar-maxcc" className="form__label">
        Max Cloud Coverage
      </label>
      <div className="flex items-center">
        <input
          className="form__input mb-2 form__input--range"
          id="maxar-maxcc"
          onChange={handleParamChange('maxCloudCoverage', true)}
          type="range"
          min="0"
          max="100"
          value={maxCloudCoverage}
        />
        <p className="text" style={{ marginLeft: '1rem' }}>
          {maxCloudCoverage} %
        </p>
      </div>
      <label htmlFor="maxar-kernel" className="form__label">
        Kernel
      </label>
      <Select options={MAXAR_KERNEL_OPTIONS} onChange={handleKernelChange} selected={productKernel} />
      <label htmlFor="maxar-minnadir" className="form__label mt-2">
        Min Off Nadir
      </label>
      <div className="flex items-center">
        <input
          className="form__input mb-2 form__input--range"
          id="maxar-minnadir"
          onChange={handleParamChange('minOffNadir', true)}
          type="range"
          min="0"
          max="45"
          value={minOffNadir}
        />
        <p className="text" style={{ marginLeft: '1rem' }}>
          {minOffNadir} %
        </p>
      </div>
      <label htmlFor="maxar-maxnadir" className="form__label">
        Max Off Nadir
      </label>
      <div className="flex items-center">
        <input
          className="form__input mb-2 form__input--range"
          id="maxar-maxnadir"
          onChange={handleParamChange('maxOffNadir', true)}
          type="range"
          min="0"
          max="45"
          value={maxOffNadir}
        />
        <p className="text" style={{ marginLeft: '1rem' }}>
          {maxOffNadir} %
        </p>
      </div>
      <label htmlFor="maxar-minsun" className="form__label">
        Min Sun Elevation
      </label>
      <div className="flex items-center">
        <input
          className="form__input mb-2 form__input--range"
          id="maxar-minsun"
          onChange={handleParamChange('minSunElevation', true)}
          type="range"
          min="0"
          max="90"
          value={minSunElevation}
        />
        <p className="text" style={{ marginLeft: '1rem' }}>
          {minSunElevation} %
        </p>
      </div>
      <label htmlFor="maxar-maxsun" className="form__label">
        Max Sun Elevation
      </label>
      <div className="flex items-center">
        <input
          className="form__input mb-2 form__input--range"
          id="maxar-maxsun"
          onChange={handleParamChange('maxSunElevation', true)}
          type="range"
          min="0"
          max="90"
          value={maxSunElevation}
        />
        <p className="text" style={{ marginLeft: '1rem' }}>
          {maxSunElevation} %
        </p>
      </div>
      <label htmlFor="maxar-sensor" className="form__label">
        Sensor
      </label>
      <select
        className="form__input mb-2"
        id="maxar-sensor"
        value={sensor === null ? '' : sensor}
        onChange={handleParamChange('sensor')}
      >
        <option value="">Any</option>
        <option value="WV01">WV01</option>
        <option value="WV02">WV02</option>
        <option value="WV03">WV03</option>
        <option value="WV04">WV04</option>
        <option value="GE01">GE01</option>
      </select>
    </div>
  );
};

const mapStateToProps = (state) => ({
  maxCloudCoverage: state.maxar.dataFilterOptions.maxCloudCoverage,
  minOffNadir: state.maxar.dataFilterOptions.minOffNadir,
  maxOffNadir: state.maxar.dataFilterOptions.maxOffNadir,
  minSunElevation: state.maxar.dataFilterOptions.minSunElevation,
  maxSunElevation: state.maxar.dataFilterOptions.maxSunElevation,
  sensor: state.maxar.dataFilterOptions.sensor,
  productKernel: state.maxar.productKernel,
});
export default connect(mapStateToProps)(MaxarOptions);
