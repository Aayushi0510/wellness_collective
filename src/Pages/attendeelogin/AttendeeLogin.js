import React, { useState } from "react";
import { doc, getDoc, getFirestore, setDoc } from "@firebase/firestore";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import CustomPopup from "../../Components/CustomPopup";
import { useAuth } from "../../context/AuthContext";

const AttendeeLogin = () => {
  const navigate = useNavigate();

  const { logout, signInWithGoogle, user } = useAuth();
  const [emailError, setEmailError] = useState("");
  // const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   if (user ) {
  //     navigate("/dashboard/attendee");
  //   }
  // }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      setEmailError("Email and Password are required");
      setVisible(true);
      return;
    }
    console.log("login")

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
console.log("login")
      const user = userCredential.user;
      if (!user.emailVerified) {
        await logout();
        setLoading(false);
        setError(
          "Email not verified. Please check your email for verification."
        );
        setVisible(true);
        return;
      } else {
        const token = user.accessToken;
        const adminDoc = await getDoc(doc(getFirestore(), "users", user.uid));
        const adminData = adminDoc.data();
        console.log(adminData ,"adminData");
        if (adminData) {
          if (user.role === "seekers" || user.role === "practitioners") {
            // const userInfo = {
            //   uid: user.uid,
            //   email: user.email,
            //   ...adminData,
            // };

            localStorage.setItem("userData", JSON.stringify(token));
            setLoading(false);

            navigate("/dashboard/attendee");
          }
        } else {
          navigate("/registers")
          setError("User not found");
          setVisible(true);
          setLoading(false); // Make sure to set loading to false in this case as well
        }
        handleSuccessfulLogin();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Invalid email address format");
        setVisible(true);
      } else if (error.code === "auth/user-not-found") {
        setError("User not found");
        setVisible(true);
      } else if (error.code === "auth/wrong-password") {
        setError("Invalid password");
        setVisible(true);
      } else {
        setError("Invalid email or password");
        setVisible(true);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      // Check if user ID is present in the result
      console.log(result.user.uid)
      if (result && result.user && result.user.uid) {
        const userId = result.user.uid;

        // Check if user data exists in the "users" collection
        const userDoc = await getDoc(doc(getFirestore(), "users", userId));
        if (userDoc.exists()) {
          // User data exists, navigate to the dashboard
          navigate("/dashboard/attendee");
        } else {
          // User data not found, navigate to registers
          navigate("/registers", { state: { user: userId } });
          const userData = {
            id: userId,
            displayName: result.user.displayName,
            email: result.user.email, 
          };
  
          await setDoc(doc(getFirestore(), 'users', userId), userData);
  
        }
      } else {
        // User ID not present in the result, navigate to registers
        navigate("/registers", { state: { user: result.user.uid }});
        
      }
    } catch (error) {
      // Handle errors if needed
      console.error('Error during Google Sign-In:', error);
    }
  };


  const handleSuccessfulLogin = () => {
    const redirectUrl = localStorage.getItem("redirectUrl");

    if (redirectUrl) {
      setError("Log in to register and attend the event.");

      localStorage.removeItem("redirectUrl");

      navigate(redirectUrl);
    } else {
      navigate(`/dashboard/attendee`);
    }
  };
  
console.log(user)
  
  if (!user) {
    return (
      <div className="bg-black text-white w-full min-h-screen flex justify-center items-center ">
        <div className="container mx-auto  h-full  ">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="md:w-3/5 valid:w-full px-5 flex flex-col justify-center items-center ">
              <p className="text-3xl text-center text-primary tracking-wider font-bold">
                Welcome to
              </p>
              <h3 className="bg-secondry px-4 py-2 rounded-xl text-black mt-3 text-center font-bold tracking-wider md:text-3xl text-2xl">
                The Wellness Collective
              </h3>
              <p className="mt-3"> Login to join </p>
              <CustomPopup
                message={error}
                visible={visible}
                setVisible={setVisible}
              />
              <div className="  md:w-3/4 w-full mx-auto">
                <form onSubmit={handleLogin} className="p-5 space-y-6">
                  {emailError && (
                    <div className="text-red-400">{emailError}</div>
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(event) =>
                      setData({ ...data, email: event.target.value })
                    }
                    className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
                  />
                  <div className="realtive">
                    <input
                      placeholder="Password"
                      value={data.password}
                      onChange={(event) =>
                        setData({ ...data, password: event.target.value })
                      }
                      className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
                    />
                  </div>

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
                <div className="flex justify-center  mb-2">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={()=>{handleGoogleSignIn();
                    }}
                    className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
                  >
                    Sign Up with Google
                  </button>
                </div>
                <div className="text-center space-y-2">
                  <div className="tracking-wide ">
                    {` Don't have an account ?`}
                    <Link
                      to={"/register"}
                      className="text-secondry underline ml-2 "
                    >
                      Register Now
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={"/forgot_password"}
                      className="text-secondry underline "
                    >
                      Forgot Password
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    navigate("/dashboard/attendee");
  }
};

export default AttendeeLogin;
