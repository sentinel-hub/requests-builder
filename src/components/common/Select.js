import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useDidMountEffect } from '../../utils/hooks';

// options: [ {name: "", value: "" }];

export default function Select({
  options,
  selected,
  onChange,
  label,
  buttonClassNames,
  disabled,
  optionsClassNames,
}) {
  const [selectedName, setSelectedName] = useState(
    () => options.find((opt) => opt.value === selected)?.name ?? options[0]?.name,
  );

  useDidMountEffect(() => {
    const newName = options.find((opt) => opt.value === selected)?.name;
    if (newName) {
      setSelectedName(newName);
    } else {
      setSelectedName(options[0].name);
    }
  }, [selected]);

  return (
    <div className="xl:w-4/5 z-1 w-full">
      <Listbox value={selected} onChange={onChange} disabled={disabled}>
        {label && typeof label === 'string' ? (
          <Listbox.Label className="form__label">{label}</Listbox.Label>
        ) : (
          label
        )}
        <div className="relative">
          <Listbox.Button
            className={`relative border border-primary-light active:border-2 active:border-primary hover:border-primary focus:border-2 focus:border-primary w-full py-1.5 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm ${
              buttonClassNames ?? ''
            } ${disabled ? 'bg-gray-300 cursor-not-allowed' : ''}`}
          >
            <span className="block truncate">{selectedName}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={`z-20 overflow-auto absolute w-full py-1 mt-1 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                optionsClassNames ?? ''
              }`}
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `${active ? 'bg-primary-light' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`${active ? 'text-green-600' : 'text-green-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
