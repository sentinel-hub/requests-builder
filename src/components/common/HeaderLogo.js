import React from 'react';

const HeaderLogo = () => {
  return (
    <>
      <img
        src={process.env.PUBLIC_URL + '/sentinel_hub_logo_big.png'}
        className="sm:w-48 w-24 h-auto"
        alt="logo"
      />
      <h1 className="heading-primary ml-1">
        <i className="text-primary cursor-default">Requests</i>
      </h1>
    </>
  );
};

export default HeaderLogo;
