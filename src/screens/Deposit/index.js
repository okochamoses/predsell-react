import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import utils from "../../utils";

const Deposit = () => {
  const successResponse = {
    code: 0,
    message: "Operation Successful",
    data: {
      credential: "07031144832",
      firstName: "Moses",
      lastName: "Okocha",
      gender: "MALE",
      dateOfBirth: null,
      kycStatus: "KYC Level ",
      pagaAccountNumber: "PA0016572690",
      errorMessage: null,
    },
  };

  const [initiateDepositLoader, setInitiateDepositLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState();
  const [displayTransferModal, setDisplayTransferModal] = useState(false);
  const [exchanger, setExchanger] = useState({});

  const initiateDeposit = async () => {
    setInitiateDepositLoader(true);
    // Make Api Call Here
    const response = successResponse;
    if (response.code === 0) {
      setExchanger(response.data);
      setDisplayTransferModal(true);
    } else {
      // display modal error
    }
    setInitiateDepositLoader(false);
  };

  const renderTransferModal = () => {
    return displayTransferModal ? (
      <Row className="mb-4">
        <Col lg={6} className="offset-md-3">
          <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
            <h4 className="text-muted p-4">Transfer</h4>
            <Form className="px-4">
              <p>
                Send the value of <b>{utils.toCurrency(amount * 100)}</b> to the
                phone number below on{" "}
                <a href="http://www.paga.com" className="text-danger">
                  Paga
                </a>{" "}
                within 30 minutes ({utils.get24hrTime(new Date())}) of initiating this transaction else the
                transaction will be cancelled automatically
              </p>
              <p>Paga Phone Number</p>
              <h3 className="text-muted">{exchanger.credential}</h3>
              <p>Name: {`${exchanger.firstName} ${exchanger.lastName}`}</p>
              <hr></hr>
              <p>Upon completion of transaction, input your transaction ID</p>
              <Form.Group controlId="transactionId">
                <Form.Label>Enter transaction ID</Form.Label>
                <Form.Control
                  name="transactionId"
                  type="text"
                  size="lg"
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="success"
                type="button"
                size=""
                disabled={initiateDepositLoader}
                className="form-control mb-2 mt-1"
              >
                {initiateDepositLoader ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  "I have sent the funds"
                )}
              </Button>

              <Button
                variant="danger"
                type="button"
                size=""
                disabled={initiateDepositLoader}
                className="form-control mb-2 mt-1"
              >
                {initiateDepositLoader ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  "Cancel Transaction"
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    ) : null;
  };

  return (
    <>
      <Container fluid>
        <div className="p-sm-4">
          {/* <h2>Dashboard</h2> */}
          <Row>
            <Col lg={6} className="offset-md-3">
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">Deposit</h4>
                <Form className="px-4" action="#">
                  <Form.Group controlId="amount">
                    <Form.Label>Amount to Deposit</Form.Label>
                    <Form.Control
                      name="amount"
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    type=""
                    size=""
                    disabled={initiateDepositLoader}
                    className="form-control mb-2 mt-1"
                    onClick={initiateDeposit}
                  >
                    {initiateDepositLoader ? (
                      <i className="fa fa-circle-o-notch fa-spin"></i>
                    ) : (
                      "Initiate Deposit"
                    )}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>

          {renderTransferModal()}
        </div>
      </Container>
    </>
  );
};

export default Deposit;
