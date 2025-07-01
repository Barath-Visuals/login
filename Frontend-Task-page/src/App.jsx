// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import ProfileUpdate from "./Pages/ProfileUpdate";
import Home from "./Pages/home";
import axios from "axios";

export default function AppRoutes() {
  const [user, setUser] = useState("guest");
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  // Check user profile on load
  useEffect(() => {
    const checkUserProfile = async () => {
      const storedToken = localStorage.getItem("token");

      console.log("token : ", storedToken)
      if (!storedToken) {
        setUser(null);
        setProfileComplete(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/user/profile", {
          headers: {
            Authorization: `Bearer ${storedToken}`, // ✅ Must include Bearer!
          },
        });
        console.log("User profile data:", res.data);

        if (res.data?.profileComplete) {
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error("Error checking profile completeness", error);
        setUser(null);
        setProfileComplete(false);
      }
    };

    checkUserProfile();
  }, []);


  const handleLogin = ({ user, token }) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleProfileComplete = () => {
    setProfileComplete(true);
    navigate("/home");
  };

  const handleLogout = () => {
    //setUser(null);
    console.log("logging out....")
    setProfileComplete(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          //user ? (
            //profileComplete ? (
            //  <Navigate to="/home" replace />
            //) : (
            //  <Navigate to="/profile-update" replace />
            //)
          //) : (
            <Navigate to="/login" replace />
          //)
        }
      />

      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      <Route
        path="/profile-update"
        element={
          //user && !profileComplete ? (
            <ProfileUpdate onProfileComplete={handleProfileComplete} />
          //) : (
          //  <Navigate to="/home" replace />
          //)
        }
      />

      <Route
        path="/home"
        element={
          //user && profileComplete ? (
            <Home user={user} onLogout={handleLogout} />
          //) : (
          //  <Navigate to="/login" replace />
          //)
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
