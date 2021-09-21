import React, { useCallback, useEffect, useState } from 'react';
import Select from './Select';

// onChange: value -> void
// options : {value: string, name: string}[]
const FieldWithManualEntry = ({
  options,
  onChange,
  value,
  label,
  inputPlaceholder = '',
  optionsClassNames,
}) => {
  const [isOnManualEntry, setIsOnManualEntry] = useState(false);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };
  const handleSelectChange = (value) => {
    if (value === 'MANUAL') {
      setIsOnManualEntry(true);
      onChange('');
    } else {
      onChange(value);
      setIsOnManualEntry(false);
    }
  };

  const valueToSelectValue = useCallback(
    (value) => {
      if (isOnManualEntry) {
        return 'MANUAL';
      }
      if (value === '') {
        return '';
      }
      const maybeOption = options.find((opt) => opt.value === value);
      if (maybeOption) {
        return maybeOption.value;
      }
      return 'MANUAL';
    },
    [isOnManualEntry, options],
  );

  useEffect(() => {
    if (!isOnManualEntry && value !== '' && !options.find((opt) => opt.value === value)) {
      setIsOnManualEntry(true);
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <>
      <Select
        options={[
          { name: 'Select an option', value: '' },
          { name: 'Manual Entry', value: 'MANUAL' },
          ...options,
        ]}
        selected={valueToSelectValue(value)}
        onChange={handleSelectChange}
        buttonClassNames="mb-2"
        label={label}
        optionsClassNames={optionsClassNames}
      />
      {isOnManualEntry && (
        <input
          className="form__input mb-2"
          onChange={handleInputChange}
          value={value}
          placeholder={inputPlaceholder}
        />
      )}
    </>
  );
};

export default FieldWithManualEntry;
