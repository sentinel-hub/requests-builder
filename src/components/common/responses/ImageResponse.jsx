import React from 'react';

const ImageResponse = ({ src, isTar, dimensions }) => {
  return (
    <>
      {!isTar ? <img src={src} alt="response" /> : null}
      <a href={src} download>
        Click to download the response
      </a>
      {dimensions.length > 0 ? (
        <>
          <p className="text">
            <span>Meters per pixel on X axis:</span> {dimensions[0].toFixed(3)}
          </p>
          <p className="text">
            <span>Meters per pixel on Y axis:</span> {dimensions[1].toFixed(3)}
          </p>
        </>
      ) : null}
    </>
  );
};

export default ImageResponse;
