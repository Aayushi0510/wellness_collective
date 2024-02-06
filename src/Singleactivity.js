import { db } from "./lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { MdKeyboardBackspace, MdShare } from "react-icons/md";
import { useState, useEffect, useCallback } from "react";

import { useAuth } from "./context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSingleEvent } from "./redux/slice/eventSlice";
import { useEvent } from "./context/EventContext";
import Summery from "./Components/Event/SingleActivty/Summery";
import Schedule from "./Components/Event/SingleActivty/Schedule";
import EventRegistration from "./Components/Event/SingleActivty/EventRegistration";
import Setting from "./Components/Event/SingleActivty/Setting";
import { useRef } from "react";

const Singleactivty = () => {
  const navigate = useNavigate();
  const { activity } = useEvent();
  const { user } = useAuth();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const eventId = params.id;
  const [activities, setActivites] = useState(null);
  const [activeLink, setActiveLink] = useState("summary");
  const [showComponent, setShowComponent] = useState({
    summary: true,
    schedule: false,
    registration: false,
    booths: false,
    settings: false,
  });
  const [eventStarted, setEventStarted] = useState(true);
  const [eventClose, setEventClose] = useState(false);
  const [registered, setRegistered] = useState(false);
  const handleStartEventCalled = useRef(false); // Initialize a ref to track if the function has been called

  const handleStartEvent = async () => {
    console.log("cbnsd");
    const eventDocRef = doc(db, "eventactivities", eventId);
    await updateDoc(eventDocRef, {
      started: true,
    });
    setEventStarted(true);
  };

  useEffect(() => {
    if (!user) {
      localStorage.setItem("redirectUrl", location.pathname);
      navigate("/login");
    } else {
      navigate(`/dashboard/activity/${eventId}`);
    }
  }, [user, eventId, navigate]);

  const singleEvent = activity
    ? activity.find((event) => event.id === eventId)
    : null;

  useEffect(() => {
    const checkEventStartTime = () => {
      const currentDate = new Date();
      if (currentDate >= startDate && !handleStartEventCalled.current) {
        handleStartEvent();
        handleStartEventCalled.current = true; 
      }
    };
    let startDate; 
    const fetchEventData = async () => {
      
      if (singleEvent) {
        const dateComponents = singleEvent.start.split("/");
        const day = parseInt(dateComponents[0], 10);
        const month = parseInt(dateComponents[1], 10);
        const year = parseInt(dateComponents[2], 10);

        const timeComponents = singleEvent.startTime.split(":");
        const hours = parseInt(timeComponents[0], 10);
        const minutes = parseInt(timeComponents[1], 10);
         startDate = new Date(year, month - 1, day, hours, minutes);
        const dateComponentss = singleEvent.end.split("/");
        const days = parseInt(dateComponentss[0], 10);
        const months = parseInt(dateComponentss[1], 10);
        const years = parseInt(dateComponentss[2], 10);
        const timeComponentss = singleEvent.endTime.split(":");
        const hourss = parseInt(timeComponentss[0], 10);
        const minutess = parseInt(timeComponentss[1], 10);

        const endDate = new Date(years, months - 1, days, hourss, minutess);
        const options = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const startTime = startDate.toLocaleString("en-GB", options);
        const endTime = endDate.toLocaleString("en-GB", options);

        const currentDate = new Date();
      if (currentDate >= startDate) {
        if (!handleStartEventCalled.current) {
          handleStartEvent();
          handleStartEventCalled.current = true; // Set the ref to true so it won't be called again
        }
      } else {
        setEventStarted(false);
      }

        const updatedEvent = {
          ...singleEvent,

          startTime,
          endTime,
        };
        setActivites(updatedEvent);
        const eventRef = doc(db, "eventactivities", eventId);
        if (endDate < currentDate) {
          setEventClose(true);
        } else {
          setEventClose(false);
        }

        try {
          const eventDoc = await getDoc(eventRef);

          if (eventDoc.exists()) {
            const registeredUsers = eventDoc.data().registeredUsers || [];

            if (registeredUsers.includes(user.uid)) {
              setRegistered(true);
            }
          } else {
            console.log("Event not found.");
          }
        } catch (error) {
          console.error("Error checking registration status: ", error);
        }
      }
    };

    fetchEventData();
    const intervalId = setInterval(checkEventStartTime, 1000);
  return () => clearInterval(intervalId);
  }, [
    setRegistered,
    setActivites,
    dispatch,
    user,
    setEventStarted,
    eventId,
    handleStartEventCalled.current,
  ]);

  const handleMenuClick = (link) => {
    setActiveLink(link);
    setShowComponent((prevState) => ({
      summary: link === "summary",
      schedule: link === "schedule",
      registration: link === "registration",
      booths: link === "booths",
      settings: link === "settings",
    }));
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: activities.title,
          text: "Check out this event!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    }
  };

  const handleEnterEvent = useCallback(() => {
    navigate(`/dashboard/roomactivity/${eventId}`);
  }, [navigate, eventId]);

  if (!activities) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        Loading...
      </div>
    );
  }
  const { summary, schedule, registration, booths, settings } = showComponent;

  const registerUserForEvent = async () => {
    const eventRef = doc(db, "eventactivities", eventId);

    try {
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        const registeredUsers = eventDoc.data().registeredUsers || [];

        if (registeredUsers.includes(user.uid)) {
          console.log("User is already registered for this event.");
          return;
        }
        const updatedUsers = arrayUnion(user.uid);

        if (user.role === "host") {
          updatedUsers.push(user.uid);
        }

        await updateDoc(eventRef, { registeredUsers: updatedUsers });
        setRegistered(true);
        try {
          const response = await fetch(
            "https://us-central1-your-firebase-project.cloudfunctions.net/sendConfirmationEmail",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userEmail: user.email,
              }),
            }
          );

          if (response.ok) {
            console.log("Confirmation email sent successfully");
          } else {
            console.error("Failed to send confirmation email");
          }
        } catch (error) {
          console.error("Error registering user for event: ", error);
        }
      } else {
        console.log("Event not found.");
      }
    } catch (error) {
      console.error("Error registering user for event: ", error);
    }
  };

  return (
    <>
      <div className="container mx-auto py-5">
        <div className="bg-gray-700 bg-opacity-20 py-4 rounded-3xl">
          <div className="flex items-center justify-between px-8">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1 text-sm sm:text-base"
              >
                <MdKeyboardBackspace size={20} /> Back
              </button>
            </div>
            <div className="flex items-center gap-4">
              {eventStarted ? (
                !eventClose ? (
                  <div className="flex relative">
                    {user && user.role === "seekers" && !registered ? (
                      <p className="cursor-pointer">
                        You cannot enter in the meeting
                      </p>
                    ) : (
                      <button onClick={handleEnterEvent}>
                        <span className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary font-semibold text-gray-900 text-sm tracking-wider w-full py-3 px-5 rounded-3xl">
                          Enter Event
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-secondry text-black px-4 py-2 rounded-3xl bg-opacity-50">
                    <p className="cursor-pointer">Close Event</p>
                  </div>
                )
              ) : (
                <p className="text-secondry text-sm sm:text-base ">
                  Event Starting Soon
                </p>
              )}
              <button
                onClick={handleShareClick}
                className="flex items-center text-sm border border-white px-6 py-2 rounded-3xl gap-1 tracking-wider"
              >
                <MdShare /> Share
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm bg-black py-3 pl-10 pr-10 sm:pr-0 tracking-wide">
            {user && user.role === "host" ? (
              <ul className="flex items-center gap-10">
                <li
                  className={
                    activeLink === "summary"
                      ? "active px-2 py-2 border-b-2 border-secondry rounded-lg"
                      : "px-2 py-2 border-b-2 border-transparent cursor-pointer"
                  }
                  onClick={() => handleMenuClick("summary")}
                >
                  Summery
                </li>
                <li
                  className={
                    activeLink === "schedule"
                      ? "active px-2 py-2 border-b-2 border-secondry rounded-lg"
                      : "px-2 py-2 border-b-2 border-transparent cursor-pointer"
                  }
                  onClick={() => handleMenuClick("schedule")}
                >
                  Schedule
                </li>
                <li
                  className={
                    activeLink === "registration"
                      ? "active px-2 py-2 border-b-2 border-secondry rounded-lg"
                      : "px-2 py-2 border-b-2 border-transparent cursor-pointer"
                  }
                  onClick={() => handleMenuClick("registration")}
                >
                  Registration
                </li>

                <li
                  className={
                    activeLink === "settings"
                      ? "active px-2 py-2 border-b-2 border-secondry rounded-lg"
                      : "px-2 py-2 border-b-2 border-transparent cursor-pointer"
                  }
                  onClick={() => handleMenuClick("settings")}
                >
                  Settings
                </li>
              </ul>
            ) : (
              <div className="flex  justify-between items-center">
                <ul className="flex ">
                  <li
                    className={
                      activeLink === "summary"
                        ? "active px-2 py-2 border-b-2 border-secondry rounded-lg"
                        : "px-2 py-2 border-b-2 border-transparent cursor-pointer"
                    }
                    onClick={() => handleMenuClick("summary")}
                  >
                    Summery
                  </li>
                </ul>
                {!registered ? (
                  <div className="flex gap-5 items-center">
                    {eventStarted ? (
                      <p>Registration is closed</p>
                    ) : (
                      <>
                        <p>You want to Join This event</p>
                        <button
                          onClick={registerUserForEvent}
                          disabled={eventStarted} 
                          className={`bg-secondry px-6 py-3 rounded-3xl text-black font-semibold tracking-wider ${
                            eventStarted && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Click To Register
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <p>✔ Registered</p>
                )}
              </div>
            )}
          </div>
        </div>

        {user && user.role === "host" ? (
          <div className="py-8">
            {summary && (
              <Summery
                activities={activities}
                handleMenuClick={handleMenuClick}
              />
            )}
            {schedule && <Schedule activities={activities} />}
            {registration && <EventRegistration activities={activities} />}
            {settings && <Setting />}
          </div>
        ) : (
          <div className="py-8">
            {summary && (
              <Summery
                activities={activities}
                handleMenuClick={handleMenuClick}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Singleactivty;
