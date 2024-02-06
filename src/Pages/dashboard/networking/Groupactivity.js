import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { useEvent } from "../../../context/EventContext";

const Groupactivity = () => {
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [activities, setActivites] = useState(null);
  const { user } = useAuth();
  const { activity } = useEvent();
  const params = useParams();
  const activityId = params.id;
  const navigate = useNavigate();
  const { displayName } = user;
  const [pairs, setPairs] = useState([]);
  const [totalPairs, setTotalPairs] = useState(0);
  const intervalIdRef = useRef(null); 
  const pairIdCounter = useRef(1);
  const [nextSeekerIndex, setNextSeekerIndex] = useState(0);
  const [message, setMessage] = useState(false); 

  let shuffletime = null;
  const Singleactivity = activity
    ? activity.find((event) => event.id === activityId)
    : null;
  console.log(Singleactivity);
  const networkingDuration = Singleactivity?.networkingTime

  console.log(networkingDuration)

  useEffect(() => {
    const fetchEventData = async () => {
      if (Singleactivity && user) {
        console.log("single");
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
        console.log(updatedEvent, "dashdagsjdhh");
      }
    };

    fetchEventData();
  }, [user ,Singleactivity]);

  let allParticipants = [];
  if (activities) {
    allParticipants = activities?.registeredUsers || [];
  }
  const [userss, setUsers] = useState(allParticipants);
  const practitioners = userss?.filter((user) => user.role === "practitioners");
  const seekers = userss?.filter((user) => user.role === "seekers");
 shuffletime = networkingDuration
  const leaveMeetingAndNavigateToDashboard = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  useEffect(() => {
    const userDataArray = [];

    const fetchUserData = async (userID) => {
      try {
        const userDoc = await getDoc(doc(getFirestore(), "users", userID));
        if (userDoc.exists) {
          const userData = {
            id: userID,
            ...userDoc.data(), // Spread the user data
          };
          console.log(userData, "dsdhjsd");
          userDataArray.push(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserDataPromises = allParticipants?.map((userID) =>
      fetchUserData(userID)
    );

    Promise.all(fetchUserDataPromises)
      .then(() => {
        setUsers(userDataArray);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [activities]);

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
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  };

  const endMeeting = () => {
    console.log("mettingended")
    if (meetingEnded) {
      navigate("/dashboard/attendee");
      window.location.reload();
    }
  };


  let practitionerID = null;
  let seekerID = null;
  if (user.role === "practitioners") {
    practitionerID = user.uid;
  } else if (user.role === "seekers") {
    seekerID = user.uid;
  }
  const createPairs = () => {
    if (practitioners?.length > 0 && seekers?.length > 0) {
      const practitioner = practitioners[0];
      let eligibleSeekers = seekers.filter((seeker) => !seeker.hasMadePair);

      if (
        user.role === "seekers" &&
        seekerID &&
        !eligibleSeekers.some((el) => el.id === seekerID)
      ) {
        leaveMeetingAndNavigateToDashboard();
        return;
      }

      if (eligibleSeekers.length > 0) {
        eligibleSeekers = eligibleSeekers.sort((a, b) => {
          const idA = String(a.id);
          const idB = String(b.id);
          return idA.localeCompare(idB);
        });
        const seeker = eligibleSeekers[0];
        seeker.hasMadePair = true;

        const pairId = pairIdCounter.current++;
        const pair = {
          users: [practitioner, seeker],
          groupId: pairId,
        };

        setPairs(pair);
        console.log(pair)
        setTotalPairs(1);
        const practitionerIDs = practitioners.map(
          (practitioner) => practitioner.id
        );
        const matchingPair = pair.users;
        if (
          user.role === "seekers" &&
          seekerID &&
          !matchingPair.some((el) => el.id === seekerID)
        ) {
          console.log("sdbasdbfdsbafbadsh");
          setMessage(true);
          return;
        }

        if (
          practitionerIDs.includes(practitionerID) ||
          (user.role === "seekers" &&
            matchingPair.some(
              (pa) =>
                pa.role === "seekers" &&
                pa.id === seekerID &&
                pair.groupId === pairId
            ))
        ) {
          initializeMeeting(pairId, practitioner, seeker);
          console.log(pairId, practitioner, seeker)
          eligibleSeekers.slice(1);
          console.log(eligibleSeekers, "eligibleSeekerssssssssssssss");
          setNextSeekerIndex(nextSeekerIndex + 1);
        }
      } else {
        console.log("endmeeeting");
        setMeetingEnded(true);
        endMeeting(); 
      }
    } 
    else {
      endMeeting();
    }
  };

  // useEffect(() => {
  //   if (redirectingToDashboard) {
  //     const delay = 60000; // 60 seconds

  //     const timer = setTimeout(() => {
  //       navigate("/dashboard")
  //       window.location.reload();

  //     }, delay);

  //     return () => {
  //       // Clear the timer if the component unmounts or when it's no longer needed
  //       clearTimeout(timer);
  //     };
  //   }
  // }, [redirectingToDashboard]);

  useEffect(() => {
    createPairs(); // Initial shuffle
    const shuffleInterval = setInterval(() => {
      createPairs();
    }, shuffletime * 60000);

    intervalIdRef.current = shuffleInterval;

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [shuffletime, userss, meetingEnded]);

  return (
    <div>
      {user.role === "seekers" && seekerID && message ? (
        // Content to display when paired
        <div>
          <p>Please wait for your turn to connect with Practitioner</p>
        </div>
      ) : (
        // Content to display when not paired
        <div></div>
      )}
    </div>
  );
};

export default Groupactivity;
