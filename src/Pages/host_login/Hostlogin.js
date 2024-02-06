import React, { useState } from "react";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import CustomPopup from "../../Components/CustomPopup";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Hostlogin = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);
   const {user ,logout}=useAuth()

  // useEffect(() => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setError("");
  
    if (!data.email) {
      setEmailError("Email is required");
      setVisible(true);
      return;
    }
    if (!data.password) {
      setPasswordError("Password is required");
      setVisible(true);
      return;
    }
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
  
      const adminDoc = await getDoc(doc(getFirestore(), "users", user.uid));
      const adminData = adminDoc.data();
      console.log(adminData);
  
      if (adminData) {
        if (adminData.role === "host") {
          const userInfo = {
            uid: user.uid,
            email: user.email,
            ...adminData,
          };
  
          localStorage.setItem("userData", JSON.stringify(userInfo));
          setLoading(false);
          navigate("/dashboard");
        } else {
          // Handle other roles as needed
          await logout()
          setLoading(false);
          setError("User not found");
          setVisible(true);
        }
      } else {
        // If adminData is null, user not found
        setLoading(false);
        setError("User not found");
        setVisible(true);
      }
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/invalid-email") {
        setError("Invalid email address format");
        setVisible(true);
      } else if (error.code === "auth/wrong-password") {
        setError("Invalid password");
        setVisible(true);
      } else {
        setError("Login failed");
        setVisible(true);
      }
    }
  };
  

  return (
    <>
      <header>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </header>
      <div className="bg-black text-white min-h-screen">
        <div className="container mx-auto py-16  ">
          <CustomPopup
            message={emailError || passwordError || error}
            visible={visible}
            setVisible={setVisible}
          />

          <div className="flex justify-center items-center">
            <div className="md:w-3/5 w-full px-5 flex flex-col justify-center items-center ">
              <p className="text-3xl text-center text-primary tracking-wider font-bold">
                Welcome to
              </p>
              <h3 className="bg-secondry px-4 py-2 rounded-xl text-black mt-3 text-center font-bold tracking-wider md:text-3xl text-xl">
                The Wellness Collective
              </h3>
              <p className="mt-4 text-3xl">Host Login</p>
              <div className=" mt-1 md:w-3/4 w-full mx-auto">
                <form onSubmit={handleLogin} className="p-5 space-y-6">
                  <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(event) =>
                      setData({ ...data, email: event.target.value })
                    }
                    className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(event) =>
                      setData({ ...data, password: event.target.value })
                    }
                    className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
                  />

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
                    >
                      {loading ? "Loading..." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hostlogin;
