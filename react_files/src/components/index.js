import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  Login,
  NewPost,
  Posts,
} from "./components";

ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/NewPost" element={<NewPost />} />
      <Route path="/Posts" element={<Posts />}>
        {/* <Route path="" element={<Posts />} />
        <Route path=":postSlug" element={<Post />} /> */}
      </Route>
    </Routes>
    <Footer />
  </Router>,

  document.getElementById("root")
);

serviceWorker.unregister();
  
export { default as Navigation } from "./Navigation";
export { default as Footer } from "./Footer";
export { default as Home } from "./Home";
export { default as Login } from "./Login";
export { default as NewPost } from "./NewPost";
// export { default as Blog } from "./blog/Blog";
export { default as Posts } from "./Posts";
// export { default as Post } from "./blog/Post";