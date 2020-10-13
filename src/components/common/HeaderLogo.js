import React from 'react';

const HeaderLogo = () => {
  return (
    <>
      <img src={process.env.PUBLIC_URL + '/sentinel_hub_logo_big.png'} className="logo-image" alt="logo" />
      <h1 className="heading-primary u-margin-left-tiny">
        <i>Requests</i>
      </h1>
    </>
  );
};

export default HeaderLogo;
