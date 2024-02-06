import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Sidebar from "../../Components/Event/Sidebar";
import Topbar from "../../Components/Event/Topbar";
import Header from "../../Components/Layout/Header";
import EventList from "../../Components/Event/EventList";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";

const Dashboard = () => {
  const [eventss, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivites] = useState([]);

  const { user } = useAuth();
  const { events, activity } = useEvent();
  console.log(activity);

  // useEffect(()=>{
  //   setEvents(events)
  //   console.log(events)
  // },[user ,events])

  useEffect(() => {
    setActivites(activity);
  }, [user, activity]);

  // useEffect(() => {
  //   if (filter === "all") {
  //     setFilteredEvents(eventss);
  //     console.log(eventss)
  //   } else {
  //     const filtered = eventss.filter((event) =>
  //       eventStatusMatchesFilter(event)
  //     );
  //     setFilteredEvents(filtered);
  //   }
  // }, [eventss, filter ]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredEvents(activity);
    } else {
      const filtered = activities.filter((event) =>
        eventStatusMatchesFilter(event)
      );
      setFilteredEvents(filtered);
    }
  }, [activities, filter]);

  // useEffect(() => {
  //   if (eventss) {
  //     const searchResults = eventss.filter((event) =>
  //       event.title.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setFilteredEvents(searchResults);
  //   }
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

      return currentDate >= startDate && currentDate <= endDate;
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
    <>
      <div className="  flex flex-col md:flex-row container text-gray-100 mx-auto py-5 gap-5">
        <div className="md:w-1/4 w-full">
          <Sidebar />
        </div>
        <div className="md:w-3/4 w-full">
          <Topbar
            handleFilter={handleFilter}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
          />
          <div className=" bg-gray-700 bg-opacity-20 rounded-xl p-5">
            <EventList activities={filteredEvents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
