import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Topbar = ({ handleFilter, handleSearch, searchQuery }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    handleFilter(filter);
  };
  
  return (
    <div className="py-3 px-3">
      <div className="flex flex-col-reverse md:flex-row gap-5 justify-between md:items-center ">
        <p className="text-xl font-semibold ml-2 md:ml-0">My Events</p>
        {user && user.role === "host" && ( // Only show these links if the user is a host
          <div className="flex gap-4">
            {/* <Link
              to="/dashboard/createevent"
              className="w-fit bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black px-8 py-3 rounded-3xl"
            >
              Create Speed Networking Event
            </Link> */}
            <Link
              to="/dashboard/createactivity"
              className="w-fit bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black px-8 py-3 rounded-3xl"
            >
              Create Event
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row mt-3 gap-5 justify-between items-center py-3">
        <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-5 items-center">
          <p>Showing</p>
          <ul className="flex justify-between items-center text-center text-sm md:text-base w-full">
            <button
              onClick={() => handleFilterClick("all")}
              className={`text-center w-full ${
                activeFilter === "all" ? "bg-gray-300 text-black" : ""
              } rounded-xl py-1`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterClick("upcoming")}
              className={`text-center w-full ${
                activeFilter === "upcoming" ? "bg-gray-300 text-black" : ""
              } rounded-xl py-1`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterClick("running")}
              className={`text-center w-full ${
                activeFilter === "running" ? "bg-gray-300 text-black" : ""
              } rounded-xl py-1`}
            >
              Ongoing
            </button>
            <button
              onClick={() => handleFilterClick("complete")}
              className={`text-center w-full ${
                activeFilter === "complete" ? "bg-gray-300 text-black" : ""
              } rounded-xl py-1`}
            >
              Complete
            </button>
          </ul>
        </div>
        <div className="w-full lg:w-2/5">
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
