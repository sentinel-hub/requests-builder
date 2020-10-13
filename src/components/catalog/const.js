import { S2L2A, S2L1C, S1GRD } from '../../utils/const';

export const S2L1C_CATALOG_ID = 'sentinel-2-l1c';
export const S2L2A_CATALOG_ID = 'sentinel-2-l2a';
export const S1GRD_CATALOG_ID = 'sentinel-1-grd';

export const S1OPTIONS = [
  {
    propertyName: 'sar:instrument_mode',
    possibleValues: ['SM', 'IW', 'EW', 'WV'],
    operators: ['eq'],
  },
  {
    propertyName: 'sat:orbit_state',
    possibleValues: ['ASCENDING', 'DESCENDING'],
    operators: ['eq'],
  },
  {
    propertyName: 'resolution',
    possibleValues: ['HIGH', 'MEDIUM'],
    operators: ['eq'],
  },
  {
    propertyName: 'polarization',
    possibleValues: ['SH', 'SV', 'DH', 'DV', 'HH', 'HV', 'VV', 'VH'],
    operators: ['eq'],
  },
  {
    propertyName: 'timeliness',
    possibleValues: ['NRT10m', 'NRT1h', 'NRT3h', 'Fast24h', 'Offline', 'Reprocessing', 'ArchNormal'],
    operators: ['eq'],
  },
];

export const datasourceToCollection = {
  [S2L2A]: S2L2A_CATALOG_ID,
  [S2L1C]: S2L1C_CATALOG_ID,
  [S1GRD]: S1GRD_CATALOG_ID,
};
