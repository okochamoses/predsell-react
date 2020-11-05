import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Tabs, Tab, Form, Button, Toast, Modal } from "react-bootstrap";
import { userRegisteration, verifyPagaPhoneNumber } from "../../../services/auth";

import "../style.css";

const Register = (props) => {
  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState(false);
  const [userData, setUserData] = useState({});
  const [completeModal, setCompleteModal] = useState(false);

  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const { register: registerPagaPhone, handleSubmit: handleSubmitPagaPhone, errors: errorsPagaPhone } = useForm();

  const verifyPagaPhone = async({pagaPhone}) => {
    setUserSubmitLoading(true);
    const response = await verifyPagaPhoneNumber(pagaPhone);
    if (response.code === 0) {
      setUserData(response.data);
      setVerifiedPhoneNumber(true);
      setErrorAlert(" ");
    } else {
      // display modal error
      setErrorAlert(response.message);
    }
    setUserSubmitLoading(false);
  }

  const registerUser = async ({ firstName, lastName, email, password, phone, referralCode, username, pagaAccountNumber }) => {
    setUserSubmitLoading(true);
    const response = await userRegisteration(firstName, lastName, email, password, phone, referralCode, username, pagaAccountNumber);
    console.log(response);
    if (response.code == 0) {
      // show modal for 3 seconds and redirect page
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
      setUserSubmitLoading(false);
      setCompleteModal(true)
    } else {
      // display error message
      setUserErrorMessage(response.message);
    }
    setUserSubmitLoading(false);
  };

  const _toDashboard = () => {
    // Close modal
    setCompleteModal(false)
    history.push("/dashboard");
  }

  const handleExchangerReg = async (body) => {
    setUserSubmitLoading(true);
    console.log(body);
  };

  const renderError = (userErrorMessage) => {
    if (userErrorMessage !== "") {
      return (
        <Form.Text className="text-danger">{userErrorMessage}</Form.Text>
      );
    }
  };

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegex = "/^(?=.*[0-9])(?=.*[a-z][A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|])$/";

  return (
    <>
      <Container style={{ backgroundColor: "#FFD615", height: "93vh" }} fluid>
        <Row style={{ height: "100%" }}>
          <Col
            sm={0}
            md={0}
            lg={6}
            className="d-none d-md-block"
            style={{ backgroundImage: `url(${require("../../../assets/images/girl.jpg")})`, backgroundSize: "cover", backgroundPosition: "center" }}
          ></Col>
          <Col md={12} lg={6} style={{ display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
            <Col sm={{ span: 8, offset: 2 }} className="login-bar">
                  <h3 className="text-center">Register</h3>
                  {
                    verifiedPhoneNumber ? 
                  (
                  <>
                  <Form onSubmit={handleSubmit(registerUser)}>
                    <Row>
                      <Col lg="6">
                        <Form.Group controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control name="phone" type="text" disabled value={userData.credential} ref={register({ required: true })} />
                          {errors.phone && errors.phone.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group controlId="pagaAccount">
                          <Form.Label>Paga Account Number</Form.Label>
                          <Form.Control name="pagaAccountNumber" type="text" disabled value={userData.pagaAccountNumber} ref={register({ required: true })} />
                          {errors.pagaAccountNumber && errors.pagaAccountNumber.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <Form.Group controlId="firstName" className="">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control name="firstName" type="text" disabled value={userData.firstName} ref={register({ required: true })} />
                          {errors.firstName && errors.firstName.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group controlId="lastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control name="lastName" type="text" disabled value={userData.lastName} ref={register({ required: true })} />
                          {errors.lastName && errors.lastName.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control name="email" type="email" ref={register({ required: true, pattern: emailRegex })} />
                      {errors.email && errors.email.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                      {errors.email && errors.email.type === "pattern" && <Form.Text className="text-danger">Please enter a valid email</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control name="password" type="password" ref={register({ required: true, minLength: 6, pattern: passwordRegex })} />
                      {errors.userPassword && errors.userPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                      {errors.password && errors.password.type === "minLength" && (
                        <Form.Text className="text-danger">Please enter a minimum of 6 characters</Form.Text>
                      )}
                      {errors.userPassword && errors.userPassword.type === "pattern" && (
                        <Form.Text className="text-danger">Password must be alphanumeric</Form.Text>
                      )}
                      {errors.userPassword && errors.userPassword.type === "minLength" && (
                        <Form.Text className="text-danger">Password must be at least 6 characters</Form.Text>
                      )}
                    </Form.Group>
                    <Row>
                      <Col lg="6">
                        <Form.Group controlId="username">
                          <Form.Label>Username</Form.Label>
                          <Form.Control name="username" type="text" ref={register()} />
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group controlId="refferalCode">
                          <Form.Label>Referral Code</Form.Label>
                          <Form.Control name="refferalCode" type="text" ref={register()} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div>{renderError(userErrorMessage)}</div>
                    {/* {userErrorMessage !== "" ? <p className="text-center text-danger" style={{ fontWeight: 600 }}>{userErrorMessage}</p> : null} */}
                    <Button variant="primary" type="submit" disabled={userSubmitLoading} size="" className="form-control mt-1">
                      {userSubmitLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Submit"}
                    </Button>


                    <Button variant="dark" type="button" disabled={userSubmitLoading} size="" className="form-control mb-4 mt-1" onClick={() => setVerifiedPhoneNumber(false)}>
                        {userSubmitLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Go Back"}
                      </Button>
                  </Form></>) : 
(
                  <>
                    <p className="pt-2">
                      <span className="">
                        <i className="fa fa-info-circle"></i> <b>Enter a valid paga phone number to continue</b>
                      </span>
                    </p>
                    <Form onSubmit={handleSubmitPagaPhone(verifyPagaPhone)}>
                    <Form.Group controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control name="pagaPhone" type="text" ref={registerPagaPhone({ required: true })} />
                      <div>{renderError(errorAlert)}</div>
                      {errorsPagaPhone.pagaPhone && errorsPagaPhone.pagaPhone.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group>
                      <Button variant="primary" type="submit" disabled={userSubmitLoading} size="" className="form-control mb-4 mt-1">
                        {userSubmitLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Verify Phone Number"}
                      </Button>
                    </Form>
                  </>
)}
                  <p className="text-center" style={{ fontSize: "0.9em" }}>
                    Already have an account?{" "}
                    <Link to="/login">
                      <span style={{ color: "#F80241" }}>Please Sign In</span>
                    </Link>
                  </p>
            </Col>
          </Col>
        </Row>
        <Modal 
          show={completeModal}
          onHide={() => setCompleteModal(false)}
          backdrop="static"
          keyboard={false}
          centered
        >

          <Modal.Body className="text-center">
            <p className="p-3">Your registration was successful.</p>
            <Button className="mb-3" onClick={_toDashboard}>Proceed to dashboard</Button>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Register;
