import React, { useEffect } from "react";
import { BsArrowDown } from "react-icons/bs";
import { FaHeart, FaVideo } from "react-icons/fa";
import bannerImg1 from "../../images/bannerprofile1.jpg";
import bannerImg2 from "../../images/bannerprofile2.jpg";
import profile2 from "../../images/profile2.jpg";
import profile3 from "../../images/profile3.jpg";
import chaticon from "../../images/chat.png";
import speednetworking from "../../images/speedn.svg";
import videoconference from "../../images/video_conference.svg";
import VideomenuIcon from "../../Components/Home/VideomenuIcon.js";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../Layout/Header";

const Banner = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (user) {
      if (user.role === "host") {
        navigate("/dashboard");
      } else if (user.role === "seekers") {
        navigate("/dashboard/attendee");
      }
    }
  }, []);

  return (
    <>
      <div className="bg-black  relative overflow-hidden text-white w-full">
        <div className="container mx-auto lg:px-10 px-7 pt-24 pb-5 flex md:flex-row flex-col justify-between gap-6">
          <div className="md:w-5/12 w-full">
            <div className=" opacity-40 -mt-5 mb-3">
              <FaVideo size={60} className="text-primary rotate-12" />
            </div>
            <h1 className="lg:text-6xl xl:text-7xl text-5xl tracking-wide font-bold ">
              Now Video Conferencing is
              <span className="text-secondry ml-2 underline">Easier</span> than
              Ever
            </h1>
            <div className="mt-8 flex flex-wrap gap-5 items-center">
              <div className="">
                <button className="bg-primary lg:px-10 px-5 py-4 rounded-3xl uppercase font-semibold tracking-wider text-sm text-gray-900">
                  Get Started
                </button>
              </div>
              <div className="flex items-center">
                <img
                  src={bannerImg2}
                  alt="bannerImg"
                  className="rounded-full object-cover w-12 h-12"
                  priority={false}
                />
                <img
                  src={profile2}
                  alt="bannerImg"
                  className="rounded-full w-12 object-cover h-12 -ml-1"
                  priority={false}
                />
                <img
                  src={profile3}
                  alt="bannerImg"
                  className="rounded-full object-cover w-12 h-12 -ml-1"
                  priority={false}
                />
                <span className="ml-4 text-base font-sm tracking-wider">
                  100+ Users
                </span>
              </div>
            </div>
            <div className="mt-16 flex gap-12">
              <BsArrowDown size={280} />
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                nihil tempora exercitationem quasi in ut ratione aliquam debitis
                harum dolor, ex molestias nemo inventore sed, earum, qui omnis
                blanditiis.
              </p>
            </div>
          </div>
          <div className="lg:w-7/12 w-full">
            <div className="flex flex-col">
              <div className="flex  gap-10 relative justify-between">
                <div className="w-1/2 relative ml-5">
                  <img
                    src={chaticon}
                    width={50}
                    alt="chaticon"
                    className="absolute md:w-12 w-8 -right-2 md:-right-5 -top-5"
                  />
                  <img
                    src={bannerImg1}
                    width="100%"
                    alt="bannerImg"
                    className="rounded-xl "
                  />
                  <div className="absolute bottom-5 left-0 right-0 opacity-80">
                    <n />
                  </div>
                </div>
                <div className="w-1/2 relative -mt-10">
                  <img
                    src={chaticon}
                    width={50}
                    alt="bannerImg"
                    className="absolute md:w-12 w-8 -right-3 md:-right-5 -top-4"
                  />
                  <img
                    src={bannerImg2}
                    width="100%"
                    alt="bannerImg"
                    className="rounded-xl"
                  />
                  <div className="absolute bottom-14 left-0 right-0 opacity-80">
                    <VideomenuIcon />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-10 mt-12 ml-5">
                <div className="sm:w-1/2 relative">
                  <div className="bg-white text-gray-900 rounded-lg flex flex-col items-center space-y-3 text-center p-6">
                    <img
                      src={videoconference}
                      alt="video_conference"
                      className=" h-50"
                    />
                    <h2 className="text-2xl font-semibold">
                      Video Conferencing
                    </h2>
                    <p className=" text-black">
                      Lorem ipsum dolor sit amet conse adipisicing elit.
                      Nesciunt quod eaque numquam.
                    </p>
                  </div>
                  <div className=" absolute -right-7 -bottom-8 opacity-40 ">
                    <FaHeart size={60} className="text-primary rotate-45" />
                  </div>
                </div>
                <div className="sm:w-1/2 z-10 relative">
                  <div className="bg-white text-gray-900 rounded-lg flex flex-col items-center space-y-3 text-center p-6 sm:absolute right-0 sm:-mt-8 ">
                    <img
                      src={speednetworking}
                      alt="speednetworking"
                      className=" h-50"
                    />
                    <h2 className="text-2xl font-semibold">Speed Networking</h2>
                    <p className="font-medium text-black">
                      Lorem ipsum dolor sit amet conse adipisicing elit.
                      Nesciunt quod eaque numquam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -left-10 -bottom-12 opacity-10 rotate-12">
          <FaHeart size={140} className="text-primary rotate-12" />
        </div>
        <div className="absolute -right-12 -bottom-12 opacity-10">
          <FaHeart size={140} className="text-primary -rotate-45" />
        </div>
      </div>
    </>
  );
};

export default Banner;
