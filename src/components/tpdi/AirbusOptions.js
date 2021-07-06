import React, { useState } from 'react';
import AirbusAdvancedOptions from './AirbusAdvancedOptions';
import Toggle from '../common/Toggle';

const AirbusOptions = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleShowAdvancedChange = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center mb-2">
        <label htmlFor="adv-options" className="form__label cursor-pointer mr-2">
          Advanced Options
        </label>
        <Toggle id="adv-options" checked={showAdvanced} onChange={handleShowAdvancedChange} />
      </div>
      {showAdvanced ? <AirbusAdvancedOptions /> : null}
    </div>
  );
};

export default AirbusOptions;
