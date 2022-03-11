import React, { useEffect, useRef, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import bbox from '@turf/bbox';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import proj4 from 'proj4';

import Map from './Map';
import store from '../../../store';
import { transformGeometryToWGS84IfNeeded } from './utils/crsTransform';
import { getLatLngFromBbox, isBbox, isMultiPolygon, isPolygon, getAreaFromGeometry } from './utils/geoUtils';
import CRSSelection from './CRSSelection';
import MapTextarea from './MapTextarea';
import mapSlice from '../../../store/map';
import ByocDataFinder from './ByocDataFinder';
import { useDidMountEffect, useOverlayComponent } from '../../../utils/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

const getLeafletLayer = (wgs84Geometry, layerConfig, currentLayers, mapRef) => {
  // add event listener to layer
  const addEditEventListener = (layer) => {
    layer.on('pm:edit', (e) => {
      const layer = e.layer;
      const type = currentLayers[0].type;
      if (type === 'rectangle') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(bbox(layer.toGeoJSON())));
      } else if (type === 'polygon') {
        store.dispatch(mapSlice.actions.setWgs84Geometry(layer.toGeoJSON().geometry));
      }
    });

    layer.on('pm:cut', (e) => {
      e.layer.removeFrom(mapRef);
      e.originalLayer.removeFrom(mapRef);
      let geo = e.layer.toGeoJSON().geometry;
      if (!isMultiPolygon(geo)) {
        geo.type = 'MultiPolygon';
        geo.coordinates = [geo.coordinates];
      }
      store.dispatch(mapSlice.actions.setWgs84Geometry(geo));
    });
  };
  try {
    if (wgs84Geometry.type === 'Polygon') {
      const coords = wgs84Geometry.coordinates[0].map((c) => [c[1], c[0]]);
      const polygon = L.polygon(coords, layerConfig);
      addEditEventListener(polygon);
      return {
        layer: polygon,
        type: 'polygon',
      };
    } else if (wgs84Geometry.type === 'MultiPolygon') {
      const coords = wgs84Geometry.coordinates.map((a) =>
        a.map((coords) => coords).map((b) => b.map((c) => [c[1], c[0]])),
      );
      const layer = L.polygon(coords, layerConfig);
      addEditEventListener(layer);
      return {
        layer: layer,
        type: 'polygon',
      };
    } else if (isBbox(wgs84Geometry)) {
      const coords = bboxPolygon(wgs84Geometry).geometry.coordinates[0].map((c) => [c[1], c[0]]);
      const polygon = L.rectangle(coords, layerConfig);
      addEditEventListener(polygon);
      return {
        layer: polygon,
        type: 'rectangle',
      };
    }
  } catch (err) {
    console.error('Error while creating the layer on GetLayer\n', err);
    return false;
  }
};

const getBoundsForAdditionalLayer = (geometry) => {
  if (isBbox(geometry)) {
    return getLatLngFromBbox(geometry);
  } else if (isPolygon(geometry) || isMultiPolygon(geometry)) {
    return L.geoJson(geometry).getBounds();
  }
};

const getDeleteLayerButton = (onClick) => {
  const deleteLayerBtn = document.createElement('button');
  deleteLayerBtn.classList.add('secondary-button');
  deleteLayerBtn.innerText = 'Delete Layer';
  deleteLayerBtn.onclick = onClick;
  return deleteLayerBtn;
};

if (!window.proj4) {
  window.proj4 = proj4;
}

const MapContainer = ({
  wgs84Geometry,
  selectedCrs,
  textGeometry,
  extraGeometry,
  additionalLayers,
  ExtraHeaderComponents,
}) => {
  const mapRef = useRef();
  const layersRef = useRef([]);
  const drawnItemsRef = useRef();
  const tiffLayersRef = useRef([]);
  const mapContainerRef = useRef();
  const geoRasterRef = useRef();
  const [parsedError, setParsedError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [hasUsedMap, setHasUsedMap] = useState(false);
  const { isOverlayExpanded, openOverlay } = useOverlayComponent(mapContainerRef, 'overlayed-map');
  const [isDrawingMultiPolygon, setIsDrawingMultiPolygon] = useState(false);

  useEffect(() => {
    if (hasUsedMap && selectedCrs !== 'EPSG:4326') {
      setMapError(true);
      setParsedError(false);
    }
    // eslint-disable-next-line
  }, [hasUsedMap]);

  useEffect(() => {
    if (parsedError && mapError) {
      setMapError(false);
      setHasUsedMap(false);
    }
    // eslint-disable-next-line
  }, [parsedError]);

  const addDrawLayer = (layerWithType, layersRef) => {
    const { layer, type } = layerWithType;
    if (layer && type) {
      drawnItemsRef.current.addLayer(layer);
      layersRef.push(layerWithType);
    } else {
      throw Error('Adding invalid layer');
    }
  };

  const deleteLayerIfPossible = () => {
    if (layersRef.current.length > 0) {
      while (layersRef.current.length > 0) {
        const layerToBeRemoved = layersRef.current.pop().layer;
        drawnItemsRef.current.removeLayer(layerToBeRemoved);
        mapRef.current.removeLayer(layerToBeRemoved);
      }
    }
  };

  const deleteExtraLayerIfPossible = () => {
    if (extraLayersRef.current.length > 0) {
      const layerToBeRemoved = extraLayersRef.current.pop().layer;
      drawnItemsRef.current.removeLayer(layerToBeRemoved);
      mapRef.current.removeLayer(layerToBeRemoved);
    }
  };

  //reference to layers no-related to redux geometry (tpdi)
  const extraLayersRef = useRef([]);

  // Polygon saved from swapping between bbox<->polygon
  const [polygonBeforeConversion, setPolygonBeforeConversion] = useState();

  const fitToMainBounds = useCallback(() => {
    if (layersRef.current.length > 0) {
      mapRef.current.fitBounds(layersRef.current[0].layer.getBounds());
    }
  }, []);
  const handleSwapToBbox = () => {
    setPolygonBeforeConversion(textGeometry);
    const bboxFromPoly = bbox(transformGeometryToWGS84IfNeeded(selectedCrs, textGeometry));
    store.dispatch(mapSlice.actions.setWgs84Geometry(bboxFromPoly));
  };

  useEffect(() => {
    const leafletLayer = getLeafletLayer(
      wgs84Geometry,
      { interactive: false },
      layersRef.current,
      mapRef.current,
    );
    deleteLayerIfPossible();
    addDrawLayer(leafletLayer, layersRef.current);
    mapRef.current.fitBounds(leafletLayer.layer.getBounds());
  }, [wgs84Geometry]);

  useEffect(() => {
    if (extraGeometry !== null) {
      const extraLeafletLayer = getLeafletLayer(
        extraGeometry,
        { color: 'green' },
        extraLayersRef.current,
        mapRef.current,
      );
      const btn = getDeleteLayerButton(() => {
        drawnItemsRef.current.removeLayer(extraLeafletLayer.layer);
        store.dispatch(mapSlice.actions.setExtraGeometry(null));
      });
      extraLeafletLayer.layer.bindPopup(btn);
      deleteExtraLayerIfPossible();
      addDrawLayer(extraLeafletLayer, extraLayersRef.current);
      mapRef.current.fitBounds(extraLeafletLayer.layer.getBounds());
    } else {
      deleteExtraLayerIfPossible();
    }
  }, [extraGeometry]);

  const addImageAdditionalLayer = useCallback((additionalLayer, index) => {
    const { url, geometry, arrayBuffer, uuid } = additionalLayer;

    const options = {
      interactive: true,
    };
    if (!arrayBuffer) {
      const bounds = getBoundsForAdditionalLayer(geometry);
      const newLayer = L.imageOverlay(url, bounds, options);
      const btn = getDeleteLayerButton(() => {
        drawnItemsRef.current.removeLayer(newLayer);
        store.dispatch(mapSlice.actions.removeAdditionalLayer(uuid));
      });
      newLayer.bindPopup(btn);
      drawnItemsRef.current.addLayer(newLayer);
    } else {
      parseGeoraster(arrayBuffer).then((georaster) => {
        const layer = new GeoRasterLayer({
          georaster,
          opacity: 1,
          resolution: 256,
        });
        geoRasterRef.current = georaster;
        const bounds = getBoundsForAdditionalLayer(geometry);
        const overlayLayer = L.rectangle(bounds, { opacity: 0.0, fillOpacity: 0.0, interactive: true });
        const btn = getDeleteLayerButton(() => {
          drawnItemsRef.current.removeLayer(layer);
          drawnItemsRef.current.removeLayer(overlayLayer);
          store.dispatch(mapSlice.actions.removeAdditionalLayer(uuid));
        });
        overlayLayer.bindPopup(btn);
        drawnItemsRef.current.addLayer(overlayLayer);
        drawnItemsRef.current.addLayer(layer);
        tiffLayersRef.current.push({ layer, index, overlayLayer });
      });
    }
  }, []);

  useEffect(() => {
    if (additionalLayers.length > 0) {
      additionalLayers.forEach((additionalLayer, idx) => {
        addImageAdditionalLayer(additionalLayer, idx);
      });
    }
    // eslint-disable-next-line
  }, []);

  // should only handle addition, i.e: latest layer on the stack
  useDidMountEffect(() => {
    if (additionalLayers.length !== 0) {
      const idx = additionalLayers.length - 1;
      addImageAdditionalLayer(additionalLayers[idx], idx);
    }
  }, [additionalLayers, addImageAdditionalLayer]);

  // cleanup of tiff layers
  useEffect(() => {
    return () => {
      // eslint-disable-next-line
      const layersWithIdx = tiffLayersRef.current;
      if (layersWithIdx.length > 0) {
        layersWithIdx.forEach((layerWithIdx) => {
          // eslint-disable-next-line
          drawnItemsRef.current?.removeLayer(layerWithIdx.layer);
          // eslint-disable-next-line
          drawnItemsRef.current?.removeLayer(layerWithIdx.overlayLayer);
        });
        store.dispatch(mapSlice.actions.removeTiffLayers());
      }
    };
  }, []);
  return (
    <div>
      <div className="flex items-center">
        <h2 className="heading-secondary" style={{ marginRight: '2rem' }}>
          Area of interest
        </h2>
        <i className="cursor-pointer flex items-center text-xl" onClick={openOverlay}>
          <FontAwesomeIcon icon={faExpandArrowsAlt} />
        </i>
      </div>
      <div className="form" ref={mapContainerRef}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <CRSSelection selectedCrs={selectedCrs} />
          <p className="text mx-2 h-full flex items-center">
            <span className="mr-1">Area selected:</span>{' '}
            {(getAreaFromGeometry(wgs84Geometry) / 1e6).toFixed(2)} km<sup>2</sup>
          </p>
          {isPolygon(textGeometry) && (
            <button className="secondary-button mr-1" onClick={handleSwapToBbox}>
              Get bbox
            </button>
          )}
          {isBbox(textGeometry) && polygonBeforeConversion && (
            <button
              className="secondary-button mr-1"
              onClick={() => store.dispatch(mapSlice.actions.setTextGeometry(polygonBeforeConversion))}
            >
              Undo
            </button>
          )}
          <ByocDataFinder />

          <button
            className="secondary-button ml-3"
            onClick={() => setIsDrawingMultiPolygon((prev) => !prev)}
            title={
              isDrawingMultiPolygon
                ? 'New drawn geometries will be added as a MultiPolygon'
                : 'New drawn geometries will replace the existing one'
            }
          >
            {isDrawingMultiPolygon ? 'Drawing MultiPolygon' : 'Drawing Single Polygon'}
          </button>
          {ExtraHeaderComponents && <ExtraHeaderComponents />}
        </div>
        {(parsedError || mapError) && (
          <div className="mb-1">
            {parsedError && (
              <p className="text text--warning ml-auto">
                When parsing, the displayed geometry on the map can have some minor errors due to
                re-projection to EPSG:4326.
              </p>
            )}
            {mapError && (
              <p className="text text--warning">
                When drawing geometries in CRSs other than WGS:84 the resulting text geometry can have some
                minor errors due to re-projection to {selectedCrs}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col justify-between h-full items-stretch xl:flex-row z-1">
          <Map
            mapRef={mapRef}
            drawnItemsRef={drawnItemsRef}
            layersRef={layersRef}
            setHasUsedMap={setHasUsedMap}
            mapOverrideStyles={isOverlayExpanded ? { height: '100%' } : undefined}
            isDrawingMultiPolygon={isDrawingMultiPolygon}
          />

          <MapTextarea
            fitToMainBounds={fitToMainBounds}
            geometry={textGeometry}
            extraGeometry={extraGeometry}
            setParsedError={setParsedError}
            selectedCrs={selectedCrs}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  wgs84Geometry: state.map.wgs84Geometry,
  textGeometry: state.map.convertedGeometry,
  selectedCrs: state.map.selectedCrs,
  extraGeometry: state.map.extraGeometry,
  additionalLayers: state.map.additionalLayers,
});

export default connect(mapStateToProps)(MapContainer);
