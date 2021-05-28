import React from 'react';
import store from '../../../store';
import { uuidv4 } from '../../../store/alert';
import mapSlice from '../../../store/map';

const ImageResponse = ({ imageResponse, hasBeenAddedToMap, setHasBeenAddedToMap }) => {
  const { src, format, wgs84Geometry, dimensions, arrayBuffer } = imageResponse;
  const isTiff = format.includes('tif');
  const isTar = format.includes('tar');
  const shouldNotDisplayFormat = format.includes('tar') || isTiff;
  const uuid = uuidv4();
  const handleAddImageToMap = () => {
    store.dispatch(
      mapSlice.actions.addAdditionalLayer({ url: src, geometry: wgs84Geometry, arrayBuffer, uuid }),
    );
    setHasBeenAddedToMap(true);
  };
  return (
    <>
      {shouldNotDisplayFormat ? null : <img src={src} alt="response" />}
      <a href={src} download>
        Click to download the response
      </a>
      {dimensions !== undefined && (
        <>
          <p className="text">
            <span>Meters per pixel on X axis:</span> {dimensions[0].toFixed(3)}
          </p>
          <p className="text">
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
            <p className="text text--warning u-margin-top-tiny">
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
