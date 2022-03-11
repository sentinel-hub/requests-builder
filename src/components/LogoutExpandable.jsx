import React, { useState } from 'react';

const LogoutExpandable = ({ userdata, doLogout, marginRight }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleLogout = () => {
    doLogout();
  };
  return (
    <div
      className="flex flex-col relative"
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      style={{ marginRight }}
    >
      <div
        className={`bg-primary-light p-4 rounded-md font-bold ${isHovering ? 'z-20 rounded-b-none' : ''}`}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
      >
        Welcome {userdata.given_name ?? 'user'}!
      </div>
      {isHovering && (
        <div className="flex absolute top-14 p-2 bg-primary-light w-full z-20 border-t border-black">
          <button className="border-none underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutExpandable;
