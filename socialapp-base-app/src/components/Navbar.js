import React from "react";
import "../styles/index.scss";
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
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { authState } = useContext(AuthContext);

  const [isAuthState, setAuthState] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            isAdmin: response.data.isAdmin,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
  };

  return (
    <>
      <nav className="navbar">
        <div className="links">
          <h2>{authState.username}</h2>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} className="comment" />
            <span>Accueil</span>
          </Link>
          <Link to="/createpost">
            <FontAwesomeIcon icon={faNewspaper} className="comment" />
            <span>Créer un post</span>
          </Link>
          <Link to="/myprofile">
            <FontAwesomeIcon icon={faUser} className="comment" />
            <span>Mon profil</span>
          </Link>
          <Link className="navButton" to="/login" onClick={logout}>
            <FontAwesomeIcon icon={faBed} className="comment" />
            <span>Se déconnecter</span>
          </Link>
          {authState.isAdmin === true && (
            <Link to="/gestion">
              <FontAwesomeIcon icon={faHammer} className="comment" />
              <span>Gestion</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
