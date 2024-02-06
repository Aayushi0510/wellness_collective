import React from "react";

const CustomPopup = ({message, visible, setVisible}) => {

  
  return (
    <>
      {visible && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black bg-opacity-70"></div>
            <div className="bg-white sm:w-1/4  rounded-lg overflow-hidden z-10">
              <div className="px-6 py-8 text-black">{message}</div>
              <div className="px-6 py-2 bg-gray-100">
                <button
                  onClick={()=> setVisible(false)}
                  className="inline-flex items-center px-4 py-2 bg-secondry border border-transparent rounded-md font-semibold text-black tracking-wide hover:bg-primary active:bg-secondry focus:outline-none focus:border-secondry focus:ring ring-offset-gray-500 ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomPopup;
