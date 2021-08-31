import React from 'react';
import { connect } from 'react-redux';
import { LETML1, LETML2, LOTL1, LOTL2 } from '../../../utils/const/const';
import BasicOptions from './BasicOptions';
import Select from '../Select';
import store from '../../../store';
import requestSlice from '../../../store/request';

const LandsatBaseFilters = [
  { name: 'All Tiers', value: 'ALL_TIERS' },
  { name: 'Tier 1', value: 'TIER_1' },
];

const LandsatActiveFilters = [{ name: 'Tier 1 and RT', value: 'TIER_1_AND_RT' }];

const isActiveLandsat = (dataCollection) =>
  dataCollection === LOTL1 ||
  dataCollection === LOTL2 ||
  dataCollection === LETML1 ||
  dataCollection === LETML2;

const LandsatOptions = ({ idx, dataCollection, tiers }) => {
  const handleTiersChange = (value) => {
    store.dispatch(requestSlice.actions.setDataFilterOptions({ tiers: value, idx }));
  };
  return (
    <>
      <BasicOptions idx={idx} />
      <Select
        label="Product tiers"
        selected={tiers ?? 'ALL_TIERS'}
        onChange={handleTiersChange}
        options={
          isActiveLandsat(dataCollection)
            ? [...LandsatBaseFilters, ...LandsatActiveFilters]
            : LandsatBaseFilters
        }
        buttonClassNames="mb-2"
      />
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  tiers: state.request.dataFilterOptions[ownProps.idx].options.tiers,
});

export default connect(mapStateToProps)(LandsatOptions);
