import React from "react";
import Footer from "../Footer.js";
import Header from "../Header.js";
import SideNav from "../SideNav/index.js";

const AuthLayout = (props) => (
  <div>
    <Header />
    {props.children}
    
  </div>
);

export default AuthLayout;
