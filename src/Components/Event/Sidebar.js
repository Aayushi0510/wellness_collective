import React from "react";
import { FaVideo } from "react-icons/fa";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const sideMenu = [
  {
    id: 1,
    icon: <BsFillCalendarEventFill />,
    name: "Events",
    url: "/dashboard",
  },
  {
    id: 2,
    icon: <FaVideo />,
    name: "Video Library",
    url: "/dashboard/vedieoliabrary",
  },
  {
    id: 3,
    icon: <RiTeamFill />,
    name: "All Attendee",
    url: "/dashboard/team",
  },
];
const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleItemClick = (url) => {
    setActiveLink(url);
  };

  return (
    <div className="w-full bg-gray-700 bg-opacity-20 rounded-xl px-5 py-8">
      <div className="space-y-5">
        <p>You are an event manager</p>
        <hr />
      </div>
      <div className="mt-5">
        <ul className="w-full flex lg:flex-col md:flex-col flex-row space-y-0 lg:space-y-4 md:space-y-4 ">
          {sideMenu.map((item) => (
             <li key={item.id}>
             <Link
               to={item.url}
               className={`text-xs lg:text-lg flex items-center gap-3 text-center bg-black bg-opacity-30 shadow-md px-5 py-4 rounded-lg ${
                 activeLink === item.url ? "border-r-4 active:border-primary" : ""
               }`}
               onClick={() => handleItemClick(item.url)}
               >
               {item.icon}
               {item.name}
             </Link>
           </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
