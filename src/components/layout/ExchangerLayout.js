import React, { useState } from "react";
import Header from "../Header.js/exchangerHeader";
import "../SideNav/styles.css";
import { Button, Modal } from "react-bootstrap";
import Footer from "../Footer";
import { useSelector } from "react-redux";

import { selectWallet } from "../../redux/reducers/userReducer";
import utils from "../../utils";

const UserLayout = (props) => {
  const wallet = useSelector(selectWallet);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const handleClose = () => setShowModal(false);
  return (
    <>
      <Header
        balance={utils.toCurrency(wallet.availableBalance)}
      />
      <div className=""
        style={{
          backgroundImage: `url("./images/bg-sm-trans.jpg")`,
          backgroundColor: "#f4f4f4",
        }}
      >
        {React.cloneElement(props.children, {
          setShowModal,
          setModalMessage,
          setModalType,
        })}
      </div>
      <Footer />

      <Modal
        show={showModal}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="text-center">
          <i
            className={`material-icons text-${
              modalType === "SUCCESS" ? "success" : "danger"
            } md-48`}
            style={{ fontSize: "64px" }}
          >
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
