import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";

const EventList = ({ eventss  ,activities}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {activity}=useEvent()


  // const handleViewDetails = (eventId) => {
  //   if (eventId) {
  //     navigate(`/dashboard/event/${eventId}`);
  //   }
  // };
  const handleViewDetails = (eventId) => {
    console.log(eventId)
    if (eventId) {
      navigate(`/dashboard/activity/${eventId}`);
    }
  };


  const [eventStatuses, setEventStatuses] = useState("Complete");
  const [registeredEvents, setRegisteredEvents] = useState();

  const is12HourFormat = (timeString) => {
    return /^\d{1,2}:\d{2} [APap][Mm]$/.test(timeString);
  };
  
 
  const formatTimeTo12Hour = (timeString) => {

    if (is12HourFormat(timeString)) {
      return timeString; 
    }

    if (!/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString; 
    }

    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  // useEffect(() => {
  //   if (user && user.role === "seekers") {
  //     const filterUserRegisterEvents = () => {
  //       const registerEvents = eventss.filter((event) =>
  //         event.registeredUsers.includes(user.uid)
  //       );
  //       setRegisteredEvents(registerEvents);
  //     };
  //     filterUserRegisterEvents();
  //   } else {
  //     setRegisteredEvents(eventss);
  //   }
  // }, [user, eventss]);

  
  useEffect(() => {
 if(user){
    if (user.role === "seekers" || user.role ==="practitioners") {
      const filterUserRegisterEvents = () => {
        const registerEvents = activities?.filter((event) =>
          event.registeredUsers.includes(user.uid)
        );
        setRegisteredEvents(registerEvents);
      };
      filterUserRegisterEvents();
    } 
  else {
    console.log("fabf")
      setRegisteredEvents(activities);
    }
 }
  
  }, [user, activities]);



  // useEffect(() => {
  //   const updateEventStatuses = () => {
  //     const currentDate = new Date();
  //     const updatedEventStatuses = {};
  //     if (eventss) {
  //       eventss.forEach((event) => {
  //         const dateComponents = event.start.split("/");
  //         const day = parseInt(dateComponents[0], 10);
  //         const month = parseInt(dateComponents[1], 10);
  //         const year = parseInt(dateComponents[2], 10);

  //         const timeComponents = event.startTime.split(":");
  //         const hours = parseInt(timeComponents[0], 10);
  //         const minutes = parseInt(timeComponents[1], 10);

  //         const startDate = new Date(year, month - 1, day, hours, minutes);

  //         const dateComponentss = event.end.split("/");
  //         const days = parseInt(dateComponentss[0], 10);
  //         const months = parseInt(dateComponentss[1], 10);
  //         const years = parseInt(dateComponentss[2], 10);

  //         const timeComponentss = event.endTime.split(":");
  //         const hourss = parseInt(timeComponentss[0], 10);
  //         const minutess = parseInt(timeComponentss[1], 10);

  //         const endDate = new Date(years, months - 1, days, hourss, minutess);
  //         const options = {
  //           hour: "numeric",
  //           minute: "numeric",
  //           hour12: false,
  //         };
  //         const currentTime = currentDate.toLocaleTimeString("en-GB" ,options);
  //         const startTime = startDate.toLocaleString("en-GB", options);

  //         const endTime = endDate.toLocaleString("en-GB", options);

  //         if (startDate > currentDate) {
  //           updatedEventStatuses[event.id] = "Upcoming";
  //         } else if (currentDate <= endDate && currentDate >= startDate) {
  //           if (startDate <= endDate) {
  //             updatedEventStatuses[event.id] = "Running";
  //           } else if (startTime > currentTime) {
  //             updatedEventStatuses[event.id] = "Upcoming";
  //           } else {
  //             updatedEventStatuses[event.id] = "Complete";
  //           }
  //         } else {
  //           updatedEventStatuses[event.id] = "Complete";
  //         }
  //       });
  //     }
  //     setEventStatuses(updatedEventStatuses);
  //   };
  //   updateEventStatuses();
  //   const interval = setInterval(updateEventStatuses, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [eventss, user]);

  

  useEffect(() => {
    const updateEventStatuses = () => {
      const currentDate = new Date();
      const updatedEventStatuses = {};
      if (activities) {
        activities.forEach((event) => {
          const dateComponents = event.start.split("/");
          const day = parseInt(dateComponents[0], 10);
          const month = parseInt(dateComponents[1], 10);
          const year = parseInt(dateComponents[2], 10);

          const timeComponents = event.startTime.split(":");
          const hours = parseInt(timeComponents[0], 10);
          const minutes = parseInt(timeComponents[1], 10);

          const startDate = new Date(year, month - 1, day, hours, minutes);

          const dateComponentss = event.end.split("/");
          const days = parseInt(dateComponentss[0], 10);
          const months = parseInt(dateComponentss[1], 10);
          const years = parseInt(dateComponentss[2], 10);

          const timeComponentss = event.endTime.split(":");
          const hourss = parseInt(timeComponentss[0], 10);
          const minutess = parseInt(timeComponentss[1], 10);

          const endDate = new Date(years, months - 1, days, hourss, minutess);
          const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          };
          const currentTime = currentDate.toLocaleTimeString("en-GB" ,options);
          const startTime = startDate.toLocaleString("en-GB", options);

          const endTime = endDate.toLocaleString("en-GB", options);

          if (startDate > currentDate) {
            updatedEventStatuses[event.id] = "Upcoming";
          } else if (currentDate <= endDate && currentDate >= startDate) {
            if (startDate <= endDate) {
              updatedEventStatuses[event.id] = "Running";
            } else if (startTime > currentTime) {
              updatedEventStatuses[event.id] = "Upcoming";
            } else {
              updatedEventStatuses[event.id] = "Complete";
            }
          } else {
            updatedEventStatuses[event.id] = "Complete";
          }
        });
      }
      setEventStatuses(updatedEventStatuses);
    };
    updateEventStatuses();
    const interval = setInterval(updateEventStatuses, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activities, user]);

  

  return (
    <div>
      <ul className="space-y-6">
        <li className="md:flex hidden justify-between items-center bg-black bg-opacity-40 rounded-xl py-4 px-1 md:px-4">
          <div className="w-full md:w-3/5">
            <h2 className="px-2 tracking-wider">Event Title</h2>
          </div>
          <div className="w-full md:w-1/5 md:text-center">
            <h2 className="text-center tracking-wider">Status</h2>
          </div>
          <div className="w-full md:w-1/5 md:text-center">
            <h2 className="text-center tracking-wider">Action</h2>
          </div>
        </li>
        {registeredEvents &&
          registeredEvents.map((e) => {
            const eventStatus = eventStatuses[e.id] || "";
            return (
              <li
                key={e.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center bg-black bg-opacity-20 shadow-lg rounded-xl py-4 px-4"
              >
                <div className="w-full md:w-3/5 flex flex-col md:flex-row gap-5 md:items-center">
                  <img
                    src={e.img}
                    alt="eventimg"
                    width={150}
                    height={150}
                    className="rounded-lg w-full md:w-36"
                  />
                  <div className="space-y-4">
                    <h2 className="tracking-wide capitalize">{e.title}</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-1 text-gray-400">
                        <p className="text-xs">Start Date: {e.start} </p>
                        <p className="text-xs">
                          Start Time: {formatTimeTo12Hour(e.startTime)}{" "}
                        </p>
                      </div>
                      <div className="space-y-1 text-gray-400">
                        <p className="text-xs">End Date: {e.end} </p>
                        <p className="text-xs">
                          End Time: {formatTimeTo12Hour(e.endTime)}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full my-3 md:my-0 md:w-1/5   md:text-center">
                  <p
                    className={
                      eventStatus === "Complete"
                        ? "text-red-500"
                        : eventStatus === "Running"
                        ? "text-secondry animate-blink "
                        : "text-primary"
                    }
                  >
                    {eventStatus}
                  </p>
                </div>
                <div className="w-full md:w-1/5 md:text-center">
                  <button
                    onClick={() => handleViewDetails(e.id)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-xl px-5 py-2 text-black text-sm"
                  >
                    View Event
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default EventList;
