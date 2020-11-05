import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { updateUser, selectProfile } from "../../redux/reducers/userReducer";
import { changePassword as changePasswordApi, toggle2fa } from "../../services/auth";

const Settings = ({ setShowModal, setModalMessage, setModalType }) => {
  const [profile] = useState(useSelector(selectProfile));
  const dispatch = useDispatch();

  // FORMS
  const [changePasswordLoader, setChangePasswordLoader] = useState(false);
  const [toggle2faLoader, setToggle2faLoader] = useState(false);
  const [updateProfileLoader] = useState(false);
  const { register: changePassword, handleSubmit, errors, setError } = useForm();
  const { register: twoFactor, errors: errorsTwoFactor, handleSubmit: handleSubmit2fa } = useForm({
    mode: "onBlur",
  });
  const { register: profileForm, errors: errorsProfileForm, handleSubmit: handleSubmitProfileForm } = useForm({
    mode: "onBlur",
  });
  const handleChangePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    // Matching password validation
    if (newPassword !== confirmPassword) return setError("confirmPassword", { type: "manual" });

    setChangePasswordLoader(true); // loader
    const response = await changePasswordApi(oldPassword, newPassword);
    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
    setChangePasswordLoader(false);
  };

  const handle2faChange = async ({ password }) => {
    setToggle2faLoader(true);
    console.log(profile);
    const response = await toggle2fa(password);
    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
    setToggle2faLoader(false);
    dispatch(updateUser()); // update 2fa field
  };

  const updateProfile = async (body) => {
    console.log(body)
  }

  return (
    <>
      <Container fluid>
        <Row className="">
          <Col lg="6">
            <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h5>
                Change <span className="text-danger">Password</span>
              </h5>
              <Form onSubmit={handleSubmit(handleChangePassword)}>
                <Form.Text className="text-muted">Create a sports prediction on your favourite betting plaform and enter the prediction here.</Form.Text>
                <Form.Text className="text-muted pb-3">Note: You will be charged N150 for this transaction</Form.Text>

                <Form.Group className="">
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control name="oldPassword" type="password" ref={changePassword({ required: true })} />
                  {errors.oldPassword && errors.oldPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                </Form.Group>

                <Form.Group className="">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control name="newPassword" type="password" ref={changePassword({ required: true, minLength: 6 })} />
                  {errors.newPassword && errors.newPassword.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                  {errors.newPassword && errors.newPassword.type === "minLength" && (
                    <Form.Text className="text-danger">Password length must be at least 6 characters</Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    ref={changePassword({
                      required: true,
                    })}
                  />
                  {errors.confirmPassword && errors.confirmPassword.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                  {errors.confirmPassword && errors.confirmPassword.type === "manual" && <Form.Text className="text-danger">Passwords do not match</Form.Text>}
                </Form.Group>

                <Button variant="primary" type="submit" size="" disabled={changePasswordLoader} className="form-control mb-2 mt-1">
                  {changePasswordLoader ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Change password"}
                </Button>
              </Form>
            </div>
          </Col>

          <Col lg="6">
            <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h5>
                Two-Factor <span className="text-danger">Authentication</span>
              </h5>
              <Form onSubmit={handleSubmit2fa(handle2faChange)}>
                <Form.Text className="text-muted">Two-factor authentication enables you to login with your password and a code sent to your email</Form.Text>
                <Form.Text className="text-muted pb-3">Your Two-Factor Authentication status is currently {profile.is2FA ? "disabled" : "enabled"}</Form.Text>

                <Form.Group className="">
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="password" type="password" ref={twoFactor({ required: true })} />
                  {errorsTwoFactor.password && errorsTwoFactor.password.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>

                <Button variant="primary" type="submit" size="" disabled={toggle2faLoader} className="form-control mb-2 mt-1">
                  {toggle2faLoader ? <i className="fa fa-circle-o-notch fa-spin"></i> : `${profile.is2FA ? "Disable" : "Enable"} Two-Factor Authentication`}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        <Row className="">
          <Col lg="6">
            <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h5>
                User <span className="text-danger">Profile</span>
              </h5>
              <Form onSubmit={handleSubmitProfileForm(updateProfile)}>
                <Row>
                  <Col>
                    <Form.Group className="">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control name="firstName" type="text" value={profile.firstName} ref={profileForm({ required: true })} />
                      {errorsProfileForm.firstName && errorsProfileForm.firstName.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control name="lastName" type="text" value={profile.lastName} ref={profileForm({ required: true })} />
                      {errorsProfileForm.lastName && errorsProfileForm.lastName.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control name="dob" type="date" ref={profileForm({ required: true })} />
                      {errorsProfileForm.dob && errorsProfileForm.dob.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control name="phone" type="text" ref={profileForm({ required: true })} />
                      {errorsProfileForm.phone && errorsProfileForm.phone.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                </Row>
                  <Form.Group className="">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" value={profile.email} ref={profileForm({ required: true })} />
                    {errorsProfileForm.email && errorsProfileForm.email.type === "required" && (
                      <Form.Text className="text-danger">This field is required</Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control name="text" type="text" value={profile.accountNumber} disabled={profile.accountNumber} ref={profileForm({ required: true })} />
                    {errorsProfileForm.accountNumber && errorsProfileForm.accountNumber.type === "required" && (
                      <Form.Text className="text-danger">This field is required</Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="">
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" as="textarea" rows="3" value={profile.address} ref={profileForm({ required: true })} />
                    {errorsProfileForm.address && errorsProfileForm.address.type === "required" && (
                      <Form.Text className="text-danger">This field is required</Form.Text>
                    )}
                  </Form.Group>

                <Button variant="primary" type="submit" size="" disabled={toggle2faLoader} className="form-control mb-2 mt-1">
                  {updateProfileLoader ? <i className="fa fa-circle-o-notch fa-spin"></i> : `Update Profile`}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;
