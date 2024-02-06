import React, { useEffect, useState } from "react";
import profile from "../../../images/profile2.jpg";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
import EventList from "../../../Components/Event/EventList";
import { useAuth } from "../../../context/AuthContext";
import Topbar from "../../../Components/Event/Topbar";
import { useEvent } from "../../../context/EventContext";


const Attendeeevent = () => {
  const [eventss, setEvents] = useState([]);
  const [attendee, setAttendee] = useState("seekers");
  const [activities ,setActivites]=useState([])
  const { user} = useAuth();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
const [searchQuery, setSearchQuery] = useState("");
 const displayName = user?.displayName;
 const {events ,activity}=useEvent()

//  useEffect(()=>{
//   setEvents(events)
//   console.log(events)
// },[user ,events])


 useEffect(()=>{
 setActivites(activity)
  console.log(activity)
},[user ,activity])
 
  // useEffect(() => {
  //   if (filter === "all") {
  //     setFilteredEvents(eventss);
  //   } else {
  //     const filtered = eventss.filter((event) =>
  //       eventStatusMatchesFilter(event)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  // }, [eventss, filter]);

  
  useEffect(() => {
    if (filter === "all") {
      setFilteredEvents(activities);
    } else {
      const filtered = activities.filter((event) =>
        eventStatusMatchesFilter(event)
      );
      setFilteredEvents(filtered);
    }
  }, [activities, filter]);
  // useEffect(() => {
  //   if(eventss){
  //   const searchResults = eventss.filter((event) =>
  //     event.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredEvents(searchResults);
  // }
  // }, [eventss, searchQuery]);

  useEffect(() => {
    if (activities) {
      const searchResults = activities.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(searchResults);
    }
  }, [activities, searchQuery]);

  const eventStatusMatchesFilter = (event) => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString();

    if (filter === "upcoming") {
          const dateComponents = event.start.split("/");
          const day = parseInt(dateComponents[0], 10);
          const month = parseInt(dateComponents[1], 10);
          const year = parseInt(dateComponents[2], 10);

          const timeComponents = event.startTime.split(":");
          const hours = parseInt(timeComponents[0], 10);
          const minutes = parseInt(timeComponents[1], 10);
          const startTime = event.startTime;

          const startDate = new Date(year, month - 1, day, hours, minutes);  
          return startDate > currentDate;
    } else if (filter === "running") {
      const dateComponents = event.start.split("/");
      const day = parseInt(dateComponents[0], 10);
      const month = parseInt(dateComponents[1], 10);
      const year = parseInt(dateComponents[2], 10);

      const timeComponents = event.startTime.split(":");
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      const startTime = event.startTime;

      const startDate = new Date(year, month - 1, day, hours, minutes);
      const dateComponentss = event.end.split("/");
      const days = parseInt(dateComponentss[0], 10);
      const months = parseInt(dateComponentss[1], 10);
      const years = parseInt(dateComponentss[2], 10);

      const timeComponentss = event.endTime.split(":");
      const hourss = parseInt(timeComponentss[0], 10);
      const minutess = parseInt(timeComponentss[1], 10);
      const endTime = event.endTime;

      const endDate = new Date(years, months - 1, days, hourss, minutess);

  return (
        currentDate >= startDate &&
        currentDate <= endDate 
      );
    } else if (filter === "complete") {
      const dateComponentss = event.end.split("/");
      const days = parseInt(dateComponentss[0], 10);
      const months = parseInt(dateComponentss[1], 10);
      const years = parseInt(dateComponentss[2], 10);

      const timeComponentss = event.endTime.split(":");
      const hourss = parseInt(timeComponentss[0], 10);
      const minutess = parseInt(timeComponentss[1], 10);
      const endTime = event.endTime;

      const endDate = new Date(years, months - 1, days, hourss, minutess);

  return endDate < currentDate;
    }

    return false;
  };


  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className=" w-full container text-gray-100 mx-auto py-5 gap-5">
      <div className="  flex flex-col md:flex-row py-5 gap-5">
        <div className="md:w-1/5 w-full">
          <div className="w-full bg-gray-700 bg-opacity-20 px-8 py-8 rounded-3xl">
            <div className="mb-5 w-full">
              <h2 className="tracking-wide  ">My Profile</h2>
            </div>
            <div className="w-fit">
              <img
                src={profile}
                alt="profile"
                className="w-40 h-40 rounded-full"
              />
            </div>
            <div className="w-full mt-3">
              
              <p>User Name</p>
              <p className="text-gray-400">{displayName}</p>

              <p className="my-2">About Me: </p>
              <p className="text-gray-400">{user?.role}</p>

            </div>
          </div>
        </div>
        <div className="md:w-3/4 w-full">
          <Topbar
            user={attendee}
            handleFilter={handleFilter}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <div className=" bg-gray-700 bg-opacity-20 rounded-xl p-5">
            <EventList activities={filteredEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendeeevent;
