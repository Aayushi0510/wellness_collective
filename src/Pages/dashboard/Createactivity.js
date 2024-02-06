import React, { useState } from "react";
import { Timestamp, addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, storage } from "../../lib/firebase";
import Sidebar from "../../Components/Event/Sidebar";
import CustomPopup from "../../Components/CustomPopup";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CreateActivityForm from "../../Components/Event/CreateActivityForm";
import { useEffect } from "react";
import emailjs from 'emailjs-com';


const Createactivity = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState("");
  const [users, setUsers] = useState([]);

  const [userss, setUserss] = useState([]);

  useEffect(() => {
    // Fetch user data from Firebase and store it in a state variable
    const fetchUsers = async () => {
      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);
      console.log(usersSnapshot ,"usersSnapshot")
      const usersData = usersSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });     
      console.log(usersData)
      setUserss(usersData);
    };

    fetchUsers();
  }, []);

  const sendEmailToUsers = async () => {
    try {
      const batchSize = 7; // Number of users to process in each batch
      const totalUsers = userss.length;
      
      // Split users into batches
      for (let startIndex = 0; startIndex < totalUsers; startIndex += batchSize) {
        const endIndex = Math.min(startIndex + batchSize, totalUsers);
        const batchUsers = userss.slice(startIndex, endIndex);
  
        // Map user emails to an array of promises for the current batch
        const emailPromises = batchUsers.map(async (user) => {
          console.log(user.email);
          const templateParams = {
            to_email: user.email,
            from_name: "Wellness Collective",
            message: `An event has been created! Check it out.`,
          };
  
          try {
            const response = await emailjs.send(
              "service_tigbl8j",
              "template_8c4mi0h",
              templateParams,
              "XwLwqRRXNNsRhNw9y"
            );
  
            console.log("Email sent successfully to", user.email, ":", response);
            return { success: true, email: user.email };
          } catch (error) {
            console.error("Error sending email to", user.email, ":", error);
            // Handle errors as needed, you might choose to continue sending emails even if one fails
            return { success: false, email: user.email, error };
          }
        });
  
        // Wait for all email promises in the current batch to resolve
        const results = await Promise.all(emailPromises);
  
        // You can process the results if needed
        results.forEach((result) => {
          if (result.success) {
            console.log("Email sent successfully to", result.email);
          } else {
            console.error("Error sending email to", result.email, ":", result.error);
          }
        });
  
        // Introduce a delay before processing the next batch
        const delayBetweenBatches = 7000; // 7 seconds
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
  
      console.log("All emails sent successfully");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };
  
  
  // Call the function to send emails to multiple users
  
  
  
  console.log(userss);

  useEffect(() => {
    const getUsers = async () => {
      const usersRef = collection(db, "users");

      try {
        const querySnapshot = await getDocs(usersRef);

        const usersData = [];
        querySnapshot.forEach((doc) => {
          const userData = {
            id: doc.id, // Include the document ID in the user data
            ...doc.data(),
          };

          console.log(userData);
          usersData.push(userData);
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error getting users:", error);
      }
    };

    getUsers();
  }, []);



  useEffect(() => {
    // Reset state when the component mounts
    setSelectedImage(null);
    setSelectedActivities([]);
    setSelectedPractitioner("");
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const filteredUsers = users.filter((user) => {
    return (
      user.role === "practitioners" &&
      user?.activities &&
      (selectedActivities.length === 1
        ? user.activities.includes(selectedActivities[0])
        : selectedActivities.sort().toString() ===
          user.activities.sort().toString())
    );
  });
  const getPractitionerNamesForSelectedActivities = () => {
    // Ensure there are selected activities
    if (selectedActivities.length > 0) {
      return filteredUsers
        .filter((user) =>
          selectedActivities.every((act) => user.activities.includes(act))
        )
        .map((practitioner) => practitioner.displayName);
    }
    return [];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      event_title,
      start_date,
      start_time,
      end_time,
      number_participents,
      speedNetworking,
      networkingTime,
      networkingDuration,
      img,
      message,
    } = event.target.elements;

    const startDateTime = new Date(`${start_date.value}T${start_time.value}`);
    const endDateTime = new Date(`${start_date.value}T${end_time.value}`);
    const eventData = {
      title: event_title.value,
      start: Timestamp.fromDate(startDateTime),
      end: Timestamp.fromDate(endDateTime),
      participant: number_participents.value,
      speedNetworking: speedNetworking.value,
      ...(speedNetworking.value === "Yes" && {
        networkingDuration: networkingDuration.value,
        networkingTime: networkingTime.value,
      }),
      img: img.value,
      message: message.value,
      registeredUsers: [],
      activities: selectedActivities,
    };

    if (!selectedImage) {
      setMessage("Please select an image.");
      setVisible(true);
      return;
    }

    if (filteredUsers.length > 0) {
      // Include the IDs of matching practitioners
      eventData.registeredUsers = filteredUsers.map(
        (practitioner) => practitioner.id
      );
    } else {
      // Handle the case where there are no matching practitioners
      console.error("No matching practitioners.");
      // You might want to show an error message or handle this case according to your requirements.
    }

    const timestamp = new Date().getTime();
    const imageName = `${timestamp}_${selectedImage.name}`;
    const imageRef = ref(storage, `images/${imageName}`);

    setLoading(true);
    try {
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);
      eventData.img = imageUrl;
      console.log(eventData);
      await addDoc(collection(db, "eventactivities"), eventData);
     await  sendEmailToUsers()
      event.target.reset();
      setMessage("Event added successfully");
      setVisible(true);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleImageSelect = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
  };

  const activity = [
    "Talk Therapy",
    "EMDR",
    "Trauma",
    "PTSD",
    "CPTSD",
    "Substance abuse/ Recovery",
    "Family counseling",
    "Child Pschology",
    "Grief",
    "Intimate patner violence",
    "Sexual violence",
    "LGBTQIA + safe",
    "Spritual",
    "Non-traditional",
    "Reiki",
    "Physical activity(i.e : Yoga ,excercise, etc)",
    "Group therapy",
    "Peer support",
    "Advocacy",
    "Therapeutic staff support",
    "Speech pathology",
    "Experience working with formerly incarcerated people",
    "Experience working with victims of police brutality",
    "Experience working with interracial challenges",
  ];

  const handleActivityChange = (activity) => {
    setSelectedActivities((prevActivities) => {
      if (prevActivities.includes(activity)) {
        return prevActivities.filter((a) => a !== activity);
      } else {
        return [...prevActivities, activity];
      }
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row container text-gray-100 mx-auto pt-5 pb-10 gap-5">
        <div className="lg:w-1/4">
          <Sidebar />
        </div>
        <div className="lg:w-3/4">
          <CustomPopup
            message={message}
            visible={visible}
            setVisible={setVisible}
          />
          <div className="bg-gray-700 bg-opacity-20 rounded-xl px-4 lg:px-20 py-10">
            <h2 className="text-3xl font-semibold tracking-wider text-center lg:text-left">
              Create Event
            </h2>
            <CreateActivityForm
              onSubmit={handleSubmit}
              activity={activity}
              handleActivityChange={handleActivityChange}
              handleImageSelect={handleImageSelect}
              loading={loading}
              filteredUsers={filteredUsers}
              selectedActivities={selectedActivities}
              selectedPractitioner={selectedPractitioner}
              setSelectedActivities={setSelectedActivities}
              setSelectedPractitioner={setSelectedPractitioner}
              getPractitionerNamesForSelectedActivities={
                getPractitionerNamesForSelectedActivities
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Createactivity;
