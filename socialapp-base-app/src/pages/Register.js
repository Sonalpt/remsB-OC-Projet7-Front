import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(5, "Le pseudo doit faire minimum 5 charactères.")
      .max(15, "Le pseudo doit faire maximum 15 charactères.")
      .required("Ce champ est requis !")
      .matches(
        /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
        "L'utilisateur ne doit pas contenir de charactères spéciaux."
      ),
    password: Yup.string()
      .min(8, "Le mot de passe doit faire minimum 8 charactères")
      .max(20, "Le mot de passe doit faire maximum 20 charactères")
      .required("Ce champ est requis !")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Le mot de passe doit contenir au moins 8 charactères, une majuscule, un chiffre et un charactère spécial"
      ),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth/register", data).then((response) => {
      if (response.data === "L'utilisateur existe déjà") {
        alert(`L'utilisateur ${data.username} existe déjà !`);
      } else if (response.data === "SUCCESS") {
        alert("Vous avez bien crée un nouveau compte");
        navigate("/login");
      }
    });
  };

  return (
    <div className="authContainer">
      <img src="./assets/icon-left-font-monochrome-black.svg" alt="" />
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="loginContainer">
          <div className="authComponent">
            <Link to="/register">S'enregistrer</Link>
            <Link to="/login">Se connecter</Link>
          </div>
          <label>Nom d'utilisateur: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John123...)"
          />

          <label>Mot de passe: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Votre mot de passe..."
          />

          <button type="submit"> S'enregistrer</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
