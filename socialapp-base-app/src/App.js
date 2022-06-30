import React from "react";
import "./styles/index.scss";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import AdminPage from "./pages/AdminPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faHome,
  faNewspaper,
  faUser,
  faBed,
  faCircleQuestion,
  faHammer,
} from "@fortawesome/free-solid-svg-icons";
import PhoneNavbar from "./components/PhoneNavbar";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    isAdmin: false,
    status: false,
  });

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

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/createpost" exact element={<CreatePost />} />
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="*" exact element={<PageNotFound />} />
            <Route path="/myprofile" element={<ProfileSettings />} />
            <Route path="/gestion" element={<AdminPage />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
