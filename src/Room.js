import React, { useEffect, useState } from "react";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { useParams } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEvent } from "./context/EventContext";

function Room() {
   const [meetingEnded, setMeetingEnded] = useState(true);
   const [currentTime, setCurrentTime] = useState(new Date());
   const [loading, setLoading] = useState(true); // Track loading state


  const [event ,setEvent]=useState(null)
   const { user } = useAuth();
   const { displayName } = user;
   const params = useParams();
   const {events}=useEvent()
   const meetingId = params.id;
   const navigate = useNavigate();
   let startTime = null;
   let welcomeTime = null;
   
 
  // const validateTimeFormat = (timeString) => {
  //   const pattern = /^(0[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/;
  //   return pattern.test(timeString);
  // };



  const singleEvent = events
    ? events.find((event) => event.id === meetingId)
    : null;
console.log(event)
  if (event) {
    startTime = event?.startTime;
    welcomeTime = event?.welcometime;
  }

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
        hour12: false,
      };

      const startTime = startDate.toLocaleString("en-GB", options);
      const endTime = endDate.toLocaleString("en-GB", options);
      // const currentDate = new Date();

        const updatedEvent = {
          ...singleEvent,
          
          startTime,
          endTime,
        };
        setEvent(updatedEvent);
        setLoading(false)
        console.log(updatedEvent)

      
      } 
    }

    fetchEventData();
  }, [singleEvent, setEvent, user]);



   const parseStartTime = (timeString) => {
    console.log(timeString)
    const [time, meridian] = timeString.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
  
   if (meridian && meridian.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
   }
  
    const startDate = new Date();
    startDate.setHours(hour);
    startDate.setMinutes(minute);
    startDate.setSeconds(0);
    return startDate;
  };



  useEffect(() => {
    // Rest of your code that depends on data
    if (!loading) {
      console.log("aayushi")
    
      if (!meetingEnded) {
        console.log("meeting started")
        setMeetingEnded(false);
        initializeMeeting(meetingId);
      }
      // ... the rest of your code ...
    }
  }, [loading, meetingEnded, meetingId]);


  const welcomeTimeInMinutes = parseInt(welcomeTime, 10);
  let formattedNewTime = ""; 
  
  if (startTime && welcomeTime) {
    const startTimeDate = parseStartTime(startTime);
    startTimeDate.setMinutes(startTimeDate.getMinutes() + welcomeTimeInMinutes);
  
    formattedNewTime = startTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      const newTimeDate = parseStartTime(formattedNewTime);
      if (currentTime >= newTimeDate) {
        setMeetingEnded(true);
        endMeeting();
        clearInterval(intervalId);
        if(meetingEnded){
          navigate(`/dashboard/group/${meetingId}`);
        
          }
          else{
            initializeMeeting(meetingId);

          }
          
      }else{
        setMeetingEnded(false);

      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentTime, formattedNewTime, meetingId,meetingEnded]);

  const initializeMeeting = (meetingId) => {
    const config = {
      name: displayName,
      meetingId: meetingId,
      apiKey: "b960cde5-ae09-4e7e-a273-b6291f914442",
      containerId: null,
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
      joinScreen: {
        visible: true,
        title: "Event",
        meetingUrl: meetingId,
      },    
      permissions: {
        endMeeting: meetingEnded,
      },
    };
    const meeting = new VideoSDKMeeting();
    meeting.init(config); 
  };
  const endMeeting = () => {
    setMeetingEnded(true);
  };
 

  return (
    <div>
    
    </div>
  );
}

export default Room;
