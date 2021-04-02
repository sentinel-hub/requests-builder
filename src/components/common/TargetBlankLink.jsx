import React from 'react';

const TargetBlankLink = ({ href, children }) => {
  return <a href={href} children={children} rel="noopener noreferrer" target="_blank" />;
};

export default TargetBlankLink;
