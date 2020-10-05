import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Tabs, Tab, Form, Button, Toast } from "react-bootstrap";
import { userRegisteration } from "../../../services/auth";

import "../style.css";

const Register = (props) => {
  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();
  const { register: registerExchanger, handleSubmit: handleSubmitExchanger, errors: errorsExchanger } = useForm();

  const registerUser = async ({ firstName, lastName, email, password, phone, referralCode }) => {
    setUserSubmitLoading(true);
    const response = await userRegisteration(firstName, lastName, email, password, phone, referralCode);
    console.log(response);
    if (response.code == 0) {
      // show modal for 3 seconds and redirect page
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
      setUserSubmitLoading(false);
      history.push("/dashboard");
    } else {
      // display error message
      setUserErrorMessage(response.message);
      setErrorAlert(response.message);
    }
    setUserSubmitLoading(false);
  };

  const handleExchangerReg = async (body) => {
    setUserSubmitLoading(true);
    console.log(body);
  };

  const renderError = (userErrorMessage) => {
    if (userErrorMessage !== "") {
      return (
        <Toast onClose={() => setUserErrorMessage(userErrorMessage)} show={!userErrorMessage == ""} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Registration Error</strong>
          </Toast.Header>
          <Toast.Body>{userErrorMessage}</Toast.Body>
        </Toast>
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
              <div>{renderError(errorAlert)}</div>
              <Tabs defaultActiveKey="user" id="user">
                <Tab eventKey="user" title="Register as User">
                  <p className="pt-2">
                    <small className="text-muted">
                      <i className="fa fa-info-circle"></i> Ensure you use your valid first name and last name as this will be used to verify deposits and
                      withdrawals
                    </small>
                  </p>
                  <Form onSubmit={handleSubmit(registerUser)}>
                    <Row>
                      <Col lg="6">
                        <Form.Group controlId="firstName" className="">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control name="firstName" type="text" ref={register({ required: true })} />
                          {errors.firstName && errors.firstName.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group controlId="lastName">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control name="lastName" type="text" ref={register({ required: true })} />
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
                        <Form.Group controlId="phone">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control name="phone" type="text" ref={register({ required: true })} />
                          {errors.phone && errors.phone.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                        </Form.Group>
                      </Col>
                      <Col lg="6">
                        <Form.Group controlId="refferalCode">
                          <Form.Label>Referral Code</Form.Label>
                          <Form.Control name="refferalCode" type="text" ref={register()} />
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* {userErrorMessage !== "" ? <p className="text-center text-danger" style={{ fontWeight: 600 }}>{userErrorMessage}</p> : null} */}
                    <Button variant="primary" type="submit" disabled={userSubmitLoading} size="" className="form-control mb-4 mt-1">
                      {userSubmitLoading ? "Loading" : "Submit"}
                    </Button>
                  </Form>
                  <p className="text-center" style={{ fontSize: "0.9em" }}>
                    Already have an account?{" "}
                    <Link to="/login">
                      <span style={{ color: "#F80241" }}>Please Sign In</span>
                    </Link>
                  </p>
                </Tab>

                <Tab eventKey="exchanger" title="Register as Exchanger">
                  <Form onSubmit={handleSubmitExchanger(handleExchangerReg)}>
                    <Row className="pt-4">
                      <Col md={6}>
                        <Form.Group controlId="exchangerfirstname">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control type="text" name="firstName" ref={registerExchanger({ required: true })} />
                          {errorsExchanger.firstName && errorsExchanger.firstName.type === "required" && (
                            <Form.Text className="text-danger">This field is required</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exchangerlastname">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control type="text" name="lastName" ref={registerExchanger({ required: true })} />
                          {errorsExchanger.lastName && errorsExchanger.lastName.type === "required" && (
                            <Form.Text className="text-danger">This field is required</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group controlId="exchangerEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" ref={registerExchanger({ required: true })} />
                      {errorsExchanger.email && errorsExchanger.email.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="exchangerPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" name="password" ref={registerExchanger({ required: true })} />
                      {errorsExchanger.password && errorsExchanger.password.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="exchangerphone">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control type="text" name="phone" ref={registerExchanger({ required: true })} />
                          {errorsExchanger.phone && errorsExchanger.phone.type === "required" && (
                            <Form.Text className="text-danger">This field is required</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="exchangercode">
                          <Form.Label>Referral Code</Form.Label>
                          <Form.Control type="text" name="code" ref={registerExchanger({ required: true })} />
                          {errorsExchanger.code && errorsExchanger.code.type === "required" && (
                            <Form.Text className="text-danger">This field is required</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit" disabled={userSubmitLoading} className="form-control mb-4 mt-1">
                      {userSubmitLoading ? "Loading" : "Submit"}
                    </Button>
                  </Form>
                  <p className="text-center" style={{ fontSize: "0.9em" }}>
                    Already have an account?{" "}
                    <Link to="/login">
                      <span style={{ color: "#F80241" }}>Please Sign In</span>
                    </Link>
                  </p>
                </Tab>
              </Tabs>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
