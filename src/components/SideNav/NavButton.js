import React from "react";
import { Col } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const NavButton = ({ name, image, link }) => (
  <>
    <Col as={Link} to={link} className={useLocation().pathname === link ? "nav-btn selected-nav-btn none" : "nav-btn none"} style={{paddingTop: 10, justifyContent: "center"}}>
        <img className="pb-1" alt={name} src={image} style={{ maxWidth: "30px" }} />
        <p style={{fontSize: 12}}>{name}</p>
    </Col>
  </>
);

export default NavButton;
