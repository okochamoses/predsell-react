import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import utils from "../../utils";
import {
  initiateDeposit as initiateDepositApi,
  addDepositTxnId,
} from "../../services/transactions";

const Deposit = ({ setShowModal, setModalMessage, setModalType }) => {

  const [initiateDepositLoader, setInitiateDepositLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState();
  const [displayTransferModal, setDisplayTransferModal] = useState(false);
  const [exchanger, setExchanger] = useState({});
  const [transaction, setTransaction] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const predictionFee = 100;

  const initiateDeposit = async () => {
    setInitiateDepositLoader(true);
    // Make Api Call Here
    const response = await initiateDepositApi(amount);
    if (response.code === 0) {
      setExchanger(response.data.exchanger);
      setTransaction(response.data.transfer);
      setDisplayTransferModal(true);
    } else {
      // display modal error
      setShowModal(true);
      setModalMessage(response.message);
      setModalType("FAILED")
    }
    setInitiateDepositLoader(false);
  };

  const addTransactionId = async () => {
    setInitiateDepositLoader(true);
    const response = await addDepositTxnId(
      additionalInfo,
      transactionId,
      transaction.referenceNumber
    );
    if (response.code === 0) {
      setTransaction(response.data);
    } else {
      // display modal error
    }
    setInitiateDepositLoader(false);
  };

  const renderTransferModal = () => {
    return displayTransferModal ? (
      <Row className="mb-4">
        <Col lg={12}>
          <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
            <h4 className="text-muted p-4">Transfer</h4>
            <Form className="px-4">
              <p>
                Send the value of <b>{utils.toCurrency(parseInt(amount) + predictionFee)}</b> to the
                phone number below on{" "}
                <a href="http://www.paga.com" className="text-danger">
                  Paga
                </a>{" "}
                within 30 minutes (
                {utils.getCustomDate(
                  new Date(
                    new Date(transaction.txnStartDate).getTime() + 1000 * 30 * 60
                  ),
                  "h:mm a, Do MMMM, YYYY"
                )}
                ) of initiating this transaction else the transaction will be
                cancelled automatically
              </p>
              <Row>
                <Col>
                  <p>Paga Account Number</p>
                  <h3 className="text-muted">{exchanger.accountNumber}</h3>
                  <p>Name: {`${exchanger.firstName} ${exchanger.lastName}`}</p>
                  <p>Phone Number: {exchanger.phoneNumber}</p>
                </Col>
                {/* <Col>
                  <p className="text-danger">
                    Make payment before timer reaches 00:00
                  </p>
                  <h1>30:00</h1>
                </Col> */}
              </Row>
              {transaction.transferStatus === "ESCROW" ? (
                <>
                  <hr />
                  <p>
                    Upon completion of transaction, input your transaction ID
                  </p>
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
                  <Form.Group controlId="additionalInfo">
                    <Form.Label>Additional Information</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      name="transactionId"
                      type="text"
                      size="lg"
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    type="button"
                    size=""
                    disabled={initiateDepositLoader}
                    className="form-control mb-2 mt-1"
                    onClick={addTransactionId}
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
                    onClick={() => setDisplayTransferModal(false)} // TODO: Call endpoint to reverse transaction
                  >
                    {initiateDepositLoader ? (
                      <i className="fa fa-circle-o-notch fa-spin"></i>
                    ) : (
                      "Cancel Transaction"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <h3>Transaction ID: {transaction.pagaTxnId}</h3>
                  <p>
                    You can call the Exchanger to alert them of your payment
                  </p>
                </>
              )}
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
              <Col lg={12} className="p-0">
                <div className="bg-white pb-4" style={{ borderRadius: 10 }}>
                  <h4 className="text-muted p-4">Deposit</h4>
                  <Form className="px-4" action="#">
                    <Form.Group controlId="amount">
                      <Form.Label>Amount to Deposit</Form.Label>
                      <Form.Control
                        name="amount"
                        type="number"
                        disabled={displayTransferModal}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="success"
                      type=""
                      size=""
                      disabled={initiateDepositLoader || (transaction.transferStatus && transaction.transferStatus !== "COMPLETED")}
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
              {renderTransferModal()}
            </Col>

            {/* <Col lg={6}>
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">Deposit History</h4>
                <Table variant="striped">
                  <thead>
                    <th>S/N</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Txn ID</th>
                    <th>Status</th>
                    <th>Action</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>32.95</td>
                      <td>12-01-2020</td>
                      <td>YNJS789</td>
                      <td>Completed</td>
                      <td>
                        <Button size="sm">Continue</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>32.95</td>
                      <td>12-01-2020</td>
                      <td>YNJS789</td>
                      <td>Completed</td>
                      <td>
                        <Button size="sm">Continue</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>32.95</td>
                      <td>12-01-2020</td>
                      <td>YNJS789</td>
                      <td>Completed</td>
                      <td>
                        <Button size="sm">Continue</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>32.95</td>
                      <td>12-01-2020</td>
                      <td>YNJS789</td>
                      <td>Completed</td>
                      <td>
                        <Button size="sm">Continue</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>32.95</td>
                      <td>12-01-2020</td>
                      <td>YNJS789</td>
                      <td>Completed</td>
                      <td>
                        <Button size="sm">Continue</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
           */}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Deposit;
