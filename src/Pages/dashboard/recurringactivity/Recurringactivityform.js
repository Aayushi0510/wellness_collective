import React from "react";
import { useState } from "react";
import DatePicker from "react-multi-date-picker";

const Recurringactivityform = ({
  onSubmit,
  selectedDates,
  activity,
  handleActivityChange,
  onDateChange,
  selectedActivities,
  handleImageSelect,
  getPractitionerNamesForSelectedActivities,
  loading,
}) => {
  const [showspeedNetworking, setSpeedNewtorking] = useState("no");

  return (
    <div className="py-5 d-flex">
      <form onSubmit={onSubmit} className="space-y-5 tracking-wider text-sm">
        <div className="flex flex-col space-y-3">
          <label htmlFor="event_name" className="ml-1 ">
            Event Name
          </label>
          <input
            type="text"
            name="event_title"
            id="event_title"
            placeholder="Enter Event Name"
            className="bg-transparent border border-gray-700 rounded-lg py-3 px-4 "
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="selectedDates" className="ml-1">
              Start Date
            </label>
            <DatePicker
              multiple
              id="selectedDates"
              name="selectedDates"
              format="YYYY/MM/DD"
              value={selectedDates}
              onChange={onDateChange}
              placeholder="Select Date"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4 text-black"
            />
          </div>
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="start_time" className="ml-1">
              Start Time
            </label>
            <input
              type="time"
              name="start_time"
              id="start_time"
              placeholder="Enter Event Start Time"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            />
          </div>
        </div>
        <div className="flex gap-4">
        
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="end_time" className="ml-1">
              End Time
            </label>
            <input
              type="time"
              name="end_time"
              id="end_time"
              placeholder="Enter Event End Time"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            />
          </div>
          <div className="flex w-1/2 flex-col space-y-3">
            <label htmlFor="number_participents" className="ml-1 ">
              Total Number of Participents
            </label>
            <input
              type="number"
              name="number_participents"
              id="number_participents"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4 "
            />
          </div>
        
        </div>
        <div className="flex gap-4">
        <div className="flex w-1/2 flex-col space-y-3">
          <label htmlFor="img" className="ml-1">
            Image
          </label>
          <input
            type="file"
            name="img"
            id="img"
            accept="image/*"
            onChange={handleImageSelect}
            className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
          />
        </div>
  
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="speedNetworking" className="ml-1 ">
              Speed Networking
            </label>
            <select
              name="speedNetworking"
              id="speedNetworking"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
              onChange={(e) => setSpeedNewtorking(e.target.value)}
            >
              <option className="text-black" value="no">
                No
              </option>
              <option className="text-black" value="Yes">
                Yes
              </option>
            </select>
          </div>
        </div>
        {showspeedNetworking === "Yes" && (
          <div className="flex gap-4">
           <div className="w-1/2 flex flex-col space-y-3">
              <label htmlFor="networkingTime" className="ml-1">
                 Networking Group Time
              </label>
              <select
              name="networkingTime"
              id="networkingTime"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            >
              <option className="text-black" value="">
                Select{" "}
              </option>
              <option className="text-black" value="5">
                5 min
              </option>
              <option className="text-black" value="10">
                10 min
              </option>
              <option className="text-black" value="15">
                15 min
              </option>
              <option className="text-black" value="20">
                20 min
              </option>
             
            </select>
            </div>
            <div className="w-1/2 flex flex-col space-y-3">
              <label htmlFor="networkingDuration" className="ml-1">
                Speed Networking  Duration
              </label>
              <select
                name="networkingDuration"
                id="networkingDuration"
                className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
              >
                <option className="text-black" value="5">
                  Select{" "}
                </option>
                <option className="text-black" value="15">
                  15 min
                </option>
                <option className="text-black" value="20">
                  20 min
                </option>
                <option className="text-black" value="30">
                  30 min
                </option>
                <option className="text-black" value="60">
                  60 min
                </option>
                <option className="text-black" value="120">
                  120 min
                </option>
                <option className="text-black" value="180">
                  180 min
                </option>
              </select>
            </div>
          </div>
        )}
        <div className="flex flex-col text-gray-400">
          <h2>Select Activities:</h2>
          <div className="grid grid-cols-3 gap-8">
          {activity.map((act) => (
              <div key={act} className="flex flex-row items-center">
                <input
                  type="checkbox"
                  id={act}
                  name="activities"
                  value={act}
                  checked={selectedActivities.includes(act)}
                  onChange={() => handleActivityChange(act)}
                />
                <label htmlFor={act} className="ml-2">
                  {act}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          {selectedActivities.length > 0 && (
           <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 pb-3">Practitioners for Selected Activities</label>
              <div className="grid grid-cols-2">
             {getPractitionerNamesForSelectedActivities().map((practitionerName) => (
              <div key={practitionerName} className="text-gray-300">
                {practitionerName}
           </div>
        ))}
      </div>
    </div>
  )}
</div>
      
        <div className="flex flex-col space-y-3">
          <label htmlFor="message" className="ml-1">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            placeholder="Enter about the event"
            className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
          >
            {loading ? "Loading" : "Create Event"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recurringactivityform;
