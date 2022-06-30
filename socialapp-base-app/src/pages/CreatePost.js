import React, { useContext, useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Navbar from "../components/Navbar";
import Groupomania from "../components/Groupomania";
import { Editor } from "@tinymce/tinymce-react";
import PhoneNavbar from "../components/PhoneNavbar";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  let navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
    image: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  const editorRef = useRef(null);

  const onSubmit = () => {
    axios
      .post(
        "http://localhost:3001/posts",
        {
          title: title,
          postText: postText,
          image: image,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        navigate("/");
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <PhoneNavbar />
      <Navbar />
      <section className="createPostPage">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          encType="multipart/form-data"
        >
          <Form
            className="formContainer"
            action="post"
            encType="multipart/form-data"
          >
            <label>Titre: </label>

            <textarea
              autoComplete="off"
              type="text"
              name="title"
              placeholder="(Ex. Titre...)"
              maxLength={80}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <label>Post: </label>

            <textarea
              autoComplete="off"
              type="text"
              name="postText"
              className="postText"
              placeholder="(Ex. Un Post...)"
              maxLength={8000}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
            />

            <input
              type="file"
              name="image"
              className="fileButton"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />

            <button type="submit" onClick={onSubmit}>
              {" "}
              Poster
            </button>
          </Form>
        </Formik>
      </section>
      <Groupomania />
    </>
  );
}

export default CreatePost;
