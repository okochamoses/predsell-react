import React, { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import NavButton from "./NavButton";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUser,
  updateWallet,
  selectWallet,
  updateUserStateFromApi,
  selectProfile,
} from "../../redux/reducers/userReducer";
import { removeToken } from "../../utils/authUtils";
import utils from "../../utils";

const SideNav = ({ toggleSideNav }) => {
  const wallet = useSelector(selectWallet);
  const profile = useSelector(selectProfile);
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
      <div id="sidebar-wrapper">
        <div className="ml-md-3 mt-4 p-3 list-group" style={{ backgroundColor: "#FFF", borderRadius: 10, textAlign: "center" }}>
          <div className="pt-1 pb-4 text-left">
            <i onClick={toggleSideNav}>
              <svg id="side-nav-arrow" width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15.9358" cy="15" r="14.5" stroke="#2A2C2E" strokeOpacity="0.4" />
                <path
                  d="M10.6465 14.6464C10.4512 14.8417 10.4512 15.1583 10.6465 15.3536L13.8284 18.5355C14.0237 18.7308 14.3403 18.7308 14.5355 18.5355C14.7308 18.3403 14.7308 18.0237 14.5355 17.8284L11.7071 15L14.5355 12.1716C14.7308 11.9763 14.7308 11.6597 14.5355 11.4645C14.3403 11.2692 14.0237 11.2692 13.8284 11.4645L10.6465 14.6464ZM20.1743 14.5L11 14.5V15.5L20.1743 15.5V14.5Z"
                  fill="#2A2C2E"
                  fillOpacity="0.4"
                />
              </svg>
            </i>
          </div>
          <h4>{profile.firstName} {profile.lastName}</h4>
          <h4>
            {utils.toCurrency(wallet.availableBalance)}
          </h4>
          <Row className="pt-3 w-80">
            <Col>
              <Button className="form-control" as={Link} to="/deposit" variant="success">
                Deposit
              </Button>
            </Col>
            <Col>
              <Button className="form-control" as={Link} to="/withdraw" variant="danger">
                Withdraw
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <NavButton image="/images/icons/dashboard.svg" name="Dashboard" link="/dashboard" />
            <NavButton image="/images/icons/wallet.svg" name="Transactions" link="/transactions" />
          </Row>
          <Row>
            <NavButton image="/images/icons/sport.svg" name="Sports" link="/sports-predictions" />
            <NavButton image="/images/icons/bingo.svg" name="Lottery" link="/lottery-predictions" />
          </Row>
          <Row>
            <NavButton image="/images/icons/predict.svg" name="Predictions" link="/predictions" />
            <NavButton image="/images/icons/ticket.svg" name="Promotions" link="/promotions" />
          </Row>
          <Row>
            <NavButton image="/images/icons/settings.svg" name="Settings" link="/settings" />
            <Col onClick={logoutUser} className="nav-btn none" style={{ paddingTop: 10, paddingLeft: 2, paddingRight: 2 }}>
              <img className="pb-1" src="/images/icons/power-button.svg" style={{ maxWidth: "30px" }} />
              <p style={{ fontSize: 12 }}>Logout</p>
            </Col>
          </Row>
        </div>
      </div>
      <div id="sidebar-wrapper-min" style={{ marginRight: "0px" }}>
        <div
          style={{
            // width: "75px",
            backgroundColor: "#fff",
            // height: "100vh",
            // position: "fixed",
            top: 75,
            left: 5,
            textAlign: "center",
            padding: 5,
            paddingTop: 20,
            borderRadius: 10,
          }}
        >
          <i onClick={toggleSideNav}>
            <svg
              id="side-nav-arrow"
              width="31"
              height="30"
              viewBox="0 0 31 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              transform='rotate(180)'
            >
              <circle cx="15.9358" cy="15" r="14.5" stroke="#2A2C2E" strokeOpacity="0.4" />
              <path
                d="M10.6465 14.6464C10.4512 14.8417 10.4512 15.1583 10.6465 15.3536L13.8284 18.5355C14.0237 18.7308 14.3403 18.7308 14.5355 18.5355C14.7308 18.3403 14.7308 18.0237 14.5355 17.8284L11.7071 15L14.5355 12.1716C14.7308 11.9763 14.7308 11.6597 14.5355 11.4645C14.3403 11.2692 14.0237 11.2692 13.8284 11.4645L10.6465 14.6464ZM20.1743 14.5L11 14.5V15.5L20.1743 15.5V14.5Z"
                fill="#2A2C2E"
                fillOpacity="0.4"
              />
            </svg>
          </i>
          <Row>
            <NavButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              image="/images/icons/dashboard.svg"
              name=""
              link="/dashboard"
            />
          </Row>
          <Row>
            <NavButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              image="/images/icons/wallet.svg"
              name=""
              link="/transactions"
            />
          </Row>
          <Row>
            <NavButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              image="/images/icons/sport.svg"
              name=""
              link="/sports-predictions"
            />
          </Row>
          <Row>
            <NavButton
              // whileHover={{ scale: 1.1 }}
              // whileTap={{ scale: 0.9 }}
              image="/images/icons/bingo.svg"
              name=""
              link="/lottery-predictions"
            />
          </Row>
          <Row>
            <NavButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              image="/images/icons/predict.svg"
              name=""
              link="/predictions"
            />
          </Row>
          <Row>
            <NavButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              image="/images/icons/ticket.svg"
              name=""
              link="/promotions"
            />
          </Row>
          <Row>
            <NavButton image="/images/icons/settings.svg" name="" link="/settings" />
          </Row>
          <Row>
            <Col
              onClick={logoutUser}
              className="nav-btn none"
              style={{ paddingTop: 10, paddingLeft: 2, paddingRight: 2 }}
            >
              <img className="pb-1" src="/images/icons/power-button.svg" style={{ maxWidth: "30px" }} />
              <p style={{ fontSize: 12 }}>Logout</p>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default SideNav;
