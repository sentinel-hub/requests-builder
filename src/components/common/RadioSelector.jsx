import React from 'react';

// options: [{name: string, value: number|string }];
const RadioSelector = ({ onChange, options, value }) => {
  return (
    <div className="flex-col flex items-start md:items-center md:flex-row">
      {options.map((opt) => (
        <div key={`radio-selector-key-${opt.name}`} className="mb-2 md:mb-0">
          <input
            type="radio"
            className="hidden"
            key={opt.value}
            id={`label-${opt.name}`}
            value={opt.value}
            onClick={onChange}
          />
          <label
            className={`mr-2 py-1 px-2 rounded-md cursor-pointer hover:bg-primary ${
              value === opt.value
                ? 'bg-primary-dark cursor-not-allowed hover:bg-primary-dark'
                : 'bg-primary-light'
            }`}
            htmlFor={`label-${opt.name}`}
          >
            {opt.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioSelector;
