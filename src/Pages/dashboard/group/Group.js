
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../context/AuthContext";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { useNavigate, useParams } from "react-router-dom";
import { setSingleEvent } from "../../../redux/slice/eventSlice";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
import { useEvent } from "../../../context/EventContext";

const Group = () => {
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [event ,setEvent]=useState(null)
  const { user } = useAuth();
  const {events} =useEvent();
  const userId = user.uid;
  const params = useParams();
  const meetingId = params.id;
  const navigate = useNavigate();
  const { displayName } = user;
  const [pairs, setPairs] = useState([]);
  const [totalPairs, setTotalPairs] = useState(0);
  const intervalIdRef = useRef(null); // Use useRef to store intervalId
  const pairIdCounter = useRef(1);
 
  let shuffletime =null;
  let endTime =null;
  const singleEvent = events
  ? events.find((event) => event.id === meetingId)
  : null;

if (event) {
  shuffletime = event?.group_time;
  endTime = event?.endTime; // the end time (e.g., "04:10 PM")
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
    const currentDate = new Date();

      const updatedEvent = {
        ...singleEvent,
        
        startTime,
        endTime,
      };
      setEvent(updatedEvent);
      setLoading(false)
    
    } 
  }

  fetchEventData();
}, [ user ]);



  let allParticipants = []
  if(event)
  {
    allParticipants= event?.registeredUsers || [];
  }
  const [users, setUsers] = useState(allParticipants);





  // Initialize a meeting with the given pair ID
  const initializeMeeting = (pairId) => {
    const config = {
      name: displayName,
      meetingId: pairId.toString(), // Use the pair ID as the meeting ID
      apiKey: "a53cfd8b-b8fb-4427-ad5a-d5949acd5289",
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
        meetingUrl: pairId.toString(), // Use the pair ID as the meeting URL
      },
      layout: {
        type: "GRID",
        priority: "SPEAKER",
        gridSize: 2,
      },
      permissions: {
        endMeeting: meetingEnded,
      },
      userSpecificInfo: {
        currentUserId: userId, // Current user's ID
        pairedUserId: pairs.find((user) => user.userId !== userId)?.userId, // Paired user's ID
      },
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  };



  const endMeeting = () => {
  if(event){
    setMeetingEnded(true);
   setTimeout(()=>{ navigate("/dashboard");
    window.location.reload();
  },1000)
} };



  useEffect(() => {
    // Calculate the remaining time until the meeting's end time
    const now = new Date();
    const endDateTime = new Date(now.toDateString() + " " + endTime);
    const remainingTime = endDateTime - now;
    if (remainingTime > 0){
      // Use setTimeout to automatically end the meeting when remainingTime reaches 0
      const endTimeout = setTimeout(() => {
        endMeeting();
      }, remainingTime);

      // Cleanup the timeout when the component unmounts or meeting ends
      return () => {
        clearTimeout(endTimeout);
      };
    }

    // If the remainingTime is negative, it means the end time has already passed, so end the meeting immediately
    endMeeting();
  }, [endTime ,navigate]);



  const createPairs = () => {

    const numUsers = users.length;
    const numPairs = numUsers / 2;
    const shuffledUsers = [...users];
    shuffleArray(shuffledUsers);
    const newPairs = [];

    for (let i = 0; i < numPairs; i++) {

      const pairId = pairIdCounter.current++; // Assign a group ID (pair ID) to each pair
      const pair = {
        
        users: [shuffledUsers[i * 2], shuffledUsers[i * 2 + 1]],
        groupId: pairId,
      };
      newPairs.push(pair);
      console.log(newPairs)
       initializeMeeting(pairId);
    }

    setPairs(newPairs);
    setTotalPairs(newPairs.length);
  };


  useEffect(() => {
    createPairs(); // Initial shuffle

    const shuffleInterval = setInterval(() => {
      createPairs();
    }, shuffletime * 60000);

    intervalIdRef.current = shuffleInterval; // Assign intervalIdRef.current

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [shuffletime]);


  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // useEffect(() => {
  //   const confirmationMessage = "Are you sure you want to leave this page? Your meeting will be ended.";

  //   const handleBeforeUnload = (e) => {
  //     // If the meeting is ongoing and not ended, show the confirmation dialog
  //     if (!meetingEnded) {
  //       e.preventDefault();
  //       e.returnValue = confirmationMessage;
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [meetingEnded]);

  return (
    <div>
      {/* <h1>User Pairs</h1>
      <p>Total Possible Unique Pairs: {totalPairs}</p>
      <ul>
        {pairs.map((pair, index) => (
          <li key={index}>
            Group {pair.groupId} - Users: {pair.users[0]}, {pair.users[1]}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default Group;
