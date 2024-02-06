
import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {Link} from "react-router-dom"
import EditSummaryEventDetails from "../../../Pages/Editformdetail";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
import { useEffect } from "react";


const Summery = ({ activities }) => {  
const { user } = useAuth();
const [registeredUsersData, setRegisteredUsersData] = useState([]);
const [loading, setLoading] = useState(true);

// const practitionersId=activities?.selectedPractitoner;
// const getUserDetails = async (userId) => {
//   try {
//     const userDoc = await getDoc(doc(db, "users", userId)); // Replace "users" with your Firestore collection name
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       console.log("User Details:", userData);
//       setPractionerName({
//         displayName: userData.displayName,
//         role: userData.role,
//         foodValue: userData.foodValue,
//         housingValue: userData.housingValue,
//       });

//       // Now you can use userData to display or work with the user's details
//     } else {
//       console.log("User not found");
//     }
//   } catch (error) {
//     console.error("Error getting user details:", error);
//   }
// };

// // Call the function to get the user details
// if (practitionersId) {
//   getUserDetails(practitionersId);
// }


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handlebooth = () => {};
  const totalRegister = activities.registeredUsers.length;
  const totalseatleft = activities.participant - totalRegister;
  useEffect(() => {
    const fetchUserData = async (userID) => {
      try {
        const userDoc = await getDoc(doc(getFirestore(), "users", userID));
        console.log(userDoc)
        if (userDoc.exists) {
          console.log( userDoc.data())

          return userDoc.data();
        } else {
          console.log(`User document with ID ${userID} does not exist`);
          return null; // Return null for non-existing users
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        return null; // Return null for errors
      }
    };
    
    const fetchData = async () => {
      try {
        const userIDs = activities.registeredUsers || [];
        console.log(userIDs)
        const userDataArray = await Promise.all(userIDs.map((userID) => fetchUserData(userID)));
        console.log(userDataArray)
        const filteredUserData = userDataArray.filter((userData) => userData !== null && userData !== undefined);
        console.log(filteredUserData)
        setRegisteredUsersData(filteredUserData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchData();
  }, [activities]);
  
  

  
        console.log(registeredUsersData)
    const formatTimeTo12Hour = (timeString) => {
    if (!/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString; // Return the original timeString
    }

    const [hours, minutes] = timeString.split(":").map(Number);

    // Check if hours and minutes are valid numbers
    if (isNaN(hours) || isNaN(minutes)) {
      return timeString; // Return the original timeString
    }

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  
  
  const startTimes= formatTimeTo12Hour(activities.startTime)
  const startTimeParts = startTimes.split(":");
  const startHours = parseInt(startTimeParts[0]);
  const startMinutes = parseInt(startTimeParts[1]);
  const adjustedMinutes = parseInt(startMinutes) + parseInt(activities.welcometime);
  const adjustedHours = startHours + Math.floor(adjustedMinutes / 60);
  const adjustedMinutesRemainder = adjustedMinutes % 60;
  const adjustedStartTime = `${adjustedHours
    .toString()
    .padStart(2, "0")}:${adjustedMinutesRemainder.toString().padStart(2, "0")}`;

    

  return (
    <div className=" flex flex-col md:flex-row px-3 md:px-0 justify-between gap-8">
     
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div className="bg-gray-700 bg-opacity-20  px-8 py-8 rounded-2xl flex sm:flex-row flex-col gap-10">
          <div className="w-full sm:w-1/2 border-0 sm:border-r border-gray-600 pr-5 ">
            <h2>Schedule</h2>
            <div className="flex gap-6 sm:gap-2 justify-between mt-5">
              <div className="w-1/2 flex flex-col gap-4 ">
                <div>
                  <p>{activities.start}</p>
                  <p> {formatTimeTo12Hour(activities.startTime)}</p>
                </div>
                
              </div>

              <div className="w-1/2 flex flex-col gap-4 text-gray-400">
               
                <div>
                  <p>{activities.title}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2>Shuffling Time</h2>
            <div className="flex mt-5">
              <div>
                <p>{activities?.networkingTime}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 bg-opacity-20  px-8 py-8 rounded-2xl flex gap-10">
          <div className="w-1/2 border-r border-gray-600 pr-5 ">
            <h2>Event Registration</h2>
            <div className="flex justify-between gap-2 mt-5">
              <div className="w-1/2 flex flex-col gap-4 ">
                <div>
                  <p>Total Seat</p>
                  <p>{activities.participant}</p>
                </div>
                <div></div>
              </div>

              <div className="w-1/2 flex flex-col gap-4 text-gray-400">
                <div>
                  <p>Total left Seat</p>
                  <p>{totalseatleft}</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          {/* <div>
            <h2>Booth (0)</h2>
            <div className="flex mt-5">
              <button
                onClick={handlebooth}
                className="flex border border-dashed px-10 py-1"
              >
                +
              </button>
            </div>
          </div> */}
           <div>
            <h2>Meeting Time</h2>
            <div className="flex mt-5">
              <div>
                <p>{activities.networkingDuration}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 bg-opacity-20  px-8 py-8 rounded-2xl flex gap-10">
          <div className="w-1/2 border-r border-gray-600 pr-5 ">
            <h2>Selected Practitioners</h2>
            <div className="flex justify-between gap-2 mt-5">
              <div className="w-1/2 flex flex-col gap-4 ">
                <div>
                <p>Practitioners:</p>
          <div>
            {registeredUsersData
              .filter((user) => user.role === "practitioners")
              .map((practitioner) => (
                <p key={practitioner.id}>{practitioner.displayName}</p>
              ))}
          </div>
                </div>
              </div>

             
            </div>
          </div>
        
        </div>
      </div>
      <div className="w-full md:w-2/6 bg-gray-700 bg-opacity-20 flex flex-col px-8 py-8 rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="tracking-wider">Event Details</h2>
          { user && user.role === "host" ? (
                      <button onClick={()=>setIsPopupOpen(true)} className="text-primary">
                      Edit
                    </button>
          
          ) : (
            ""
          )}
        {isPopupOpen && (
        <EditSummaryEventDetails
          endTime={activities.endTime}
          start={activities.start}
          onClose={() => setIsPopupOpen(false)} // Pass a function to close the popup
        />
      )}

        </div>
        <div className="mt-3 text-gray-300">
          <p className="text-sm">
            {activities.start},  {formatTimeTo12Hour(activities?.startTime)} -  {formatTimeTo12Hour(activities?.endTime)}{" "}
          </p>
          <p className="text-sm">Message- {activities?.message}</p>

          <p className="text-sm">Activities- {activities?.activity}</p>

          <div className="mt-4 ">
            <h2 className="mb-2 text-white tracking-wider">Event Setting</h2>
            <p className="text-sm">* Session Recording</p>
            <p className="text-sm">* Chat Support</p>
          </div>

        
        </div>
        
      </div>
      
    </div>
    
  );
};

export default Summery;
