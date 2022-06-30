import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Groupomania from "../components/Groupomania";
import PhoneNavbar from "../components/PhoneNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/auth/basicinfo/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setUsername(response.data.username);
      });

    axios
      .get(`http://localhost:3001/posts/byuserId/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  }, [listOfPosts.length === 0]);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/auth/basicinfo/${id}`, {
  //       headers: { accessToken: localStorage.getItem("accessToken") },
  //     })
  //     .then((response) => {
  //       setUsername(response.data.username);
  //     });

  //   axios
  //     .get(`http://localhost:3001/posts/byuserId/${id}`, {
  //       headers: { accessToken: localStorage.getItem("accessToken") },
  //     })
  //     .then((response) => {
  //       setListOfPosts(response.data.listOfPosts);
  //       setLikedPosts(response.data.likedPosts);
  //       console.log(likedPosts);
  //       for (let i = 0; i <= listOfPosts.length; i++) {
  //         if (!likedPosts[i]) {
  //           return;
  //         } else if (likedPosts[i].UserId !== authState.id) {
  //           setIsLiked(false);
  //         } else {
  //           setIsLiked(true);
  //           return;
  //         }
  //       }
  //     });
  // }, [listOfPosts.length === 0]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
      });

    axios
      .get(`http://localhost:3001/posts/byuserId/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <>
      <PhoneNavbar />
      <Navbar />
      <div className="profilePageContainer">
        <div className="basicInfo">
          {" "}
          <h1> {username} </h1>
        </div>
        <div className="listOfPosts">
          {listOfPosts.map((value, key) => {
            return (
              <div key={key} className="post">
                <div className="title"> {value.title} </div>
                <div
                  className="body"
                  onClick={() => {
                    navigate(`/post/${value.id}`);
                  }}
                >
                  {value.postText}
                </div>
                <div className="footer">
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                    className={
                      likedPosts.includes(value.id)
                        ? "likedBttn"
                        : "unlikedBttn"
                    }
                  />
                  <label> {value.Likes.length}</label>
                  <FontAwesomeIcon icon={faComment} className="comment" />
                  <label> {value.Comments.length}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Groupomania />
    </>
  );
}

export default Profile;
