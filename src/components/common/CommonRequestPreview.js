import React, { useEffect, useState } from 'react';
import { Controlled } from 'react-codemirror2';
import Toggle from './Toggle';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/addon/edit/matchbrackets.js');
/*
options:
[
  {
    name: "search",
    value: "some text",
    toggledValue?: "some text"
    nonToggle?: boolean,
  }
]
supportedParseNames: names of options that can be parsed using onParse function.
canCopy: shows copy to clipboard button
*/
const CommonRequestPreview = ({ options, className, onParse, supportedParseNames, canCopy = false }) => {
  const id = `toggle-${Math.random()}`;
  const [toggled, setToggled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options ? options[0] : {});
  const [text, setText] = useState(selectedOption.value);
  const [hasTextChanged, setHasTextChanged] = useState(false);

  useEffect(() => {
    setSelectedOption((s) => {
      if (options) {
        return options.find((opt) => opt.name === s.name ?? options[0]);
      }
      return {};
    });
  }, [options]);

  useEffect(() => {
    if (selectedOption) {
      if (toggled) {
        setText(selectedOption.toggledValue ?? 'Please send the request to see the response.');
      } else {
        setText(selectedOption.value);
      }
    }
    setHasTextChanged(false);
  }, [selectedOption, toggled]);

  const handleSelectedOptionChange = (e) => {
    const newOption = options.find((opt) => opt.name === e.target.value);
    if (newOption.nonToggle) {
      setToggled(false);
    }
    setSelectedOption(newOption);
  };

  const handleCopy = () => {
    const text = toggled ? selectedOption.toggledValue : selectedOption.value;
    navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
  };

  const handleToggleChange = () => {
    setToggled(!toggled);
  };
  return (
    <>
      {options.length > 1 ? (
        <div className="toggle-with-label">
          <label className="form__label">Request</label>
          <select className="form__input" value={selectedOption.name} onChange={handleSelectedOptionChange}>
            {options.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <Controlled
        value={text}
        options={{
          mode: 'powershell',
          theme: 'eclipse',
          matchBrackets: true,
        }}
        className={className}
        onBeforeChange={(editor, data, value) => {
          setText(value);
          if (!hasTextChanged) {
            setHasTextChanged(true);
          }
        }}
      />
      {!selectedOption.nonToggle && (
        <div className="toggle-with-label u-margin-top-tiny">
          <label htmlFor={id} className="form__label">
            See response
          </label>
          <Toggle id={id} checked={toggled} onChange={handleToggleChange} />
          {canCopy && (
            <button className="secondary-button" style={{ marginTop: 0 }} onClick={handleCopy}>
              Copy
            </button>
          )}
          {onParse && hasTextChanged && supportedParseNames.includes(selectedOption.name) && (
            <button
              className="secondary-button"
              style={{ marginTop: 0, marginLeft: '1rem' }}
              onClick={() => onParse(text)}
            >
              Parse
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CommonRequestPreview;
