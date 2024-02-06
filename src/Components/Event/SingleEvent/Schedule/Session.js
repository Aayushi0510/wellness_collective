import React from "react";
import { Link } from "react-router-dom";

const Session = ({event}) => {

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

function formatDate(inputDate) {
  const [day, month, year] = inputDate.split('/');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  return `${day}th ${monthNames[parseInt(month, 10) - 1]}`;
}
  const startTimeParts = event.startTime.split(":");
  const startHours = parseInt(startTimeParts[0]);
  const startMinutes = parseInt(startTimeParts[1]);
  const adjustedMinutes = parseInt(startMinutes) + parseInt(event.welcometime);
  const adjustedHours = startHours + Math.floor(adjustedMinutes / 60);
  const adjustedMinutesRemainder = adjustedMinutes % 60;
  const adjustedStartTime = `${adjustedHours
    .toString()
    .padStart(2, "0")}:${adjustedMinutesRemainder.toString().padStart(2, "0")}`;

  return (
    <div className="w-full pb-2">
     
      <div className=" flex justify-between">
        <div>
          <h2>Session</h2>
          <div className="mt-3">
            <div className="bg-primary text-black px-3 py-3 w-30 rounded-lg">
              <p>{formatDate(event.start)}</p>
            </div>
          </div>
        </div>
        {/* <div>
          <Link href="/event">
            <span className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary font-semibold text-gray-800 text-sm tracking-wider w-full py-3 px-5 rounded-3xl">
              Add Activity
            </span>
          </Link>
        </div> */}
      </div>
      <div className="border border-gray-600 w-full mt-7"></div>
      <div className="bg-secondry py-2 px-6 text-black rounded-lg flex gap-10 mt-7 w-fit ">
        <p>Welcome Session</p>
        <p>{formatTimeTo12Hour(event.startTime)} - {event.welcometime} min</p>
      </div>

      <div className="bg-secondry py-2 px-6 text-black rounded-lg flex gap-10 mt-7 ml-40 w-fit ">
        <p>Start Event</p>
        <p>{formatTimeTo12Hour(adjustedStartTime)} - {event.grouptime} min</p>
      </div>
    </div>
  );
};

export default Session;
