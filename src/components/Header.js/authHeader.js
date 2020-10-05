import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { removeToken } from "../../utils/authUtils";

const AuthHeader = () => (
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
          <Nav.Link as={Link} to="/make-predictions">
            Make Prediciton
          </Nav.Link>
          <Nav.Link as={Link} to="/faq">
            FAQ
          </Nav.Link>
          <Nav.Link as={Link} to="#">
            Balance: ₦0.00
          </Nav.Link>
          <Nav.Link>
            <i className="fa fa-power-off"></i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
);

export const userHeader = () => {
  // const wallet = useSelector(selectWallet);
  // const history = useHistory();
  // const logoutUser = () => {
  //   removeToken();
  //   history.push("/");
  // };
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
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/transactions">
              Transactions
            </Nav.Link>
            <Nav.Link as={Link} to="/sports-predictions">
              Sports
            </Nav.Link>
            <Nav.Link as={Link} to="/lottery-predictions">
              Lottery
            </Nav.Link>
            <Nav.Link as={Link} to="/predictions">
              Predicitons
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              Settings
            </Nav.Link>
            <Nav.Link as={Link} to="/deposit">
              Deposit
            </Nav.Link>
            <Nav.Link as={Link} to="/withdraw">
              Withdraw
            </Nav.Link>
            <Nav.Link>
              <i className="fa fa-power-off"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default AuthHeader;
