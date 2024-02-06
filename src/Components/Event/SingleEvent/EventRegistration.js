import { Link } from "react-router-dom";
import React from "react";
import { db } from "../../../lib/firebase";
import { useState } from "react";
import { useEffect } from "react";
import { doc, getDoc, getFirestore } from "@firebase/firestore";


const EventRegistration = ({ activities }) => {
  console.log(activities);
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  const [loading, setLoading] = useState(true);


  const totalRegister = activities.registeredUsers.length;

  useEffect(() => {
  const userIDs = activities.registeredUsers;
  const userDataArray = [];

  const fetchUserData = async (userID) => {
    try {
      const userDoc = await getDoc(doc(getFirestore(), "users", userID));
      if (userDoc.exists) {
        const userData = userDoc.data();
        userDataArray.push(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserDataPromises = userIDs.map((userID) => fetchUserData(userID));

  Promise.all(fetchUserDataPromises)
    .then(() => {
      setRegisteredUsersData(userDataArray);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}, [activities]);

  console.log(registeredUsersData);

  // const handleDownload = () => {
  //   // Create a new workbook and add a worksheet
  //   const workbook = XLSX.utils.book_new();
  //   const worksheet = XLSX.utils.json_to_sheet(registeredUsersData);

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");

  //   // Create a Blob object containing the workbook's data
  //   const blob = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "blob",
  //   });

  //   // Create a URL for the Blob object
  //   const url = URL.createObjectURL(blob);

  //   // Create an anchor element to trigger the download
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "user_data.xlsx";
  //   a.click();

  //   // Clean up by revoking the URL
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div>
      <div className="w-full bg-gray-700 bg-opacity-20 px-8 py-5 rounded-2xl overflow-hidden">
        <h2 className="tracking-wide text-lg">Participants Details</h2>
        <p className="text-sm text-gray-400">Manage your all participants</p>
      </div>
      <div className="flex flex-col gap-4 px-8 py-8">
        <h2 className="tracking-wide">Registration & Attendance</h2>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3">
            <p>Registration</p>
            <p className="bg-gradient-to-br from-primary via-primary to-secondry text-black shadow-xl w-24 h-24 flex items-center justify-center p-4 rounded-full">
              {totalRegister}/{activities.participant}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p>Attend</p>
            <p className="bg-gradient-to-br from-primary via-primary to-secondry text-black shadow-xl w-24 h-24 flex items-center justify-center p-4 rounded-full">
              0/30
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mb-6 bg-gray-700 bg-opacity-20 px-8 py-5 rounded-2xl flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-3"
          />
        </div>
        <div>
          <Link
            to="#"
            // onClick={handleDownload}

            className="w-full lg:w-fit bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black px-8 py-3 rounded-3xl"
          >
            Download List
          </Link>
        </div>
      </div>
      <div className="w-full bg-gray-700 bg-opacity-20 px-8 py-8 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
                  S.No
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
                  Participants (30)
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
                  Email Address
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
                  Role Type
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {registeredUsersData.map((user, index) => (
                <tr key={user.id}>
                  <td className="py-4 px-6 text-sm font-medium">{index + 1}</td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {user.displayName}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">{user.role}</td>
                  <td className="py-4 px-6 text-sm font-medium text-green-600">
                    Registered
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
