import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import { changePassword } from "../../services/auth";

// import "../style.css";

const ChangeAdminPassword = (props) => {
  // const wallet = useSelector(selectWallet);

  const [userSubmitLoading, setUserSubmitLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState("error");

  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();

  const loginUser = async ({ oldPassword, newPassword, confirmPassword }) => {
    // Loading bar
    setUserSubmitLoading(true);
    const response = await changePassword(oldPassword, newPassword);
    if (response.code === 0) {
      // save token and redirect
      setUserSubmitLoading(false);
    } else {
      // display error message
      console.log(response.message)
      setErrorAlert(response.message);
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
      <Container style={{ height: "93vh" }} fluid>
        <Row style={{ height: "100%" }}>
          
          <Col md={12} style={{ display: "flex", alignItems: "center", }}>
            <Col sm={{ span: 4, offset: 4 }} className="login-bar">
              <div>{renderError(errorAlert)}</div>
                  <Form onSubmit={handleSubmit(loginUser)}>
                    <Form.Group controlId="twoFactorCode" className="pt-4">
                      <Form.Label>Old Password</Form.Label>
                      <Form.Control name="oldPassword" type="text" ref={register({ required: true })} />
                      {errors.oldPassword && errors.oldPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group>
                    <Form.Group controlId="twoFactorCode" className="pt-4">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control name="newPassword" type="text" ref={register({ required: true })} />
                      {errors.newPassword && errors.newPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group>
                    {/* <Form.Group controlId="twoFactorCode" className="pt-4">
                      <Form.Label>Confirm new Password</Form.Label>
                      <Form.Control name="confirmPassword" type="text" ref={register({ required: true })} />
                      {errors.confirmPassword && errors.confirmPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group> */}
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

export default ChangeAdminPassword;
