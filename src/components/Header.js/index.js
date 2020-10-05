import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => (
  <>
    <Navbar className="p-3" bg="primary" expand="lg">
      <Navbar.Brand as={Link} to="/" href="">
        PREDSELL
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/sports-predictions">
            Sports
          </Nav.Link>
          <Nav.Link as={Link} to="/lottery-predictions">
            Lottery
          </Nav.Link>
          <Nav.Link as={Link} to="/faq">
            FAQ
          </Nav.Link>

          <Nav.Item className="mr-4" href="#link">
            <Link to="/login">
              <Button variant="outline-light">
                <span style={{ color: "#1E2A78" }}>Login</span>
              </Button>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link to="/register">
              <Button className="" variant="danger">
                <span style={{ color: "#fff" }}>Register</span>
              </Button>
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default Header;
