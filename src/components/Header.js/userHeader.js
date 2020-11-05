import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { removeToken } from "../../utils/authUtils";

const UserHeader = () => {
  // const wallet = useSelector(selectWallet);
  const history = useHistory();
  const logoutUser = () => {
    removeToken();
    history.push("/");
  };
  return (
    <>
      <Navbar className="p-3" bg="primary" expand="lg">
        <Navbar.Brand as={Link} to="#" href="">
          PREDSELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-md-none">
            {/* <Nav.Link as={Link} to="#">
              Balance: {useSelector(selectWallet).availableBalance}
            </Nav.Link> */}
            <Nav.Link as={Link} to="/transactions">
              Transactions
            </Nav.Link>
            <Nav.Link as={Link} to="/predictions">
              Predicitons
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              Settings
            </Nav.Link>
            <Nav.Link as={Link} to="/withdraw">
              Withdraw
            </Nav.Link>
            <Nav.Link onClick={logoutUser}>
              <i className="fa fa-power-off"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default UserHeader;
