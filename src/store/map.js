import { createSlice } from '@reduxjs/toolkit';
import bboxPolygon from '@turf/bbox-polygon';
import {
  appendPolygon,
  isBbox,
  transformGeometryToNewCrs,
  transformGeometryToWGS84IfNeeded,
} from '../components/common/Map/utils/crsTransform';

const isWgs84 = (crs) => crs === 'EPSG:4326';

// mapLayer: { url, bounds };
const mapSlice = createSlice({
  name: 'map',
  initialState: {
    wgs84Geometry: [12.44693, 41.870072, 12.541001, 41.917096],
    // convertedGeometry will be the source of truth.
    convertedGeometry: [12.44693, 41.870072, 12.541001, 41.917096],
    selectedCrs: 'EPSG:4326',
    extraGeometry: null,
    additionalLayers: [],
  },
  reducers: {
    setWgs84Geometry: (state, action) => {
      state.wgs84Geometry = action.payload;
      if (isWgs84(state.selectedCrs)) {
        state.convertedGeometry = action.payload;
      } else {
        const newGeo = transformGeometryToNewCrs(action.payload, state.selectedCrs);
        state.convertedGeometry = newGeo;
      }
    },
    setSelectedCrs: (state, action) => {
      if (isWgs84(action.payload)) {
        state.convertedGeometry = state.wgs84Geometry;
      } else {
        const prevCrs = state.selectedCrs;
        // convert and set geometry
        const newGeo = transformGeometryToNewCrs(state.convertedGeometry, action.payload, prevCrs);
        state.convertedGeometry = newGeo;
      }
      state.selectedCrs = action.payload;
    },
    setTextGeometry: (state, action) => {
      state.convertedGeometry = action.payload;
      const newWgs84Geo = transformGeometryToWGS84IfNeeded(state.selectedCrs, action.payload);
      state.wgs84Geometry = newWgs84Geo;
    },
    setExtraGeometry: (state, action) => {
      state.extraGeometry = action.payload;
    },
    setConvertedGeometryWithCrs: (state, action) => {
      const { crs, geometry } = action.payload;
      if (!crs || crs === 'EPSG:4326') {
        state.selectedCrs = 'EPSG:4326';
        state.wgs84Geometry = geometry;
      } else {
        state.selectedCrs = crs;
        const wgs84Geo = transformGeometryToWGS84IfNeeded(crs, geometry);
        state.wgs84Geometry = wgs84Geo;
      }
      state.convertedGeometry = geometry;
    },
    addAdditionalLayer: (state, action) => {
      state.additionalLayers.push(action.payload);
    },
    removeTiffLayers: (state) => {
      state.additionalLayers = state.additionalLayers.filter((lay) => !lay.arrayBuffer);
    },
    removeAdditionalLayer: (state, action) => {
      const uuidToDelete = action.payload;
      state.additionalLayers = state.additionalLayers.filter((lay) => lay.uuid !== uuidToDelete);
    },
    appendWgs84Polygon: (state, action) => {
      const currGeo = isBbox(state.wgs84Geometry)
        ? bboxPolygon(state.wgs84Geometry).geometry
        : state.wgs84Geometry;
      const newGeo = appendPolygon(currGeo, action.payload);
      state.wgs84Geometry = newGeo;
      if (isWgs84(state.selectedCrs)) {
        state.convertedGeometry = newGeo;
      } else {
        const transformedGeo = transformGeometryToNewCrs(newGeo, state.selectedCrs);
        state.convertedGeometry = transformedGeo;
      }
    },
  },
});

export default mapSlice;
