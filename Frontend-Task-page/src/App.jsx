// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import ProfileUpdate from "./Pages/ProfileUpdate";
import AsciiArt from "./Components/WaterMark.jsx"
import UserRoute from "./Pages/UserRoute.jsx";
import AdminRoute from "./Pages/AdminRoute.jsx";
import HRStaff from "./Pages/HR_Route.jsx";
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

        setUser(res.data.username)
        setProfileComplete(Boolean(!!res.data.profileComplete));
      } catch (error) {
        console.error("Error checking profile completeness", error);
        setUser(null);
        setProfileComplete(false);
      }
    };

    checkUserProfile();
  }, []);

  if (user === undefined || profileComplete === undefined) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    console.log(AsciiArt)
  }, [])

  const handleLogin = async ({ user, token }) => {
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    try {
      const res = await axios.get("http://localhost:8000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Must include Bearer!
        }
      })
      setProfileComplete(Boolean(res.data.profileComplete))

      const role = localStorage.getItem("role")
      if (role === "admin") {
        navigate("/admin")
      } else if (res.data.profileComplete) {
        navigate("/user")
      } else {
        navigate("/profile-update")
      }
    } catch (error) {
      console.error("Error checking profile completeness", error);
      setProfileComplete(false);
    }
  };

  const handleProfileComplete = () => {
    setProfileComplete(true);
    const role = localStorage.getItem("role");

    if(role === "admin") { 
      navigate("/admin");
    } else { 
      navigate("/user");
    }
  };

  const handleLogout = () => {
    //setUser(null);
    console.log("logging out....")
    setProfileComplete(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    sessionStorage.removeItem("staffData")
    navigate("/login");
  };

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")
  useEffect(() => {
    console.log(token, role)
  },[])

  useEffect(() => {
    console.log("user:", user);
    console.log("role:", role);
    console.log("profileComplete:", profileComplete);
  }, [user, role, profileComplete]);

  return (

    <Routes>
      <Route
        path="/"
        element={
          user && role === "admin" ? (
            <Navigate to="/admin" replace />
          ) : user && role === "HR" ? (
            <Navigate to="/hr" replace />
          ) : user && role === "Manager" ? (
            <Navigate to="/manager" replace />
          ): user && profileComplete ? (
            <Navigate to="/user" replace/>
          ) : user ? (
            <Navigate to="profile-update" replace/>
          ) : (
            <Navigate to= "/login" replace/>
          )
        }
      />

      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      <Route
        path="/profile-update"
        element={
          user //if user is exist
            ? role === "admin" // if user is admin
              ? <Navigate to="/admin" replace /> 
            : profileComplete // else if profile is complete
              ? <Navigate to="/user" replace /> 
            : <ProfileUpdate onProfileComplete={handleProfileComplete} /> 
          : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/user/*"
        element={ user && (role === "Worker"|| role === "staff" || role === "Designer")
          ? ( profileComplete
            ? <UserRoute user={user} onLogout={handleLogout} /> 
            : <Navigate to="/profile-update" replace />
          
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin/*"
        element={ user && role === "admin" ? (
          <AdminRoute user={user} onLogout={handleLogout}/>
        ) : (
          <Navigate to="/login" replace />)
          
        }
      />

      <Route
        path="/hr/*"
        element={ user && role === "HR"
          ? ( profileComplete 
            ? <HRStaff user={user} onLogout={handleLogout}/>
            : <Navigate to="/profile-update" replace />
        ):(
          <Navigate to="/login" replace />
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
