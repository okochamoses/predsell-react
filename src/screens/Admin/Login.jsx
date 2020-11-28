import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Tabs, Tab, Form, Button, Toast, Image } from "react-bootstrap";
import { userLogin } from "../../services/auth";

import { useDispatch } from "react-redux";
import { updateUserStateFromApi } from "../../redux/reducers/userReducer";

const AdminLogin = () => {
  const dispatch = useDispatch();

  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [exchangerid, setExchangerid] = useState("");
  const [exchangerPassword, setExchangerPassword] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  const loginAdmin = async ({ userid, userPassword }) => {
    // Loading bar
    setUserSubmitLoading(true);
    const response = await userLogin(userid, userPassword);
    if (response.code === 0) {
      // save token and redirect
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
      setUserSubmitLoading(false);
      dispatch(updateUserStateFromApi());
      history.push("/admin-dashboard");
    } else if (response.code === 2) {
      history.push("/2fa?key=" + response.data.code);
    } else if (response.code === 50) {
      history.push("/admin-change-password");
    } else {
      // display error message
      setErrorAlert(response.message);
    }
    setUserSubmitLoading(false);
  };

  const renderUserSubmit = () => (userSubmitLoading ? "Loading" : "Submit");

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

  return (
    <>
      <Container style={{ height: "93vh" }} fluid>
        <Row style={{ height: "100%" }}>
          <Col md={12} style={{ display: "flex", alignItems: "center" }}>
            <Col sm={{ span: 4, offset: 4 }} className="login-bar c-card">
              <div style={{ textAlign: "center" }}>
                <Image width="50" src={require("../../assets/images/logo.png")} />
                <h3 className="text-muted pt-4">LOGIN</h3>
              </div>
              <div>{renderError(errorAlert)}</div>
              {errorAlert ? <p className="text-danger">{errorAlert}</p> : null}
              <Form className="px-4" onSubmit={handleSubmit(loginAdmin)}>
                <Form.Group controlId="userid" className="pt-2">
                  <Form.Label>Login ID</Form.Label>
                  <Form.Control name="userid" type="id" ref={register({ required: true })} />
                  {errors.userid && errors.userid.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="userPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="userPassword" type="password" ref={register({ required: true })} />
                  {errors.userPassword && errors.userPassword.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
                <p className="sm pt-1" style={{ fontSize: "0.8em", color: "#1E2A78" }}>
                  Forgot Password?
                </p>
                <Button variant="primary" type="submit" size="" className="form-control mb-4 mt-1">
                  {userSubmitLoading ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Submit"}
                </Button>
              </Form>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLogin;
