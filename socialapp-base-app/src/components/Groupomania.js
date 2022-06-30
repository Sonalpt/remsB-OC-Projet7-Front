import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/index.scss";
import axios from "axios";
import Moment from "react-moment";
import "moment-timezone";

const Groupomania = () => {
  const [lastUsers, setLastUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/lastusers", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setLastUsers(response.data);
      });
  }, []);

  return (
    <div className="groupomaniaNavbar">
      <img
        src="/assets/icon-left-font-monochrome-black.svg"
        alt="Logo de Groupomania"
      />
      <section className="conditions">
        <Link to="/">Conditions d’utilisation</Link>
        <Link to="/">Politique de Confidentialité</Link>
        <Link to="/">Politique relative aux cookies</Link>
        <Link to="/">Accessibilité</Link>
        <Link to="/">© 2022 Groupomania, Inc.</Link>
      </section>
      <section className="lastCreatedUsers">
        <h3>Derniers utilisateurs inscrits:</h3>
        <ul>
          {lastUsers.map((user, key) => {
            return (
              <li key={user.username}>
                <span className="username">{user.username}</span>
                <span className="createdAt">
                  Inscrit le{" "}
                  <Moment locale="fr" format="LLLL">
                    {user.createdAt}
                  </Moment>
                </span>{" "}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Groupomania;
