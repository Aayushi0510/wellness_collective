import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomPopup from "../../Components/CustomPopup";
import SeekerRegistration from "./SeekerRegistration";
import Practitionerreg from "./Practitionerreg";

const Attendeeregistration = () => {
  const navigate = useNavigate();
  const [showComponent, setShowComponent] = useState({
    seekers: true,
    practitioners: false,
  });
  const [activeLink, setActiveLink] = useState("seekers");

  const handleMenuClick = (link) => {
    setActiveLink(link);
    setShowComponent((prevState) => ({
      seekers: link === "seekers",
      practitioners: link === "practitioners",
    }));
  };
  const { seekers, practitioners } = showComponent;

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto py-12 min-h-screen ">
        <div className="flex justify-center items-center">
          <div className="md:w-3/5 w-full px-5 flex flex-col justify-center items-center ">
            <p className="text-3xl text-center text-primary tracking-wider font-bold">
              Create Account and Attend Events
            </p>

            <div className=" flex flex-row justify-between items-center w-full mx-auto mt-3 text-sm  bg-black py-3  sm:pr-0 tracking-wide">
              <ul className="flex gap-4 w-full justify-center ">
                <button
                  className={`text-center px-3 py-3 ${
                    activeLink === "seekers"
                      ? "bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black"
                      : ""
                  } rounded-xl py-1`}
                  onClick={() => handleMenuClick("seekers")}
                >
                  Seekers
                </button>
                <li
                  className={`text-center px-3 py-3 ${
                    activeLink === "practitioners"
                      ? "bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black"
                      : ""
                  } rounded-xl py-1`}
                  onClick={() => handleMenuClick("practitioners")}
                >
                  Practitioners
                </li>
              </ul>
            </div>
            {seekers && <SeekerRegistration />}
            {practitioners && <Practitionerreg />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendeeregistration;
