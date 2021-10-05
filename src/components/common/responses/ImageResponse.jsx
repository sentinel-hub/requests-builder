import React, { useMemo } from 'react';
import store from '../../../store';
import { uuidv4 } from '../../../store/alert';
import mapSlice from '../../../store/map';
import { triggerDownload } from '../../statistical/response/HistogramChart';

const getProperFormat = (format) => {
  if (format === 'image/jpeg') {
    return 'jpeg';
  }
  if (format === 'image/png') {
    return 'png';
  }
  if (format === 'image/tiff') {
    return 'tiff';
  }
  if (format === 'application/x-tar' || format.includes('tar')) {
    return 'tar';
  }
  if (format === 'application/json' || format.includes('json')) {
    return 'json';
  }
  return format;
};
const ImageResponse = ({ imageResponse, hasBeenAddedToMap, setHasBeenAddedToMap }) => {
  const { src, format, wgs84Geometry, dimensions, arrayBuffer } = imageResponse;
  const isTiff = format.includes('tif');
  const isTar = format.includes('tar');
  const shouldNotDisplayFormat = format.includes('tar') || isTiff;
  const uuid = useMemo(() => uuidv4(), []);
  const handleAddImageToMap = () => {
    store.dispatch(
      mapSlice.actions.addAdditionalLayer({ url: src, geometry: wgs84Geometry, arrayBuffer, uuid }),
    );
    setHasBeenAddedToMap(true);
  };
  const handleDownloadImage = () => {
    triggerDownload(src, `${uuid}.${getProperFormat(format)}`);
  };
  return (
    <>
      {shouldNotDisplayFormat ? null : <img src={src} alt="response" />}
      <p className="underline cursor-pointer text-lg my-2" onClick={handleDownloadImage}>
        Click to download the response
      </p>
      {dimensions !== undefined && (
        <>
          <p className="text">
            <span>Meters per pixel on X axis:</span> {dimensions[0].toFixed(3)}
          </p>
          <p className="text mb-2">
            <span>Meters per pixel on Y axis:</span> {dimensions[1].toFixed(3)}
          </p>
        </>
      )}
      {wgs84Geometry !== undefined && !isTar && (
        <>
          <button
            className={`secondary-button ${hasBeenAddedToMap ? 'secondary-button--disabled' : ''}`}
            onClick={handleAddImageToMap}
            disabled={hasBeenAddedToMap}
          >
            Add to Map
          </button>
          {arrayBuffer !== undefined && (
            <p className="text text--warning mt-1">
              <b>
                <i>Note: </i>
              </b>
              Map .tiff layers will reset when changing between different modes.
            </p>
          )}
        </>
      )}
    </>
  );
};

export default ImageResponse;
