import React, { useState } from "react";
import Session from "./Schedule/Session";
import SessionRecording from "./Schedule/SessionRecording";
import SpeakersHost from "./Schedule/SpeakersHost";
import Activity from "./Schedule/Activity";

const Schedule = ({ activities }) => {
  const [activeLink, setActiveLink] = useState("session");
  const [showSession, setShowSession] = useState(true);
  const [showSpeakersHost, setShowSpeakersHost] = useState(false);
  const [showSessionRecording, setShowSessionRecording] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  
  const formatTimeTo12Hour = (timeString) => {
    if (!/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString; // Return the original timeString
    }

    const [hours, minutes] = timeString.split(":").map(Number);

    // Check if hours and minutes are valid numbers
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString; // Return the original timeString
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const handleMenuClick = (link) => {
    setActiveLink(link);
    if (link === "session") {
      setShowSession(true);
      setShowSpeakersHost(false);
      setShowSessionRecording(false);
      setShowActivity(false);
    } else if (link === "speakersandhosts") {
      setShowSession(false);
      setShowSpeakersHost(true);
      setShowSessionRecording(false);
      setShowActivity(false);
    } else if (link === "session_recording") {
      setShowSession(false);
      setShowSpeakersHost(false);
      setShowSessionRecording(true);
      setShowActivity(false);
    } else if (link === "activity") {
      setShowSession(false);
      setShowSpeakersHost(false);
      setShowSessionRecording(false);
      setShowActivity(true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4 bg-gray-700 bg-opacity-20 px-8 py-8 rounded-2xl flex gap-10">
        <ul className="flex flex-col text-gray-200 tracking-wide gap-4">
          <li
            className={
              activeLink === "session"
                ? "py-2 pr-2 rounded-md border-r-2 border-secondry"
                : "py-2 cursor-pointer"
            }
            onClick={() => handleMenuClick("session")}
          >
            Session
          </li>
          <li
            className={
              activeLink === "speakersandhosts"
                ? "py-2 pr-2 rounded-md border-r-2 border-secondry"
                : "py-2 cursor-pointer"
            }
            onClick={() => handleMenuClick("speakersandhosts")}
          >
            Speakers & Hosts
          </li>
          <li
            className={
              activeLink === "session_recording"
                ? "py-2 pr-2 rounded-md border-r-2 border-secondry"
                : "py-2 cursor-pointer"
            }
            onClick={() => handleMenuClick("session_recording")}
          >
            Session Recording
          </li>
          {/* <li
            className={
              activeLink === "activity"
                ? "py-2 pr-2 rounded-md border-r-2 border-secondry"
                : "py-2 cursor-pointer"
            }
            onClick={() => handleMenuClick("activity")}
          >
            Activity
          </li> */}
        </ul>
      </div>
      <div className="md:w-3/4 bg-gray-800 bg-opacity-20 px-8 py-8 rounded-2xl flex gap-10">
        {showSession && <Session activities={activities} />}
        {showSpeakersHost && <SpeakersHost />}
        {showSessionRecording && <SessionRecording />}
        {showActivity && <Activity />}
      </div>
    </div>
  );
};

export default Schedule;
