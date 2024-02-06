import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth"; 
import { auth } from "../../lib/firebase";
import { Link } from "react-router-dom";

const Forgotpassword = () => {
  const [message, setMessage] = useState("");
  const [email ,setEmail]=useState("")

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };


  return (
    <div className="bg-black text-white">
      <div className="container mx-auto py-12 min-h-screen ">
        <div className="flex justify-center items-center">
          <div className="md:w-3/5 w-full px-5 flex flex-col justify-center items-center ">
            <p className="text-3xl text-center text-primary tracking-wider font-bold">
              Forgot Password
            </p>
            <div className="mt-2 md:w-3/4 w-full mx-auto">
              {message ? (
                <>
                  <p className="text-center">{message}</p>
                  <Link to="/login"  className=" block mt-4 text-center bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full  py-3 rounded-2xl">
                      Back to Login
                  </Link>
                </>
              ) : (
          
                <form className="p-5 space-y-6" onSubmit={handlePasswordReset}>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="px-4 py-3 border border-gray-700 rounded-xl w-full bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      type="submit"
                      className="bg-gradient-to-br from-primary via-primary to-secondry hover:bg-gradient-to-br hover:from-secondry hover:via-primary hover:to-primary text-black w-full py-3 rounded-2xl"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
