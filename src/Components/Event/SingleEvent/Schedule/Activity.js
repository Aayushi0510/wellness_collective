import React from "react";

const Activity = () => {
  
  return (
    <div className="w-full">
      <h2 className="text-xl tracking-wide">Add an activity</h2>
      <div className="flex  justify-between gap-4 mt-5">
        <div className="w-3/5 flex flex-col gap-5">
          <form action="">
            <div className="flex gap-4">
              <input
                type="date"
                placeholder="Name"
                id="password"
                // value=''
                // onChange={''}
                className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
              />
              <input
                type="time"
                placeholder="Time"
                id="password"
                // value=''
                // onChange={''}
                className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
              />
              <div className="border border-gray-700 flex gap-3 items-center px-3 rounded-lg">
                <p>30</p>
                <p>mins</p>
              </div>
            </div>
          </form>
          <div className="mt-3 flex flex-col gap-5">
            <h2 className="tracking-wide">
              What is the ideal length of a conversation?
            </h2>
            <div>
              <select className="border rounded-lg border-gray-600 tracking-wide  px-3 py-3 bg-[#06080b] text-sm">
                <option value="" disabled selected>
                  Select a minute value
                </option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div>
              <label for="networking-switch" className="switch-label flex items-center">
                <input
                  type="checkbox"
                  id="networking-switch"
                  name="networking-switch"
                />
                <span className="slider"></span>
                <span className="switch-text text-base text-gray-400 tracking-wide ">
                  Allow participants to extend networking time as event ends.
                </span>
              </label>
            </div>
            <div>
            <h2 className="tracking-wide mb-3">
              What is the ideal length of a conversation?
            </h2>
              <select className="border rounded-lg border-gray-600 tracking-wide  px-3 py-3 bg-[#06080b] text-sm">
                <option value="5">2 minutes</option>
                <option value="10">3 minutes</option>
                <option value="15">4 minutes</option>
                <option value="20">5 minutes</option>
              </select>
            </div>
            <div>
            <div className="w-full flex justify-between">
            <h2 className="tracking-wide mb-3">
            Matching rules
            </h2> 
            <p className="text-primary">+ Add/Edit rules</p>
            </div>
            <p className="text-gray-400">Anyone can match with anyone</p>
            </div>
            <button className="w-fit px-10 py-3 bg-primary text-black rounded-xl">Save</button>
          </div>
        </div>
        <div className="w-2/5 px-4 flex flex-col gap-4">
            <div>
            <h2 className="tracking-wide mb-3">
           Session Name
            </h2> 
            <div className="border border-gray-600 rounded-lg px-3 py-3">
            <p>Event Name</p> 
            </div>
            </div>
            <div>
            <h2 className="tracking-wide mb-3">
           Session Type
            </h2> 
            <div className="border border-gray-600 rounded-lg px-3 py-3">
            <p>Speed Networking</p> 
            </div>
            </div>
            <div>
            <h2 className="tracking-wide mb-3">
           Session Message
            </h2> 
            <div className="">
            <input type="text" name="" id="" className="border border-gray-600 rounded-lg px-3 py-3 bg-transparent w-full" />
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
