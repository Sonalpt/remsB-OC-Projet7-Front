import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneNavbar from "../components/PhoneNavbar";
import Moment from "react-moment";
import "moment-timezone";
import Navbar from "../components/Navbar";
import Groupomania from "../components/Groupomania";

const AdminPage = () => {
  const [listOfUsers, setListOfUsers] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/admin", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfUsers(response.data);
      });
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`http://localhost:3001/auth/deleteaccount/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("L'utilisateur a bien été supprimé");
          navigate("/");
        }
      });
  };
  return (
    <>
      <PhoneNavbar />
      <Navbar />
      <section className="adminPage">
        <span className="adminTitle">Users</span>
        <ul>
          {listOfUsers.map((user, key) => {
            return (
              <>
                <li key={user.id}>
                  <span>id: {user.id}</span>
                  <span>{user.username}</span>
                  <span>Inscrit le</span>
                  <Moment locale="fr" format="LLLL">
                    {user.createdAt}
                  </Moment>
                  <button
                    className="deleteButton"
                    onClick={() => deleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </li>
              </>
            );
          })}
        </ul>
      </section>
      <Groupomania />
    </>
  );
};

export default AdminPage;
