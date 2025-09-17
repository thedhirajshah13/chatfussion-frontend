import React from "react";
import SignUp from "../../components/SignUp";
import Login from "../../components/Login";
import Dashboard from "../../components/Dashboard";
import { Navigate } from "react-router-dom";

import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Home = () => {
  const { auth } = useAuthContext();
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={auth ? <Dashboard /> : <Navigate to="/signup" />}
        />
        <Route
          path="/signup"
          element={auth ? <Navigate to="/login" /> : <SignUp />}
        />
        <Route path="/login" element={auth ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </>
  );
};

export default Home;
