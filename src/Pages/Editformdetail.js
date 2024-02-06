import React, { useState } from "react";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useParams } from "react-router-dom";

const EditSummaryEventDetails = ({ onClose, start }) => {
  const params = useParams();
  const eventId = params.id;

  const [newEndTime, setNewEndTime] = useState("");
  

  const handleSave = async () => {
    try {
      const eventRef = doc(db, "eventactivities", eventId);
  
      const [hours, minutes] = newEndTime.split(":");
      if (hours && minutes) {
        const currentDate = new Date();
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
  
        const updatedEndTimeTimestamp = Timestamp.fromDate(currentDate);
          await updateDoc(eventRef, {
        end: updatedEndTimeTimestamp, 
        });
  
        onClose();
      } else {
        console.error("Invalid time format");
      }
    } catch (error) {
      console.error("Error updating event time: ", error);
    }
  };
  
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      <div className="fixed inset-0 bg-black opacity-70"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-md z-10">
        <h2 className="text-2xl mb-4 text-gray-800 flex justify-center outline-none">
          Event Details
        </h2>

        <div className="flex items-center justify-between">
          <label className="text-gray-800 py-2 w-36">End Time :</label>

          <input
            type="time"
            placeholder="Change End Time"
            className="border px-4 py-2 w-full rounded-md no-outline text-gray-800"
            value={newEndTime}
            onChange={(e) => {
              const inputTime = e.target.value;
              setNewEndTime(inputTime);
            }}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
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

export default EditSummaryEventDetails;
