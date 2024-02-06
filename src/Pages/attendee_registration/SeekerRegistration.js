import React from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { auth } from "../../lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomPopup from "../../Components/CustomPopup";
import { useAuth } from "../../context/AuthContext";
import emailjs from "emailjs-com";

const SeekerRegistration = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    foodValue: "",
    housingValue: "",
    displayName: "",
    gender: "",
    activities: [],
    role: "seekers",
  });
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

  const sendEmailToUsers = async (userEmail ,userName) => {
    console.log(userEmail);
    try {
      const templateParams = {
        to_email: userEmail,
        from_name: " Wellness Collective",
        to_name:userName,
        message: `User Registration sucessfull.`,
      };

      return emailjs
        .send(
          "service_tigbl8j",
          "template_8c4mi0h",
          templateParams,
          "XwLwqRRXNNsRhNw9y"
        )
        .then((response) => {
          console.log("Email sent successfully to", ":", response);
        })
        .catch((error) => {
          console.error("Error sending email to", ":", error);
          throw error; // Rethrow the error to stop Promise.all if one fails
        });
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  const { email, password, foodValue, housingValue, displayName, activities } =
    data;

  const handleFoodChange = (event) => {
    setData((prevState) => ({ ...prevState, foodValue: event.target.value }));
  };

  const handlehousingChange = (event) => {
    setData((prevState) => ({
      ...prevState,
      housingValue: event.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setVisible(true);
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
        data.role,
        data.name,
        data.foodValue,
        data.housingValue,
        data.gender,
        data.activities
      );
      const user = userCredential.user;
      console.log(user);
      // await sendEmailVerification(user ,{url:`https://speed-match-app-37023.web.app/`});
      const userData = {
        id: user.uid,
        displayName: data.displayName,
        email: data.email,
        role: data.role,
        name: data.name,
        gender: data.gender,
        foodValue: data.foodValue,
        housingValue: data.housingValue,
        activities: data.activities,
      };
      const firestore = getFirestore();

      await setDoc(doc(firestore, "users", user.uid), userData);
      console.log(user.email);
      await sendEmailToUsers(user.email ,user.displayName);

      if (foodValue === "no" || housingValue === "no") {
        window.open(
          "https://www.selfcarehousekeeping.com/join-the-team",
          "_blank"
        );
      } else {
        // window.location.href = "/dashboard/attendee";

        setVisible(true);
        setMessage(
          "Registration successful. Please check your email for verification."
        );
      }
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        setMessage("User already exists");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password must be at least 8 characters long.");
      } else {
        setMessage("Please fill in correct details");
      }
      setLoading(false);
      setVisible(true);
    }
  };

  const handleActivityChange = (event) => {
    const activity = event.target.value;
    setData((prevState) => ({
      ...prevState,
      activities: prevState.activities.includes(activity)
        ? prevState.activities.filter((a) => a !== activity)
        : [...prevState.activities, activity],
    }));
  };

  return (
    <div className="container mx-auto  py-5">
      <CustomPopup
        message={message}
        visible={visible}
        setVisible={setVisible}
      />

      <form onSubmit={handleRegister} className="p-5 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              id="displayName"
              value={displayName}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  displayName: e.target.value,
                }))
              }
              className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
              required
              className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              required
              className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
            />
          </div>
          <div>
            <div className="flex flex-col text-gray-400">
              <label htmlFor="gender" className="mb-2">
                Gender
              </label>
              <div>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={data.gender === "male"}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      gender: e.target.value,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="male" className="mr-4">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={data.gender === "female"}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      gender: e.target.value,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col text-gray-400">
              <label htmlFor="food" className="mb-2">
                You have Enough Food
              </label>
              <select
                name="food"
                id="food"
                value={foodValue}
                onChange={handleFoodChange}
                className="px-3 py-3 bg-transparent border border-gray-700 rounded-xl "
              >
                <option value="">--Select an option--</option>
                <option value="yes" className="text-black">
                  Yes
                </option>
                <option value="no" className="text-black">
                  No
                </option>
              </select>
            </div>
          </div>
          <div>
            <div className="flex flex-col text-gray-400">
              <label htmlFor="housing" className="mb-2">
                Housing
              </label>
              <select
                name="housing"
                id="housing"
                value={housingValue}
                onChange={handlehousingChange}
                className="px-3 py-3 bg-transparent border border-gray-700 rounded-xl"
              >
                <option value="">--Select an option--</option>
                <option value="yes" className="text-black">
                  Yes
                </option>
                <option value="no" className="text-black">
                  No
                </option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col text-gray-400">
            <label htmlFor="activities" className="mb-2">
              Select Activities
            </label>
            <div className="grid grid-cols-3 gap-8">
              {activity.map((act) => (
                <div key={act} className="flex flex-row items-center">
                  <input
                    type="checkbox"
                    id={act}
                    name="activities"
                    value={act}
                    checked={activities.includes(act)}
                    onChange={handleActivityChange}
                  />
                  <label htmlFor={act} className="ml-2">
                    {act}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div className="text-center space-y-2">
        <div className="tracking-wide">
          Already have an account?
          <Link to={"/login"} className="text-secondry underline ml-2">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeekerRegistration;
