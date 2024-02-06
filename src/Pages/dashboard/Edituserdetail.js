import {  doc, getFirestore, updateDoc } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

const Edituserdetail = ({onClose}) => {
  const {user }=useAuth()
  console.log(user)
  const [formData, setFormData] = useState({
    name: user.displayName || "",
    email: user.email || "",
    foodValue: user.foodValue || "",
    housingValue: user.housingValue || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { name, email, foodValue, housingValue } = formData;
    const user = auth.currentUser;
    const db = getFirestore(); // Get Firestore instance
    const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore
    try {
      await updateDoc(userRef, {
        foodValue,
        email,
        displayName: name,
        housingValue,
      });
      onClose();

    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  useEffect(() => {
    setFormData({
      name: user.displayName || "",
      email: user.email || "",
      foodValue: user.foodValue || "",
      housingValue: user.housingValue || "",
    });
  }, [user]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      <div className="fixed inset-0 bg-black opacity-70"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-md z-10">
        <h2 className="text-2xl mb-4 text-gray-800 flex justify-center outline-none">
          Edit Account Details
        </h2>

          <div>
            <label htmlFor="name" className="ml-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent text-black"
            />
          </div>
          <div>
            <label htmlFor="email" className="ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-4 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent text-black"
            />
          </div>
          {user.role !== "practitioner" && (
                      <>
                        <div>
                          <label className="text-gray-400">
                            You Have Enough Food
                          </label>
                          <select
                            name="foodValue"
                            value={user.foodValue}
                            className="px-3 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                          >
                            <option value="">--Select an option--</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-400">Housing</label>
                          <select
                            name="housingValue"
                            value={user.housingValue}
                            className="px-3 py-3 border border-gray-700 rounded-xl mt-3 w-full bg-transparent"
                          >
                            <option value="">--Select an option--</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </>
                    )}

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleUpdate}
          >
            Update
          </button>

          <button
            className="px-4 py-2 ml-4 text-white bg-red-500 rounded hover-bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edituserdetail;
