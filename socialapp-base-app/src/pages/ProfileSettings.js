import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Navbar from "../components/Navbar";
import Groupomania from "../components/Groupomania";
import PhoneNavbar from "../components/PhoneNavbar";

function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [oldPassword, setOldPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");

  // const changePassword = () => {
  //   axios
  //     .put(
  //       "http://localhost:3001/auth/changepassword",
  //       {
  //         oldPassword: oldPassword,
  //         newPassword: newPassword,
  //         username: authState.username,
  //       },
  //       {
  //         headers: {
  //           accessToken: localStorage.getItem("accessToken"),
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       if (response.data.error) {
  //         alert(response.data.error);
  //       } else {
  //         alert("Vous avez bien changé votre mot de passe !");
  //       }
  //     });
  // };

  const deleteAccount = (id) => {
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
          alert("Votre compte a bien été supprimé");
          navigate("/login");
        }
      });
  };

  return (
    <>
      <PhoneNavbar />
      <Navbar />
      <div className="profileSettingsPageContainer">
        <h3>{authState.username} - Mes paramètres</h3>
        <div className="settings">
          <div className="changePassword">
            {/* <span className="passwordHeader">Changer mon mot de passe</span>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Mot de passe actuel..."
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Nouveau mot de passe..."
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="changePasswordButton" onClick={changePassword}>
              Changer mon mot de passe
            </button> */}
            <button
              className="deleteAccount"
              onClick={() => {
                deleteAccount(authState.id);
              }}
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
      <Groupomania />
    </>
  );
}

export default ProfileSettings;
