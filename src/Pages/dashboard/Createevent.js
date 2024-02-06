import React, { useEffect, useState } from "react";
import { Timestamp, addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import CreateEventForm from "../../Components/Event/CreateEventForm";
import Sidebar from "../../Components/Event/Sidebar";
import CustomPopup from "../../Components/CustomPopup";
import Header from "../../Components/Layout/Header";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import emailjs from 'emailjs-com';


const Createevent = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate=useNavigate()
  const {user}=useAuth()
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const storage = getStorage();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      event_title,
      start_date,
      start_time,
      welcomesession,
      group_time,
      meeting_time,
      welcometime,
      number_participents,
      img,
      message,
    } = event.target.elements;
    const startDateTime = new Date(`${start_date.value}T${start_time.value}`);
    const endDateTime = new Date(
      startDateTime.getTime() + welcometime.value * 60000 + meeting_time.value * 60000
    ); 

  
    const eventData = {
      title: event_title.value, 
      start: Timestamp.fromDate(startDateTime),
      end: Timestamp.fromDate(endDateTime),
      welcomesession: welcomesession.value,
      welcometime: welcometime.value,
      grouptime:group_time.value,
      meetingtime: meeting_time.value,
      participant: number_participents.value,
      img: img.value,
      message: message.value,
      registeredUsers: [],
    };

    if (user && user.uid) {
      eventData.registeredUsers.push(user.uid);
    }

    if (!selectedImage) {
      setMessage("Please select an image.");
      setVisible(true);
      return;
    }
    const timestamp = new Date().getTime();
    const imageName = `${timestamp}_${selectedImage.name}`;
    const imageRef = ref(storage, `images/${imageName}`);
 
    setLoading(true)
    try {
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);
      eventData.img = imageUrl;
      await addDoc(collection(db, "events"), eventData);

      event.target.reset();

      setMessage("Event added successfully");
      setVisible(true)
      console.log("visible:ddddd", visible);
      setLoading(false)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error adding event: ", error);
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
            <CreateEventForm onSubmit={handleSubmit} handleImageSelect={handleImageSelect} loading={loading}/>
          </div>
        </div>
      </div>
  </>
  );
};

export default Createevent;
