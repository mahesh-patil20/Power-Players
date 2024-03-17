import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import companyLogo from "../assets/ICON_Final.png";
import signin from "../assets/homepage/signin.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect } from "react";
import { useRef } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons"; // Dashboard
import { faBox } from "@fortawesome/free-solid-svg-icons"; // Products
import { faHistory } from "@fortawesome/free-solid-svg-icons"; // History
import { faClipboardList } from "@fortawesome/free-solid-svg-icons"; // Orders
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons"; // Logout
import { FaShoppingCart } from "react-icons/fa";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


import "./NavbarStyle.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Navbar = (props) => {
  const navigate = useNavigate();
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  let menuRef = useRef();
  const { role, setRole } = props.details;

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowMediaIcons(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <div className="hero" ref={menuRef} style={{
        background: "#010409",
      }}>
        <div className="logo">
          <NavLink to="/"> <div><img src={companyLogo} alt="Logo Here" className='logo1' style={{
            width: "200px",
            // border: "2px solid red"
          }} /></div></NavLink>
        </div>
        <div className={showMediaIcons ? "inmobileview itemlist" : "itemlist"}>
          <ul className='List'>

            {/* <NavLink to="/"
              style={({ isActive }) => ({
                color: isActive ? '#158344' : '#545e6f',
                textDecoration: 'none',
                fontWeight: '500',
                // background: isActive ? '#7600dc' : '#f0f0f0',
              })}
            >
              <div style={{
                display: "flex",
                flexDirection: window.innerWidth <= 768 ? "row" : "column",
                alignItems: "center",
              }}>
                <FontAwesomeIcon icon={faHome} />
                <li className='listItem' onClick={() => setShowMediaIcons(false)} style={{
                  fontWeight: '600',
                  marginLeft: window.innerWidth <= 768 ? "10px" : "0px",
                }}>Home</li>
              </div>
            </NavLink>
            <NavLink to="/about"
              style={({ isActive }) => ({
                color: isActive ? '#158344' : '#545e6f',
                textDecoration: 'none',
                fontWeight: '500',
                // background: isActive ? '#7600dc' : '#f0f0f0',
              })}
            >
              <div style={{
                display: "flex",
                flexDirection: window.innerWidth <= 768 ? "row" : "column",
                alignItems: "center",
              }}>
                <FontAwesomeIcon icon={faInfoCircle } />
                <li className='listItem' onClick={() => setShowMediaIcons(false)} style={{
                  fontWeight: '600',
                  marginLeft: window.innerWidth <= 768 ? "10px" : "0px",
                }}>About Us</li>
              </div>
            </NavLink> */}
            <NavLink to="/login"
              style={({ isActive }) => ({
                color: isActive ? '#158344' : '#545e6f',
                textDecoration: 'none',
                fontWeight: '500',
                // background: isActive ? '#7600dc' : '#f0f0f0',
              })}
            >
              <div style={{
                display: "flex",
                flexDirection: window.innerWidth <= 768 ? "row" : "column",
                alignItems: "center",
              }}>
                <FontAwesomeIcon icon={faSignInAlt} />
                <li className='listItem' onClick={() => setShowMediaIcons(false)} style={{
                  fontWeight: '600',
                  marginLeft: window.innerWidth <= 768 ? "10px" : "0px",
                }}>Signup/Login</li>
              </div>
            </NavLink>

            {/* <a href="https://www.njindiaonline.in/cdesk/login.fin" target="_blank" rel="noreferrer"><li className='listItem login' onClick={() => setShowMediaIcons(false)}>LOG IN</li></a> */}

          </ul>
        </div>

        <div className="hamburger-menu" onClick={() => setShowMediaIcons(!showMediaIcons)}>
          <GiHamburgerMenu className='hamburgerlines' />
        </div>

      </div>

      <Outlet />
    </>
  );
};

export default Navbar;
