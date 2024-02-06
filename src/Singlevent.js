import { db } from "./lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { MdKeyboardBackspace, MdShare } from "react-icons/md";
import { useState, useEffect, useCallback } from "react";
import Summery from "./Components/Event/SingleEvent/Summery";
import Schedule from "./Components/Event/SingleEvent/Schedule";
import EventRegistration from "./Components/Event/SingleEvent/EventRegistration";
import Setting from "./Components/Event/SingleEvent/Setting";
import { useAuth } from "././context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSingleEvent } from "./redux/slice/eventSlice";
import { useEvent } from "./context/EventContext";

const Singlevent = () => {
  const navigate = useNavigate();
  const { events  } = useEvent();
  const { user } = useAuth();
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const eventId = params.id;
  const [event, setEvent] = useState(null);
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

  const handleStartEvent = async () => {
    const eventDocRef = doc(db, "events", eventId);
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
      navigate(`/dashboard/event/${eventId}`);
    }
  }, [user, eventId, navigate]);


  const singleEvent = events
    ? events.find((event) => event.id === eventId)
    : null;
  console.log(singleEvent);

  useEffect(() => {
    const fetchEventData = async () => {
      if(singleEvent){
      const dateComponents = singleEvent.start.split("/");
      const day = parseInt(dateComponents[0], 10);
      const month = parseInt(dateComponents[1], 10);
      const year = parseInt(dateComponents[2], 10);

      const timeComponents = singleEvent.startTime.split(":");
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      const startDate = new Date(year, month - 1, day, hours, minutes);
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
          
          handleStartEvent();
        } else {
          setEventStarted(false);
        }
        
        
        const updatedEvent = {
          ...singleEvent,
          
          startTime,
          endTime,
        };
        setEvent(updatedEvent);
        console.log(updatedEvent)
        const eventRef = doc(db, "events", eventId);
        console.log(endDate < currentDate)
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
    }

    fetchEventData();
  }, [singleEvent, setRegistered, setEvent, dispatch, handleStartEvent, user]);
  // useEffect(() => {
  //   const fetchEventData = async () => {
  //     if (eventId && user) {
  //       const eventDocRef = doc(db, "events", eventId);
  //       const docSnapshot = await getDoc(eventDocRef);

  //       if (docSnapshot.exists()) {
  //         const eventData = docSnapshot.data();
  //         const start = eventData.start.toDate();
  //         console.log(eventData.start)
  //         console.log(start)
  //         if (!eventData || typeof eventData.end === 'undefined') {
  //           // Handle the case where event or event.end is undefined or null
  //           return null; // You can skip this event or handle it as needed
  //         }
        
  //         // Check if event.end is a valid date before attempting to convert
  //         let end;
  //         if (eventData.end instanceof Date) {
  //           end = eventData.end;
  //         } else if (eventData.end.toDate) {
  //           end = eventData.end.toDate();
  //         } else {
  //           // Handle the case where event.end is not a valid date
  //           end = new Date(); // You can set it to some default value or handle it as needed
  //         }
        
  //         // Rest of your code...
        
        
  //         const currentDate = new Date();
  //         if (currentDate >= start) {
  //           handleStartEvent();
  //         } else {
  //           setEventStarted(false);
  //         }

  //         const startDate = start.toLocaleDateString("en-GB");
  //         const startTime = start.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: true
  //         });

  //         const endDate = end.toLocaleDateString("en-GB");
  //         const endTime = end.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: true
  //         });

  //         const updatedEvent = {
  //           ...eventData,
  //           start: startDate,
  //           startTime,
  //           end: endDate,
  //           endTime,
  //         };

  //         setEvent(updatedEvent);
  //         // dispatch(setSingleEvent(event));
  //         const eventRef = doc(db, "events", eventId);
  //         if (end < currentDate) {
  //           setEventClose(true);
  //         } else {
  //           setEventClose(false);
  //         }
  //         try {
  //           const eventDoc = await getDoc(eventRef);
  //           if (eventDoc.exists()) {
  //             const registeredUsers = eventDoc.data().registeredUsers || [];

  //             if (registeredUsers.includes(user.uid)) {
  //               setRegistered(true);
  //             }
  //           } else {
  //             console.log("Event not found.");
  //           }
  //         } catch (error) {
  //           console.error("Error checking registration status: ", error);
  //         }
  //       } else {
  //         setEvent(null); // Reset event to null
  //       }
  //     }
  //   }

  //   fetchEventData();
  // }, [
  //   eventId,
  //   setRegistered,
  //   setEvent,
  //   setEventStarted,
  //   handleStartEvent,
  //   dispatch,
  //   user
  // ]);


  useEffect(() => {
    dispatch(setSingleEvent(event));
  }, [dispatch, event]);

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
          title: event.title,
          text: "Check out this event!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    }
  };

  const handleEnterEvent = useCallback(() => {
    navigate(`/dashboard/room/${eventId}`);
  }, [navigate, eventId]);

  if (!event) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        Loading...
      </div>
    );
  }
  const { summary, schedule, registration, settings } = showComponent;

  const registerUserForEvent = async () => {
    const eventRef = doc(db, "events", eventId);

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
                          disabled={eventStarted} // Disable the button if the event has started
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
              <Summery event={event} handleMenuClick={handleMenuClick} />
            )}
            {schedule && <Schedule event={event} />}
            {registration && <EventRegistration event={event} />}
            {settings && <Setting />}
          </div>
        ) : (
          <div className="py-8">
            {summary && (
              <Summery event={event} handleMenuClick={handleMenuClick} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Singlevent;
