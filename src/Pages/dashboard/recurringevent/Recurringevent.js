import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";

const Recurringevent = ({
  onSubmit,
  selectedDates,
  onDateChange,
  handleImageSelect,
  loading,
}) => {
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
            <label htmlFor="welcomesession" className="ml-1 ">
              Welcome Session
            </label>
            <select
              name="welcomesession"
              id="welcomesession"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            >
              <option className="text-black" value="yes">
                Yes
              </option>
              <option className="text-black" value="no">
                No
              </option>
            </select>
          </div>
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="end_time" className="ml-1">
              Welcome Session Time Duration
            </label>
            <select
              name="welcometime"
              id="welcometime"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            >
              <option className="text-black" value="2">
                2 min
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
              <option className="text-black" value="30">
                30 min
              </option>
              <option className="text-black" value="45">
                45 min
              </option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="group_time" className="ml-1">
              Conversation Time Duration{" "}
            </label>
            <select
              name="group_time"
              id="GroupTime"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            >
              <option className="text-black" value="">
                Select
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
              <option className="text-black" value="30">
                30 min
              </option>
              <option className="text-black" value="45">
                45 min
              </option>
            </select>
          </div>

          <div className="w-1/2 flex flex-col space-y-3">
            <label htmlFor="meeting_time" className="ml-1">
              Networking Session Time duration
            </label>
            <select
              name="meeting_time"
              id="meeting_time"
              className="bg-transparent border border-gray-700 rounded-lg py-3 px-4"
            >
              <option className="text-black" value="">
                Select
              </option>
              <option className="text-black" value="30">
                30 min
              </option>
              <option className="text-black" value="60">
                60 min
              </option>
              <option className="text-black" value="90">
                90 min
              </option>
              <option className="text-black" value="120">
                120 min
              </option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
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
            className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
          >
            {loading ? "Loading" : "Create Event"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Recurringevent;
