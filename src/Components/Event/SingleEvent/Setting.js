import React, { useState } from "react";


const Setting = () => {
  const [isCheckedChat, setIsCheckedChat] = useState(false);

  const handleToggleChat = () => {
    setIsCheckedChat(!isCheckedChat);
  };
  return (
    <div className="w-full  bg-gray-700 bg-opacity-20  px-8 py-8 rounded-2xl ">
      <h2 className=" tracking-wide">Setting</h2>
      <div className="bg-black w-fit px-5 py-5 rounded-lg mt-4 flex items-center gap-5">
        <h2 className="tracking-wide ">Session Recording </h2>
        <div>
              <label
                htmlFor="toggle-switch"
                className="flex items-center gap-3"
              >
                <p>Off</p>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="toggle-switch"
                    name="toggle-switch"
                    className="sr-only"
                    checked={isCheckedChat}
                    onChange={handleToggleChat}
                  />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                      isCheckedChat ? "translate-x-full bg-green-400" : ""
                    }`}
                  ></div>
                </div>
                <p>On</p>
              </label>
            </div>
      </div>
    </div>
  );
};

export default Setting;
