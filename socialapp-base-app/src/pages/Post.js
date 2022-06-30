import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Navbar from "../components/Navbar";
import Moment from "react-moment";
import "moment-timezone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Groupomania from "../components/Groupomania";
import PhoneNavbar from "../components/PhoneNavbar";
import moment from "moment-timezone";

function Post() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const [editCommentVisibility, setEditCommentVisibility] = useState(false);
  const [newText, setNewText] = useState("");
  const [image, setImage] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [file, setFile] = useState("");

  moment.locale("fr");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/byId/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setPostObject(response.data);
        setLikedPosts(response.data.Likes);
      })
      .then(() => {
        if (likedPosts.length === 0) {
          return;
        } else {
          for (let i = 0; i <= likedPosts.length; i++) {
            if (!likedPosts[i]) {
              return;
            } else if (likedPosts[i].UserId !== authState.id) {
              setIsLiked(false);
            } else {
              setIsLiked(true);
              return;
            }
          }
        }
      });

    axios
      .get(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setComments(response.data);
      });
  }, [postObject.id]);

  const formData = new FormData();

  formData.append("image", image);
  formData.append("newText", newText);
  formData.append("id", id);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert("L'utilisateur n'est pas authentifié !");
        } else {
          axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
          });
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = () => {
    axios.put("http://localhost:3001/posts/editpost", formData, {
      headers: { accessToken: localStorage.getItem("accessToken") },
      "Content-Type": "multipart/form-data",
    });
    navigate("/");
  };

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        axios
          .get(`http://localhost:3001/posts/byId/${id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          })
          .then((response) => {
            setPostObject(response.data);
            setLikedPosts(response.data.Likes);
            if (isLiked === true) {
              setIsLiked(false);
            } else {
              setIsLiked(true);
            }
          });
      });
  };

  return (
    <>
      <Navbar />
      <PhoneNavbar />
      <section className="postPage">
        <div className="content" id="individual">
          <div className="username">
            {" "}
            {postObject.username}
            <div className="date">
              <div className="created">
                <span>crée le</span>
                <Moment locale="fr" format="LLLL">
                  {postObject.createdAt}
                </Moment>
              </div>
              {/* <div className="updated">
                  <span>mis à jour le</span>
                  <Moment format="LLLL">{value.updatedAt}</Moment>
                </div> */}
            </div>
          </div>
          <div className="contentBody">
            <h1 className="title"> {postObject.title} </h1>
            <article className="body">{postObject.postText}</article>
            <img src={postObject.imageUrl} alt="" />
          </div>

          <div className="footer">
            {(authState.username === postObject.username ||
              authState.isAdmin === true) && (
              <>
                <button
                  className="deleteButton"
                  onClick={() => {
                    deletePost(postObject.id);
                  }}
                >
                  {" "}
                  Supprimer
                </button>
                <button
                  className="editButton"
                  onClick={() => {
                    setEditCommentVisibility(true);
                  }}
                >
                  Editer
                </button>
              </>
            )}

            <FontAwesomeIcon
              icon={faThumbsUp}
              onClick={() => {
                likeAPost(postObject.id);
              }}
              className={isLiked === true ? "likedBttn" : "unlikedBttn"}
            />
            <label> {likedPosts.length}</label>
          </div>
        </div>

        <div className={editCommentVisibility ? "editComment" : "hidden"}>
          <div className="containerName">Editer votre post</div>

          <Formik encType="multipart/form-data" onSubmit={editPost}>
            <Form action="put" method="put" encType="multipart/form-data">
              <textarea
                type="text"
                name="newText"
                id="newText"
                maxLength={8000}
                className="editSection"
                placeholder="Votre nouveau contenu ..."
                onChange={(e) => {
                  setNewText(e.target.value);
                }}
              />
              <input
                type="file"
                name="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {(authState.username === postObject.username ||
                authState.username === "admin") && (
                <button type="submit" className="editButton" onClick={editPost}>
                  Editer
                </button>
              )}
              <span
                onClick={() => {
                  setEditCommentVisibility(false);
                }}
              >
                Fermer
              </span>
            </Form>
          </Formik>
        </div>

        <section className="commentSection">
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Votre commentaire..."
              maxLength={1000}
              autoComplete="off"
              value={newComment}
              onChange={(event) => {
                setNewComment(event.target.value);
              }}
            />
            <button onClick={addComment}> Commenter</button>
          </div>
          <div className="listOfComments">
            {comments.map((comment, key) => {
              return (
                <div key={key} className="comment">
                  <div className="commentUsername">
                    <label> {comment.username}</label>
                    <div className="created">
                      {/* <span>crée le</span> */}
                      <Moment locale="fr" format="LLLL">
                        {comment.createdAt}
                      </Moment>
                    </div>
                  </div>
                  <div className="commentBody">
                    <div className="commentText">{comment.commentBody}</div>

                    {(authState.username === comment.username ||
                      authState.isAdmin === true) && (
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="deleteComment"
                        onClick={() => {
                          deleteComment(comment.id);
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
      <Groupomania />
    </>
  );
}

export default Post;
