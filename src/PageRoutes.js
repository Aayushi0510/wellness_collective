import React from "react";
import { BrowserRouter , Routes, Route ,Navigate } from "react-router-dom";
import Singlevent from "./Singlevent";
import Room from "./Room";
import Banner from "./Components/Home/Banner";
import Dashboard from "./Pages/dashboard/Dashboard";
import Createevent from "./Pages/dashboard/Createevent";
import AttendeeLogin from "./Pages/attendeelogin/AttendeeLogin";
import Attendeeregistration from "./Pages/attendee_registration/Attendeeregistration";
import Hostlogin from "./Pages/host_login/Hostlogin";
import Header from "./Components/Layout/Header";
import Forgotpassword from "./Pages/forget_password/Forgotpassword";
import Myaccount from "./Pages/dashboard/Myaccount";
import Videolibrary from "./Pages/dashboard/Videolibrary/Videolibrary";
import Team from "./Pages/dashboard/team/Team";
import Attendeeevent from "./Pages/dashboard/attendee_event/Attendeeevent";
import ProtectedRoute from "./Components/ProtectedRoute";
import Group from "./Pages/dashboard/group/Group";
import Recurring from "./Pages/dashboard/Recurring";
import EditSummaryEventDetails from "./Pages/Editformdetail";
import Createactivity from "./Pages/dashboard/Createactivity";
import Singleactivty from "./Singleactivity";
import Activity from "./Activity";
import Recurringactivity from "./Pages/dashboard/recurringactivity/Recurringactivity";
import Groupactivity from "./Pages/dashboard/networking/Groupactivity";
import GoogleRegistartion from "./Pages/GoogleRegistration/GoogleRegistration";


const PageRoutes = () => {
  return (
    <div>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Banner/>}/>
          <Route path="/dashboard" element={<ProtectedRoute Components={Dashboard} />} />
          <Route path="/dashboard/createevent" element={<Createevent/>} />
          <Route path="/dashboard/event/:id" element={<Singlevent />} />
          <Route path="dashboard/room/:id" element={<Room />} />
          <Route path="/login" element={<AttendeeLogin/>} />
          <Route path="/register" element={<Attendeeregistration/>} />
          <Route path="/registers" element={<GoogleRegistartion/>} />

          <Route path="/host_login" element={<Hostlogin/>} />
          <Route path="dashboard/room/:id" element={<Room />} />
          <Route path="/forgot_password" element={<Forgotpassword/>} />
          <Route path="/dashboard/my_account" element={<Myaccount/>} />
          <Route path="/dashboard/vedieoliabrary" element={<Videolibrary/>} />
          <Route path="/dashboard/team" element={<Team/>} />
          <Route path="/dashboard/attendee" element={<Attendeeevent/>}/>
          <Route path="/dashboard/group/:id" element={<Group/>}/>
          <Route path="/dashboard/createrecurring" element={<Recurring/>}/>
          <Route path="/dashboard/createactivity" element={<Createactivity/>}/>
          <Route path="/dashboard/activity/:id" element={<Singleactivty/>}/>
          <Route path="/dashboard/roomactivity/:id" element={<Activity/>}/>
          <Route path="/dashboard/recurringactivity" element={<Recurringactivity/>}/>
          <Route path="/dashboard/recurringactivity" element={<Recurringactivity/>}/>
          <Route path="/dashboard/groupactivity/:id" element={<Groupactivity/>}/>


          <Route path="/edit" element={<EditSummaryEventDetails/>}/>
          <Route
            path="/*"
            element={<Navigate to="/dashboard" />}
          />


        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default PageRoutes;
