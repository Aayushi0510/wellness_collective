import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { Components } = props;
  const { user } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user) {
    navigate("/login");
    }
  }, []);

  return (
    <>
      <Components />
    </>
  );
};

export default ProtectedRoute;