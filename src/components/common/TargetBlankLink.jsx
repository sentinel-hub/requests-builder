import React from 'react';

const TargetBlankLink = ({ href, children, className }) => {
  return (
    <a href={href} children={children} rel="noopener noreferrer" target="_blank" className={className} />
  );
};

export default TargetBlankLink;
