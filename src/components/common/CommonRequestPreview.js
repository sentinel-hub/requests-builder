import React, { useEffect, useState } from 'react';
import { Controlled } from 'react-codemirror2';
import store from '../../store';
import alertSlice from '../../store/alert';
import RequestButton from './RequestButton';
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
    value: () => "some text",
    toggledValue?: () =>  "some text"
    nonToggle?: boolean,
    customCopyFunction?: (text) => void;
  }
]
supportedParseNames: names of options that can be parsed using onParse function.
canCopy: shows copy to clipboard button
supportedSendEditedNames: names of options that can be edited and send.
this requires to pass token as props.
*/

const isFunction = (arg) => {
  return typeof arg === 'function';
};

const CommonRequestPreview = ({
  options,
  className,
  onParse,
  supportedParseNames,
  supportedSendEditedNames,
  canCopy = false,
  sendEditedRequest,
  onSendEdited,
  id,
  additionalCodeMirrorOptions = {},
}) => {
  const [toggled, setToggled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options ? options[0] : {});
  const [text, setText] = useState(() => {
    return isFunction(selectedOption.value) ? selectedOption.value() : selectedOption.value;
  });
  const [hasTextChanged, setHasTextChanged] = useState(false);

  useEffect(() => {
    setSelectedOption((s) => {
      if (options) {
        return options.find((opt) => opt.name === s.name) ?? options[0];
      }
      return {};
    });
  }, [options]);

  useEffect(() => {
    if (selectedOption) {
      if (toggled) {
        setText(
          isFunction(selectedOption.toggledValue)
            ? selectedOption.toggledValue()
            : selectedOption.toggledValue ?? 'Please send the request to see the response.',
        );
      } else {
        setText(isFunction(selectedOption.value) ? selectedOption.value() : selectedOption.value);
      }
    }
    setHasTextChanged(false);
  }, [selectedOption, toggled]);

  const handleSelectedOptionChange = (e) => {
    const newOption = options.find((opt) => opt.name === e.target.value);
    if (newOption.nonToggle && toggled) {
      setToggled(false);
    }
    setSelectedOption(newOption);
  };

  const handleCopy = () => {
    if (selectedOption.customCopyFunction !== undefined) {
      selectedOption.customCopyFunction(text);
    } else {
      navigator.clipboard.writeText(text.replace(/(\r\n|\n|\r)/gm, ''));
    }
  };

  const handleToggleChange = () => {
    setToggled(!toggled);
  };
  return (
    <>
      {options.length > 1 ? (
        <div className="toggle-with-label">
          <label className="form__label">Request</label>
          <select
            className="form__input form__input--fit"
            value={selectedOption.name}
            onChange={handleSelectedOptionChange}
          >
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
          ...additionalCodeMirrorOptions,
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
        </div>
      )}
      <div className="u-flex-aligned u-margin-top-tiny">
        {canCopy && (
          <button className="secondary-button" style={{ marginTop: 0 }} onClick={handleCopy}>
            Copy
          </button>
        )}
        {onParse !== undefined && hasTextChanged && supportedParseNames?.includes(selectedOption.name) && (
          <button className="secondary-button" style={{ margin: '0 1rem' }} onClick={() => onParse(text)}>
            Parse
          </button>
        )}
        {hasTextChanged && supportedSendEditedNames?.includes(selectedOption.name) && (
          <RequestButton
            buttonText="Send Edited Request"
            request={(args) => sendEditedRequest(text, args)}
            args={[]}
            className="secondary-button"
            responseHandler={onSendEdited}
            validation={true}
            errorHandler={() =>
              store.dispatch(alertSlice.actions.addAlert({ type: 'WARNING', text: 'Something went wrong' }))
            }
          />
        )}
      </div>
    </>
  );
};

export default CommonRequestPreview;
