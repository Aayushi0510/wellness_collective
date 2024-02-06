import React, { useState } from "react";
import { writeBatch, Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";
import CustomPopup from "../../Components/CustomPopup";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Recurringevent from "./recurringevent/Recurringevent";
import Sidebar from "../../Components/Event/Sidebar";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


const Recurring = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate=useNavigate()
  const {user}=useAuth()
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleDateChange = (newSelectedDates) => {
    setSelectedDates(newSelectedDates);
    console.log(newSelectedDates)
  };
  const storage = getStorage();


  const handleSubmit = async (event) => {
   
    event.preventDefault(); 
    const {
      event_title,
      selectedDates,
      start_time,
      group_time,
       meeting_time,
      welcomesession,
      welcometime,
      number_participents,
      img,
      message,
    } = event.target.elements;
    console.log(selectedDates.value)

    

    if (selectedDates.length === 0) {
      // Handle the case where no dates are selected
      console.error("No dates selected");
      return;
    }
    const selectedDatesArray = selectedDates.value.split(', ').map((dateString) => {
      return dateString.replace(/-/g, '/');
    });

   
        try {
       const eventsBatch = [];
        for (const selectedDate of selectedDatesArray) {
        const [year, month, day] = selectedDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log(formattedDate)
        console.log(start_time.value)
        const startDateTime = new Date(`${formattedDate}T${start_time.value}`);
        console.log(startDateTime)
        const endDateTime = new Date(
          startDateTime.getTime() + welcometime.value * 60000 + meeting_time.value * 60000
        ); 

        const eventData = {
          title: event_title.value,
          start: Timestamp.fromDate(startDateTime),
          end: Timestamp.fromDate(endDateTime),
          welcomesession: welcomesession.value,
          group_time: group_time.value,
          welcometime: welcometime.value,
          participant: number_participents.value,
          meetingtime: meeting_time.value,
          img: img.value, // Use the image name if available, or an empty string
          message: message.value,
          registeredUsers: [],
        };
        if (!selectedImage) {
          setMessage("Please select an image.");
          setVisible(true);
          return;
        }
        if (user.role==="host" && user.uid) {
          eventData.registeredUsers.push(user.uid);
        }
        const timestamp = new Date().getTime();
        const imageName = `${timestamp}_${selectedImage.name}_${selectedDate}`; // Include the selected date in the image name
        const imageRef = ref(storage, `images/${imageName}`);

        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);
        eventData.img = imageUrl;
        
        eventsBatch.push(eventData);
      }
 
      // Create multiple events in a batch
      const batch = writeBatch(db);
   
        eventsBatch.forEach((eventData) => {
        
        const eventRef = collection(db, "events");
        
        addDoc(eventRef, eventData);
      });
  
  
      await batch.commit();
  
      event.target.reset();
      setMessage("Events added successfully");
      setVisible(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding events: ", error);
    }
  };

  const handleImageSelect = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
  };
    return (
    <>
     <div className="flex flex-col lg:flex-row container text-gray-100 mx-auto pt-5 pb-10 gap-5">
        <div className="lg:w-1/4">
          <Sidebar />
        </div>
        <div className="lg:w-3/4">
          <CustomPopup message={message} visible={visible} setVisible={setVisible} />
          <div className="bg-gray-700 bg-opacity-20 rounded-xl px-4 lg:px-20 py-10">
            <h2 className="text-3xl font-semibold tracking-wider text-center lg:text-left">
              Create Event
            </h2>
            <Recurringevent onSubmit={handleSubmit}  selectedDates={selectedDates}
          onDateChange={handleDateChange} handleImageSelect={handleImageSelect} />
          </div>
        </div>
      </div>
  </>
  );
};

export default Recurring;
