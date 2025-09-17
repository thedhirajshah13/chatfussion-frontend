import React, { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { success, errors } from "../utils/tostify";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const SignUp = () => {
  const { setAuth } = useAuthContext();
  const [loading, setloading] = useState(false);
  const [register, setRegister] = useState({});
  const navigate = useNavigate();

  const handleRegister = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", register.name);
    form.append("username", register.username);
    form.append("password", register.password);
    form.append("confirmPassword", register.confirmPassword);
    form.append("gender", register.gender);
    form.append("file", register.file);

    try {
      setloading(true);
      const response = await axios.post(
        "http://localhost:8000/auth/signup",
        form,
        {
          method: "POST",
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        success(response.data.msg);

        setTimeout(() => {
          localStorage.setItem("chat-user", JSON.stringify(response.data));
          setAuth(response);
          setRegister({});
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      errors(error?.response?.data?.msg || "Signup failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen text-white text-xl">
          Processing...
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center relative">
          {/* Background Image */}
          {/* <div
            className="absolute inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("http://localhost:3000/bgo.webp")' }}
          /> */}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 z-[-1]" />

          {/* SignUp Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg w-full max-w-md border border-white/30 p-4 sm:p-8 shadow-lg z-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Sign Up
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="John Doe"
                  required
                  onChange={handleRegister}
                />
              </div>

              {/* Username / Email */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="abc123"
                  required
                  onChange={handleRegister}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="********"
                  required
                  onChange={handleRegister}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="********"
                  required
                  onChange={handleRegister}
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-white">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="w-full mt-1 p-2 rounded-md bg-gray-800 text-white border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                  onChange={handleRegister}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Profile Image */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-white">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  onChange={(e) => setRegister({ ...register, file: e.target.files[0] })}
                />
              </div>

              {/* Link to login */}
              <div className="text-sm text-white">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline">
                  Click here
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default SignUp;
