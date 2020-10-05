import React, { useState } from "react";
import { userHeader as Header } from "../Header.js/authHeader";
import "../SideNav/styles.css";
import SideNav from "../SideNav";
import { Button, Modal } from "react-bootstrap";
import Footer from "../Footer";

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
      <div className={`d-flex ${toggled ? "toggled" : ""}`} id="wrapper">
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
          <i className="material-icons text-success md-48" style={{ fontSize: "64px" }}>
            check_circle
          </i>
          {() => {
            if (modalType === "SUCCESS") return <span className="material-icons text-success md-36">check_circle</span>;
            if (modalType === "FAILURE") return <span className="material-icons text-danger md-36">highlight_off</span>;
          }}
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
