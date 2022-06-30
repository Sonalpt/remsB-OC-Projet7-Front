import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../helpers/AuthContext";
import Moment from "react-moment";
import "moment-timezone";
import NavBar from "../components/Navbar";
import Groupomania from "../components/Groupomania";
import PhoneNavbar from "../components/PhoneNavbar";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
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
    }
  }, []);

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
      <NavBar />
      <section className="home">
        {listOfPosts.map((value, key) => {
          return (
            <article className="post" key={value.id}>
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
                <div className="date">
                  <div className="created">
                    <span>crée le</span>
                    <Moment locale="fr" format="LLLL">
                      {value.createdAt}
                    </Moment>
                  </div>
                  {/* <div className="updated">
                  <span>mis à jour le</span>
                  <Moment format="LLLL">{value.updatedAt}</Moment>
                </div> */}
                </div>
              </div>
              <h3
                className="title"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                {" "}
                {value.title}{" "}
              </h3>
              <div
                className="body"
                onClick={() => {
                  navigate(`/post/${value.id}`);
                }}
              >
                <div className="postText">{value.postText}</div>
                <img src={value.imageUrl} alt="" />
              </div>
              <div className="footer">
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "likedBttn" : "unlikedBttn"
                  }
                />
                <label> {value.Likes.length}</label>
                <FontAwesomeIcon icon={faComment} className="comment" />
                <label> {value.Comments.length}</label>
              </div>
            </article>
          );
        })}
      </section>
      <Groupomania />
    </>
  );
}

export default Home;
