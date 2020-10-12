import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Tabs, Tab, Form, Button, Toast } from "react-bootstrap";
import { userLogin } from "../../../services/auth";

import "../style.css";
import { useSelector, useDispatch } from "react-redux";
import { selectWallet, updateUserStateFromApi } from "../../../redux/reducers/userReducer";

const Auth = () => {
  const wallet = useSelector(selectWallet);
  const dispatch = useDispatch();

  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [exchangerEmail, setExchangerEmail] = useState("");
  const [exchangerPassword, setExchangerPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();

  const loginUser = async ({ userEmail, userPassword }) => {
    // Loading bar
    setUserSubmitLoading(true);
    const response = await userLogin(userEmail, userPassword);
    if (response.code === 0) {
      // save token and redirect
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
      setUserSubmitLoading(false);
      dispatch(updateUserStateFromApi());
      history.push("/dashboard");
    } else if (response.code === 2) {
      history.push("/2fa?key=" + response.data.code);
    } else {
      // display error message
      setErrorAlert(response.message);
    }
    setUserSubmitLoading(false);
  };

  const renderUserSubmit = () => (userSubmitLoading ? "Loading" : "Submit");

  const loginExchanger = async () => {
    const response = await userLogin(exchangerEmail, exchangerPassword);
    if (response.code === 0) {
      // save token and redirect
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
    } else {
      // display error message
      setErrorAlert(response.message);
    }
  };

  const renderError = (errorAlert) => {
    if (errorAlert !== "") {
      return (
        <Toast onClose={() => setErrorAlert(errorAlert)} show={!errorAlert === ""} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{errorAlert}</Toast.Body>
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
            md={6}
            className="d-none d-md-block"
            style={{ backgroundImage: `url(${require("../../../assets/images/logo.png")})`, backgroundSize: "cover", backgroundPosition: "center" }}
          ></Col>
          <Col md={6} style={{ display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
            <Col sm={{ span: 8, offset: 2 }} className="login-bar">
              <div>{renderError(errorAlert)}</div>
              <Tabs defaultActiveKey="user" id="user">
                <Tab eventKey="user" title="Login as User">
                  {errorAlert ? <p className="text-danger">{errorAlert}</p> : null}
                  <Form onSubmit={handleSubmit(loginUser)}>
                    <Form.Group controlId="userEmail" className="pt-4">
                      <Form.Label>Email</Form.Label>
                      <Form.Control name="userEmail" type="email" ref={register({ required: true, pattern: emailRegex })} />
                      {errors.userEmail && errors.userEmail.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                      {errors.userEmail && errors.userEmail.type === "pattern" && <Form.Text className="text-danger">Please enter a valid email</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="userPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control name="userPassword" type="password" ref={register({ required: true })} />
                      {errors.userPassword && errors.userPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                      {/* {errors.userPassword && errors.userPassword.type === "pattern" && <Form.Text className="text-danger">Password must be alphanumeric</Form.Text>}
                      {errors.userPassword && errors.userPassword.type === "minLength" && (
                        <Form.Text className="text-danger">Password must be at least 6 characters</Form.Text>
                      )} */}
                    </Form.Group>
                    <p className="sm pt-1" style={{ fontSize: "0.8em", color: "#1E2A78" }}>
                      Forgot Password?
                    </p>
                    <Button variant="primary" type="submit" size="" className="form-control mb-4 mt-1">
                      {userSubmitLoading ? "Loading" : "Submit"}
                    </Button>
                    <p className="text-center" style={{ fontSize: "0.9em" }}>
                      Not a member?<Link to="/register"><span style={{ color: "#F80241" }}>Create an account</span></Link> 
                    </p>
                  </Form>
                </Tab>

                <Tab eventKey="exchanger" title="Login as Exchanger">
                  <Form.Group controlId="exchangerEmail" className="pt-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="exchangerEmail" type="email" onChange={(e) => setExchangerEmail(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="exchangerPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="exchangerPassword" type="password" onChange={(e) => setExchangerPassword(e.target.value)} />
                  </Form.Group>
                  <p className="sm pt-1" style={{ fontSize: "0.8em", color: "#1E2A78" }}>
                    Forgot Password?
                  </p>
                  <Button variant="primary" type="submit" className="form-control mb-4 mt-1" onClick={(e) => loginExchanger(e)}>
                    Submit
                  </Button>
                  <p className="text-center" style={{ fontSize: "0.9em" }}>
                    Becaome an exchanger? <span style={{ color: "#F80241" }}>Create an account</span>
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

export default Auth;
