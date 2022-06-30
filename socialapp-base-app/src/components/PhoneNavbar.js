import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faHome,
  faNewspaper,
  faUser,
  faBed,
  faHammer,
  faCircleInfo,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const PhoneNavbar = () => {
  const { authState } = useContext(AuthContext);
  const logout = () => {
    localStorage.removeItem("accessToken");
  };
  return (
    <>
      <nav className="phoneNavbar">
        <Link to="/">
          <FontAwesomeIcon icon={faHome} className="comment" />
        </Link>
        <Link to="/createpost">
          <FontAwesomeIcon icon={faNewspaper} className="comment" />
        </Link>
        <Link to="/myprofile">
          <FontAwesomeIcon icon={faUser} className="comment" />
        </Link>
        <Link className="navButton" to="/login" onClick={logout}>
          <FontAwesomeIcon icon={faBed} className="comment" />
        </Link>
        {authState.isAdmin === true && (
          <Link to="/gestion">
            <FontAwesomeIcon icon={faHammer} className="comment" />
          </Link>
        )}
      </nav>
    </>
  );
};

export default PhoneNavbar;
