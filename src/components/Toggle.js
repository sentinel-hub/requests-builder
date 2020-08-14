import React from 'react';

const Toggle = ({ onChange, className, id, checked, name, defaultChecked }) => {
  return (
    <div className={className ? className : ''}>
      <label className="switch">
        <input
          defaultChecked={defaultChecked}
          name={name}
          checked={checked}
          id={id}
          onChange={onChange}
          type="checkbox"
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Toggle;
