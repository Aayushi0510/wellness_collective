import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false); // Set initial loading state to false
  const { user } = useAuth();
  const [activity ,setActivity]=useState(null)

  useEffect(() => {
      if (user) {
        setLoading(true); // Set loading to true while fetching

        const eventsRef = collection(db, "events");
        const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
          const formattedEvents = querySnapshot.docs.map((doc) => {
            const event = doc.data();
            const start = event.start.toDate();
            let end;
            if (event.end instanceof Date) {
              end = event.end;
            } else if (event.end.toDate) {
              end = event.end.toDate();
            } else {
              end = new Date(); // You can set it to some default value or handle it as needed
            }
            const formatDate = (date) => date.toLocaleDateString("en-GB");
            const formatTime = (time) => {
              return time.toLocaleTimeString("en-GB"  , {
                hour: "2-digit",
                minute: "2-digit",
              });
            };
  
            return {
              id: doc.id,
              title: event.title,
              start: formatDate(start),
              startTime: formatTime(start),
              end: formatDate(end),
              endTime: formatTime(end),
              img: event.img,
              registeredUsers: event.registeredUsers,
              message: event.message,
              welcometime:event.welcometime,
              group_time:event.grouptime,
              meetingtime:event.meetingtime,
              participant:event.participant,

            };
          });
          setEvents(formattedEvents);
          setLoading(false);
        });
  
        return unsubscribe; 
      }
    
  }, [user ]); 

  useEffect(() => {
    if (user) {
      const eventsRef = collection(db, "eventactivities");
      const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
        const formattedEvents = querySnapshot.docs.map((doc) => {
          const event = doc.data();
          const start = event.start.toDate();
          let end;
          if (event.end instanceof Date) {
            end = event.end;
          } else if (event.end.toDate) {
            end = event.end.toDate();
          } else {
            end = new Date(); // You can set it to some default value or handle it as needed
          }
          const formatDate = (date) => date.toLocaleDateString("en-GB");
          const formatTime = (time) => {
            return time.toLocaleTimeString("en-GB"  , {
              hour: "2-digit",
              minute: "2-digit",
            });
          };
          return {
            id: doc.id,
            title: event.title,
            start: formatDate(start),
            activity:event.activities,
            startTime: formatTime(start),
            end: formatDate(end),
            endTime: formatTime(end),
            img: event.img,
            registeredUsers: event.registeredUsers,
            message: event.message,
            participant:event.participant,
            speedNetworking:event.speedNetworking,
            networkingDuration: event.networkingDuration,
            networkingTime: event.networkingTime,
            selectedPractitoner: event.selectedPractitoner,
          };
        });
        setActivity(formattedEvents);
        setLoading(false); 
      });

      return unsubscribe; // Return the unsubscribe function to stop listening when the component unmounts
    }
  
}, [user ]); //

  return loading ? (
    <div>
      <p className="flex justify-center items-center">Loading...</p>
    </div>
  ) : (
    <EventContext.Provider value={{ events, setEvents ,activity ,setActivity }}>
      {children}
    </EventContext.Provider>
  );
};
