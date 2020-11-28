import React, { useState, useEffect } from "react";
import { Badge, Button, Col, Form, FormGroup, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DataTable from "../../components/DataTable";
import { verifyPagaPhoneNumber, registerAdminApi } from "../../services/auth";

import { getAllUsers } from "../../services/users";

const Users = ({ setShowModal, setModalMessage, setModalType }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showExchanger, setShowExchanger] = useState(false);
  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [users, setUsers] = useState([]);
  const [exchangers, setExchangers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [exchangerData, setExchangerData] = useState({});

  const DATE_MINUS_WEEK = new Date();
  DATE_MINUS_WEEK.setDate(DATE_MINUS_WEEK.getDate() - 7);

  useEffect(() => {
    const txn = async () => {
      await _getUsers();
    };
    txn();
  }, []);

  const _getUsers = async () => {
    const response = await getAllUsers();
    if (response.code === 0) {
      const users = response.data.filter((user) => user.userType === "USER");
      const exchangers = response.data.filter((user) => user.userType === "EXCHANGER");
      const admins = response.data.filter((user) => user.userType === "ADMIN");
      setAllUsers(response.data);
      setUsers(users);
      setExchangers(exchangers);
      setAdmins(admins);
    } else {
      // throw error
    }
  };

  const _createAdmin = async ({ firstName, lastName, email, username }) => {
    
    setLoader(true)
    // call an endpoint to create an admin eith the above params
    const response = await registerAdminApi({ firstName, lastName, email, username });
    if(response.code === 0) {
      setShowModal(true);
      setModalMessage(response.message);
      setModalType("SUCCESS");
      setShowAdmin(false)
    } else {
      setLoader(false)
      setShowModal(true);
      setModalMessage(response.message);
      setModalType("FAILURE");
    }
    setLoader(false)
    // Password is autogenerated
    // firstLogin flag set to true
    // Email is sent user email
    // User logs in with generated password and is prompted to change password
    //
  };

  const _verifyPhone = async () => {
    if (phone.trim().length === 0) {
      setShowModal(true);
      setModalMessage("Phone number cannot be empty");
      setModalType("FAILED");
      return;
    }
    setLoader(true);
    const response = await verifyPagaPhoneNumber(phone);

    if (response.code === 0) {
      setExchangerData(response.data);
    } else {
      // throw error
      setShowModal(true);
      setModalMessage(response.message);
      setModalType("FAILED");
    }
    setLoader(false);
  };

  const _createExchanger = async ({ firstName, lastName, email, username, pagaAccountNumber }) => {
    console.log(firstName);
    alert("not implemented: " + firstName + " " + lastName + " " + email + " " + username);
    // call an endpoint to create an exhanger with the above params
    // Password is autogenerated
    // firstLogin flag set to true
    // Email is sent user email
    // User logs in with generated password and is prompted to change password
    //
  };

  const { register: registerAdmin, errors: errorsAdmin, handleSubmit: handleSubmitAdmin } = useForm({
    mode: "onBlur",
  });
  const { register: registerExchanger, errors: errorsExchanger, handleSubmit: handleSubmitExchanger } = useForm({
    mode: "onBlur",
  });

  const tableHeadUsers = [
    { title: "First Name", key: "firstName" },
    { title: "Last Name", key: "lastName" },
    { title: "Username", key: "username" },
    { title: "Email", key: "email" },
    { title: "Paga Account", key: "accountNumber" },
    { title: "2FA Enabled", key: "is2FA" },
    { title: "Active", key: "isActive" },
    { title: "Phone", key: "phoneNumber" },
    { title: "Stats", key: "predictionStats" },
    { title: "Referrals", key: "referrals" },
    { title: "Actions", key: "_id" },
  ];

  const userDataProcess = {
    isActive: (data) => (data ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No</Badge>),
    predictionStats: (data) => `Successful: ${data.successful} | failed: ${data.failed}`,
    referrals: (data) => data.length,
    accountNumber: (data) => (data === undefined ? "N/A" : data),
    is2FA: (data) =>
      data !== undefined ? data ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No</Badge> : "---",
    _id: (data) => {
      const user = allUsers.find((user) => user._id === data);
      return (
        <>
          {/* <Button variant="dark" onClick={() => handleShow(user)} className="mx-1" size="sm">
            Details
          </Button> */}
          <Button
            onClick={() => alert("Not Implemented")}
            className="mx-1"
            size="sm"
            variant={user.isActive ? "danger" : "success"}
          >
            {user.isActive ? "Disable" : "Enable"}
          </Button>
        </>
      );
    },
  };

  return (
    <>
      <h3 className="pb-3">Users</h3>
      <Row className="pb-4" style={{ justifyContent: "flex-end" }}>
        <Button onClick={() => setShowExchanger(true)} className="mx-1">
          Add New Exchanger
        </Button>
        <Button onClick={() => setShowAdmin(true)} className="mx-1" variant="dark">
          Add New Admin
        </Button>
      </Row>
      <Row>
        <Col className="c-card">
          <Tabs defaultActiveKey="users" id="uncontrolled-tab-example">
            <Tab eventKey="users" title="Users">
              <DataTable tableHead={tableHeadUsers} data={users} dataProcess={userDataProcess} />
            </Tab>
            <Tab eventKey="exchangers" title="Exchangers">
              <DataTable tableHead={tableHeadUsers} data={exchangers} dataProcess={userDataProcess} />
            </Tab>
            <Tab eventKey="admins" title="Admins">
              <DataTable tableHead={tableHeadUsers} data={admins} dataProcess={userDataProcess} />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* MODAL SECTION */}

      <Modal show={showAdmin} onHide={() => setShowAdmin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Admin</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitAdmin(_createAdmin)}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control name="firstName" type="text" ref={registerAdmin({ required: true })} />
                  {errorsAdmin.firstName && errorsAdmin.firstName.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control name="lastName" type="text" ref={registerAdmin({ required: true })} />
                  {errorsAdmin.lastName && errorsAdmin.lastName.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" type="email" ref={registerAdmin({ required: true })} />
                  {errorsAdmin.email && errorsAdmin.email.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control name="username" type="text" ref={registerAdmin({ required: true })} />
                  {errorsAdmin.username && errorsAdmin.username.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdmin(false)}>
              Close
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showExchanger} onHide={() => setShowExchanger(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Exchanger</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitExchanger(_createExchanger)}>
          {exchangerData.credential === undefined ? (
            <Modal.Body>
              <Row>
                <Col>
                  <FormGroup>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control onChange={(e) => setPhone(e.target.value)} name="phone" required />
                  </FormGroup>
                  <Button onClick={_verifyPhone}>
                    {loader ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Verify Phone"}
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          ) : (
            <>
              <Modal.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control name="email" type="email" ref={registerExchanger({ required: true })} />
                      {errorsExchanger.email && errorsExchanger.email.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control name="username" type="text" ref={registerExchanger({ required: true })} />
                      {errorsExchanger.username && errorsExchanger.username.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        disabled
                        value={exchangerData.firstName}
                        name="firstName"
                        type="text"
                        ref={registerExchanger({ required: true })}
                      />
                      {errorsExchanger.firstName && errorsExchanger.firstName.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        disabled
                        value={exchangerData.lastName}
                        name="lastName"
                        type="text"
                        ref={registerExchanger({ required: true })}
                      />
                      {errorsExchanger.lastName && errorsExchanger.lastName.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Paga Account Number</Form.Label>
                      <Form.Control
                        disabled
                        value={exchangerData.pagaAccountNumber}
                        name="pagaAccountNumber"
                        type="text"
                        ref={registerExchanger({ required: true })}
                      />
                      {errorsExchanger.pagaAccountNumber && errorsExchanger.pagaAccountNumber.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowExchanger(false)}>
                  Close
                </Button>
                <Button type="submit">{loader ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Submit"}</Button>
              </Modal.Footer>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Users;