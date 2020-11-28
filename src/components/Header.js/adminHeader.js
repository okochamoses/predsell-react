import React, { useEffect } from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { updateUserStateFromApi } from "../../redux/reducers/userReducer";
import { removeToken } from "../../utils/authUtils";

const AuthHeader = ({ balance }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(updateUserStateFromApi());
  }, []);

  const logoutUser = () => {
    removeToken();
    history.push("/");
  };

  return (
    <>
      <Navbar className="p-3" expand="lg" style={{backgroundColor: "#202020"}}>
        <Navbar.Brand as={Link} to="/" href="">
          <Image src={require("../../assets/images/logo.png")} style={{height: "50px"}} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link className="text-light" as={Link} to="/admin-dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/admin-predictions">
              Predictions
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/admin-transactions">
              Transactions
            </Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/admin-users">
              Users
            </Nav.Link>
            <Nav.Link onClick={logoutUser} className="text-light">
              <i className="fa fa-power-off"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AuthHeader;
