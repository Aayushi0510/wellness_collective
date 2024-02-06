import React from "react";
import { useEvent } from "./context/EventContext";
import {  useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { doc, getDoc, getFirestore } from "@firebase/firestore";

const Activity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { displayName } = user;
  const params = useParams();
  const activityId = params.id;
  const [meetingEnded, setMeetingEnded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivites] = useState(null);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const { activity } = useEvent();
  let startTime = null;
  let endTime = null;

  const Singleactivity = activity
    ? activity.find((event) => event.id === activityId)
    : null;

  if (activities) {
    startTime = activities?.startTime;
    endTime = activities?.endTime;
  }

  useEffect(() => {
    const fetchEventData = async () => {
      if (Singleactivity) {
        const dateComponents = Singleactivity.start.split("/");
        const day = parseInt(dateComponents[0], 10);
        const month = parseInt(dateComponents[1], 10);
        const year = parseInt(dateComponents[2], 10);

        const timeComponents = Singleactivity.startTime.split(":");
        const hours = parseInt(timeComponents[0], 10);
        const minutes = parseInt(timeComponents[1], 10);
        const startDate = new Date(year, month - 1, day, hours, minutes);
        const dateComponentss = Singleactivity.end.split("/");
        const days = parseInt(dateComponentss[0], 10);
        const months = parseInt(dateComponentss[1], 10);
        const years = parseInt(dateComponentss[2], 10);
        const timeComponentss = Singleactivity.endTime.split(":");
        const hourss = parseInt(timeComponentss[0], 10);
        const minutess = parseInt(timeComponentss[1], 10);

        const endDate = new Date(years, months - 1, days, hourss, minutess);
        const options = {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        };

        const startTime = startDate.toLocaleString("en-GB", options);
        const endTime = endDate.toLocaleString("en-GB", options);

        const updatedEvent = {
          ...Singleactivity,

          startTime,
          endTime,
        };
        setActivites(updatedEvent);
        setLoading(false);
        console.log(updatedEvent);

      }
    };

    fetchEventData();
  }, [Singleactivity, setActivites, user]);

  let allParticipants = [];
  if (activities) {
    allParticipants = activities?.registeredUsers || [];
  }

  useEffect(() => {
    const userDataArray = [];

    const fetchUserData = async (userID) => {
      try {
        const userDoc = await getDoc(doc(getFirestore(), "users", userID));
        if (userDoc.exists) {
          const userData = userDoc.data();
          userDataArray.push(userData);
          console.log(userDataArray)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserDataPromises = allParticipants.map((userID) =>
      fetchUserData(userID)
    );

    Promise.all(fetchUserDataPromises)
      .then(() => {
        setRegisteredUsersData(userDataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [activities]);


  const endMeeting = () => {
    setMeetingEnded(true);
    if (activities?.speedNetworking === "Yes") {
      navigate(`/dashboard/groupactivity/${activityId}`);
      window.location.reload();

    } else {

     navigate("/dashboard");
      window.location.reload();
    }
  };


  useEffect(() => {
    // Rest of your code that depends on data
    if (!loading) {
    
      if (!meetingEnded) {
        setMeetingEnded(false);
        initializeMeeting(activityId);
      }
      // ... the rest of your code ...
    }
  }, [loading, meetingEnded, activityId]);

  // useEffect(() => {
  //   // Calculate the remaining time until the meeting's end time
  //   const now = new Date();
  //   const endDateTime = new Date(now.toDateString() + " " + endTime);
  //   console.log(endDateTime)
  //   console.log(now)
  //   const remainingTime = endDateTime - now;
  //   console.log(remainingTime)
  //   if (remainingTime > 0) {
  //     if (Singleactivity.speedNetworking === "Yes") {

  //       navigate(`/dashboard/groupactivity/${activityId}`);
  //       // navigate("/dashboard");
  //     } else {
  //       const endTimeout = setTimeout(() => {
  //         endMeeting();
  //       }, remainingTime);
  //       return () => {
  //         clearTimeout(endTimeout);
  //       };
  //     }
  //   }
  // }, [endTime, navigate]);

  // const parseStartTime = (timeString) => {
  //   const [time, meridian] = timeString.split(" ");
  //   const [hours, minutes] = time.split(":");
  //   let hour = parseInt(hours, 10);
  //   const minute = parseInt(minutes, 10);

  //   if (meridian && meridian.toLowerCase() === "pm" && hour !== 12) {
  //     hour += 12;
  //   }

  //   const startDate = new Date();
  //   startDate.setHours(hour);
  //   startDate.setMinutes(minute);
  //   startDate.setSeconds(0);
  //   return startDate;
  // };

  // const welcomeTimeInMinutes = parseInt(endTime, 10);
  // let formattedNewTime = "";
  // if (startTime && endTime) {
  //   const startTimeDate = parseStartTime(startTime);
  //   startTimeDate.setMinutes(startTimeDate.getMinutes() + welcomeTimeInMinutes);

  //   formattedNewTime = startTimeDate.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // }


  const dateComponentss = Singleactivity?.end.split("/");
  const days = parseInt(dateComponentss[0], 10);
  const months = parseInt(dateComponentss[1], 10);
  const years = parseInt(dateComponentss[2], 10);
  const timeComponentss = Singleactivity?.endTime.split(":");
  const hourss = parseInt(timeComponentss[0], 10);
  const minutess = parseInt(timeComponentss[1], 10);

  const endDate = new Date(years, months - 1, days, hourss, minutess);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      // const newTimeDate = parseStartTime(formattedNewTime);
      if (currentTime >= endDate) {
        console.log("hello")
        setMeetingEnded(true);
        endMeeting();
        clearInterval(intervalId);
        if (!meetingEnded) {
          initializeMeeting(activityId);
        }
      } else {
        setMeetingEnded(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentTime, activityId, meetingEnded]);

  // ... Rest of your code

  const initializeMeeting = (id) => {
    const config = {
      name: displayName,
      meetingId: id, // Use the pair ID as the meeting ID
      apiKey: "a53cfd8b-b8fb-4427-ad5a-d5949acd5289",
      containerId: null,
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
      layout: {
        type: "SIDEBAR", // "SPOTLIGHT" | "SIDEBAR" | "GRID"
        priority: registeredUsersData.map((participant) => {
          if (participant.role === "practitioners") {
            return "PIN";
          } 
        }),
        gridSize: allParticipants.length,
      },
      permissions: {
        changeLayout: true,
        endMeeting: meetingEnded,
      },
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  };
  return <div></div>;
};

export default Activity;
