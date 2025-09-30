import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import { success, errors } from "../utils/tostify";

const Login = () => {
  const { setAuth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({});

  const handleLogin = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = "https://chatfussion-backend.onrender.com/auth/login";
      const response = await axios.post(url, JSON.stringify(login), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const result = response.data;
      success(result.msg);

      setTimeout(() => {
        localStorage.setItem("chat-user", JSON.stringify(result));
        setAuth(result);
      }, 4000);
    } catch (error) {
      console.error(`client->Login ${error}`);
      errors(error?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen text-white text-xl">
          Loading...
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

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg w-full max-w-md border border-white/30 p-4 sm:p-8 shadow-lg z-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              Login
            </h2>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="abc123"
                  required
                  onChange={handleLogin}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full mt-1 p-2 rounded-md bg-white/20 text-white placeholder-white/70 border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="********"
                  required
                  onChange={handleLogin}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
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

export default Login;
