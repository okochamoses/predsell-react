import React, { useState } from "react";
import Header from "../Header.js/userHeader";
import "../SideNav/styles.css";
import SideNav from "../SideNav";
import { Button, Modal } from "react-bootstrap";
import Footer from "../Footer";

// const BG_IMAGE = require("../../assets/images/bg-sm-trans.png");

const UserLayout = (props) => {
  const [toggled, setToggled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const toggle = () => {
    setToggled(!toggled);
  };
  const handleClose = () => setShowModal(false);
  return (
    <>
      <Header />
      <div className={`d-flex ${toggled ? "toggled" : ""}`} id="wrapper" style={{
        backgroundImage: `url("./images/bg-sm-trans.jpg")`,
        backgroundColor: "#f4f4f4"
        }}>
        <SideNav toggleSideNav={toggle} />
        <div id="page-content-wrapper">
          {/* <Row className="p-4">
            <Col>
              <span class="material-icons" onClick={toggle}>keyboard_arrow_left</span>
            </Col>
            <Col>
              <span class="material-icons float-right text-danger pl-4">power_settings_new</span>
              <span class="material-icons float-right text-danger">email</span>
              <input className="mb-2 mr-sm-2 p-2 float-right" placeholder="Search" style={{width: "300px", maxWidth: "300px", border: "0px", borderRadius: "5px"}} />
            </Col>
          </Row> */}
          {React.cloneElement(props.children, { setShowModal, setModalMessage, setModalType })}
        </div>
      </div>
      <Footer />

      <Modal show={showModal} onHide={handleClose} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          <i className={`material-icons text-${modalType === "SUCCESS" ? "success" : "danger"} md-48`} style={{ fontSize: "64px" }}>
            {modalType === "SUCCESS" ? "check_circle" : "highlight_off"}
          </i>
          <h6 className="py-3">{modalMessage}</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserLayout;
