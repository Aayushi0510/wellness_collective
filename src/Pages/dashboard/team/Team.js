import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Components/Event/Sidebar';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '../../../lib/firebase';

const Team = () => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const formattedEvents = querySnapshot.docs
        .map((doc) => {
          const user = doc.data();
          // Add a check for the role property before comparing
          if (user ) {
            return {
              id: doc.id,
              email: user.email,
              name: user.displayName,
              role: user.role
            };
          }
          return null; // Skip non-attendees or objects without a role property
        })
        .filter(Boolean); // Filter out null values

      setAttendees(formattedEvents);
    };

    fetchData();
  }, []);
console.log(attendees, "attendee")
  return (
    <div className="flex flex-col lg:flex-row container mx-auto text-gray-100 py-5 gap-5">
      <div className="w-full lg:w-1/4">
        <Sidebar />
      </div>
      <div className="w-full lg:w-3/4">
  <div className="bg-gray-700 bg-opacity-20 rounded-xl p-5">
    <div className="table-responsive overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-secondry text-black border-2 border-secondry">
          <tr>
            <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
              S.No
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
              Email Address
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">
              Role Type
            </th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((item, index) => {
            const { email, id, name ,role} = item || {};

            return (
              <tr key={index}>
                <td className="py-4 px-6 text-sm font-medium">{index + 1}</td>
                <td className="py-4 px-6 text-sm font-medium">{name}</td>
                <td className="py-4 px-6 text-sm font-medium">{email}</td>
                <td className="py-4 px-6 text-sm font-medium">{role}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
};

export default Team

