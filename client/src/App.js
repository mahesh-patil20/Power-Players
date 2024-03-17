import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navbar2 from "./components/Navbar2";
import Home from "./pages/Visitor/Home";
import About from "./pages/Visitor/About";
import Dashboard from "./pages/User/Dashboard";
import NotFound from "./components/NotFound";
import LiveFeed from "./components/Live";
import Login from "./pages/Visitor/Login";
import EmergencyContacts from "./pages/User/EmergencyContacts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function App() {
  const [role, setRole] = useState("visitor");
  const verifyToken = async (token) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/verifyToken`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 200) {
        if (res.data.msg === "verified") {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      const verify = verifyToken(token);
      if (verify) {
        setRole(role);
      } else {
        setRole("visitor");
      }
    } else {
      setRole("visitor");
    }
    console.log(role);
  }, []);
  return (
    <>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss={false}
draggable
pauseOnHover
theme="dark"
/>
      {role === "visitor" && (
        <>
          {/* <Navbar details={{ role, setRole }} /> */}
          <Routes>
            <Route exact path="/" element={<Login details={{ role : "user", setRole }} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
      {role === "user" && (
        <>
          <Navbar2 details={{ role, setRole }} />
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/livefeed" element={<LiveFeed />} />
            <Route path="/emergencycontacts" element={<EmergencyContacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}

    </>
  );
}

export default App;
