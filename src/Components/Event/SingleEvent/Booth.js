import React, { useState } from "react";

const Booth = () => {
  const [isCheckedChat, setIsCheckedChat] = useState(false);
  const [isCheckedTable, setIsCheckedTable] = useState(false);
  const [numTables, setNumTables] = useState(1);

  const handleToggleChat = () => {
    setIsCheckedChat(!isCheckedChat);
  };
  const handleToggleTable = () => {
    setIsCheckedTable(!isCheckedTable);
  };
  const increaseNumTables = () => {
    if (numTables < 10) {
      setNumTables(numTables + 1);
    }
  };

  const decreaseNumTables = () => {
    if (numTables > 1) {
      setNumTables(numTables - 1);
    }
  };

  return (
    <div className="w-full mx-auto bg-gray-700 bg-opacity-20  px-8 py-8 rounded-2xl ">
      <div className="flex justify-between items-center">
        <div className="ml-2">
          <h2>Booth Details</h2>
        </div>
        <div>
          <button className="bg-secondry px-6 py-2 text-sm tracking-wider font-semibold text-gray-900 rounded-2xl">
            Create
          </button>
        </div>
      </div>
      <div className="flex gap-5 mt-4">
        <div className="w-2/3 py-5 px-5 bg-black rounded-lg">
        <table className="min-w-full ">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium  uppercase tracking-wider">
                S.No
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium  uppercase tracking-wider">
                Booth Name
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium  uppercase tracking-wider">
               Chat Option
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium  uppercase tracking-wider">
                Table
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium  uppercase tracking-wider">
               Action
              </th>
            </tr>
          </thead>
          <tbody className=" ">
            <tr>
              <td className="py-4 px-6 text-sm font-medium ">1</td>
              <td className="py-4 px-6 text-sm font-medium ">
                Demo Booth
              </td>
              <td className="py-4 px-6 text-sm font-medium 0">
               Yes
              </td>
              <td className="py-4 px-6 text-sm font-medium ">5</td>
              <td className="py-4 px-6 text-sm font-medium text-green-600">
               Edit
              </td>
            </tr>
           
          </tbody>
        </table>
        </div>
        <div className="py-5 bg-black w-1/3 px-5 rounded-lg">
          <div>
            <h2>Booth Name</h2>
            <input
              type="text"
              placeholder="Name"
              id="name"
              className="px-4 mt-2 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 tracking-wide">
            <h2 className="">Freatures -</h2>
            <div>
              <label
                htmlFor="toggle-switch"
                className="flex items-center justify-between"
              >
                <p>Chat</p>
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
              </label>
            </div>
            <div>
              <label
                htmlFor="switch"
                className="flex items-center justify-between"
              >
                <p>Table</p>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="switch"
                    name="switch"
                    className="sr-only"
                    checked={isCheckedTable}
                    onChange={handleToggleTable}
                  />
                  <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                      isCheckedTable ? "translate-x-full bg-green-400" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            {isCheckedTable ? <div className="flex justify-between items-center">
  <label htmlFor="num-tables" className="mr-4">Number of Tables:</label>
  <div className="flex items-center">
    <button
      type="button"
      onClick={decreaseNumTables}
      className="w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-l outline-none focus:outline-none hover:bg-gray-300"
    >
      -
    </button>
    <input
      id="num-tables"
      name="num-tables"
      type="number"
      className="w-16 h-8 px-2 text-center rounded-none text-black "
      min="1"
      max="10"
      value={numTables}
      onChange={(e) => setNumTables(parseInt(e.target.value))}
    />
    <button
      type="button"
      onClick={increaseNumTables}
      className="w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-r outline-none focus:outline-none hover:bg-gray-300"
    >
      +
    </button>
  </div>
</div>
 :""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booth;
