import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import { userLogin2FA } from "../../../services/auth";

import "../style.css";
import { useSelector, useDispatch } from "react-redux";
import { selectWallet, updateUserStateFromApi } from "../../../redux/reducers/userReducer";

const TwoFactorAuthentication = (props) => {
  const wallet = useSelector(selectWallet);
  const dispatch = useDispatch()
  const key = props.location.search.replace("?key=", "")

  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");

  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();

  const loginUser = async ({ twoFactorCode }) => {
    // Loading bar
    console.log("JJJJJ")
    setUserSubmitLoading(true);
    const response = await userLogin2FA(key, twoFactorCode);
    if (response.code === 0) {
      // save token and redirect
      sessionStorage.setItem("accessToken", response.data.accessToken);
      sessionStorage.setItem("rToken", response.data.refreshToken);
      setUserSubmitLoading(false);
      dispatch(updateUserStateFromApi());
      history.push("/dashboard");
    } else {
      // display error message
      setErrorAlert(response.description);
    }
    setUserSubmitLoading(false);
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

  return (
    <>
      <Container style={{ backgroundColor: "#FFD615", height: "93vh" }} fluid>
        <Row style={{ height: "100%" }}>
          <Col
            md={6}
            className="d-none d-md-block"
            style={{ backgroundImage: `url(${require("../../../assets/images/man.jpg")})`, backgroundSize: "cover", backgroundPosition: "center" }}
          ></Col>
          <Col md={6} style={{ display: "flex", alignItems: "center", backgroundColor: "#FFFFFF" }}>
            <Col sm={{ span: 8, offset: 2 }} className="login-bar">
              <div>{renderError(errorAlert)}</div>
                  <Form onSubmit={handleSubmit(loginUser)}>
                    <Form.Group controlId="twoFactorCode" className="pt-4">
                      <Form.Label>Two-Factor Authentication Code</Form.Label>
                      <Form.Control name="twoFactorCode" type="number" ref={register({ required: true })} />
                      {errors.twoFactorCode && errors.twoFactorCode.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group>
                    <Button variant="primary" type="submit" size="" className="form-control mb-4 mt-1">
                      {userSubmitLoading ? "Loading" : "Submit"}
                    </Button>
                    <p className="text-center" style={{ fontSize: "0.9em" }}>
                      Not a member? <span style={{ color: "#F80241" }}>Create an account</span>
                    </p>
                  </Form>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TwoFactorAuthentication;
