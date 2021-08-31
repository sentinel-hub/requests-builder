import React from 'react';
import TargetBlankLink from '../../TargetBlankLink';

const TabBox = ({ children, title, className, documentationLink, extraElement }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h4 className="border-2 border-primary-dark border-b-0 w-fit bg-primary-light ml-4 p-1 rounded-r-xl rounded-b-none">
            {title}
          </h4>
          {documentationLink && (
            <TargetBlankLink href={documentationLink} className="mx-2 underline">
              Documentation
            </TargetBlankLink>
          )}
        </div>
        {extraElement}
      </div>
      <div className={`border-2 border-primary-dark p-3 ${className}`}>{children}</div>
    </div>
  );
};

export default TabBox;
