import React, { useEffect, useState } from 'react';
import { faCopy, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CopyIcon = ({ className, item, style = {} }) => {
  const [gotCopied, setGotCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item);
    setGotCopied(true);
  };
  useEffect(() => {
    if (gotCopied) {
      setTimeout(() => setGotCopied(false), 1000);
    }
  }, [gotCopied]);

  if (gotCopied) {
    return (
      <FontAwesomeIcon
        icon={faThumbsUp}
        className={className ?? 'text'}
        style={{ color: 'green', ...style }}
      />
    );
  }
  return (
    <FontAwesomeIcon
      icon={faCopy}
      style={{ cursor: 'pointer', ...style }}
      className={className ?? 'text'}
      onClick={handleCopy}
    />
  );
};
export default CopyIcon;
