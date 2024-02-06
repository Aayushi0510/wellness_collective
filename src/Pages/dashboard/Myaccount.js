import { useEffect, useState } from "react";
import { FaCalendar, FaVideo, FaUser, FaPencilAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Edituserdetail from "./Edituserdetail";

const menus = [
  { name: "My Account", icon: <FaUser /> },
  {
    name: "Dashboard",
    icon: <BiSolidDashboard />,
    path: "/dashboard/attendee",
  },
];

const Myaccount = () => {
  const { user } = useAuth();
  console.log(user)
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const openEditPopup = () => {
    setIsPopupOpen(true);
    console.log(isPopupOpen)
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-6">
        <div className="col-span-3 pb-6 md:pb-10 px-2 py-4">
          <div>
            <div className="bg-[#181818] rounded-md px-4 py-8 space-y-6">
              {menus.map((menu, index) => (
                <div
                  key={index}
                  className="bg-[#000] px-3 flex gap-3 text-md rounded-lg py-4 items-center cursor-pointer"
                  onClick={() => {
                    navigate(menu.path);
                  }}
                >
                  {menu.icon}
                  {menu.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-9">
          <div className="flex justify-between items-center p-2"></div>
          <div>
            <div className="bg-[#181818] rounded-md px-4 py-10">
              <form className="p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl text-center text-primary tracking-wider font-bold">
                    Account Details
                  </h2>
                  {!isEditable && (
                    <div
                      className="text-black bg-secondry p-2 rounded-full bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary font-semibold uppercase cursor-pointer"
                      onClick={openEditPopup}
                    >
                      <FaPencilAlt />
                    </div>
                  )}
                  {isPopupOpen && (
                    <Edituserdetail
                      user={user}
                      onClose={() => setIsPopupOpen(false)} // Function to close the popup
                    />
                  )}
                </div>
                {user ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <input
                        placeholder="Name"
                        type="text"
                        value={user.displayName}
                        className="px-4 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Email"
                        type="email"
                        value={user.email}
                        className="px-4 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Password"
                        type="password"
                        value={user.password}
                        className="px-4 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400">
                        You Have Enough Food
                      </label>
                      <select
                        name="foodValue"
                        value={user.foodValue}
                        className="px-3 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                      >
                        <option value="">--Select an option--</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400">Housing</label>
                      <select
                        name="housingValue"
                        value={user.housingValue}
                        className="px-3 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                      >
                        <option value="">--Select an option--</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {isEditable && (
                        <button className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black font-semibold uppercase w-full py-3 px-7 rounded-3xl">
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myaccount;
