import React from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import utils from "../../utils";
import {
  initiateWithdraw as initiateWithdrawApi,
  addDepositTxnId as addWithdrawTxnId,
} from "../../services/transactions";

const Withdraw = ({ setShowModal, setModalMessage, setModalType }) => {

  const [initiateWithdrawLoader, setInitiateWithdrawLoader] = useState(false);
  const [amount, setAmount] = useState(0);
  const [transactionId, setTransactionId] = useState();
  const [displayTransferModal, setDisplayTransferModal] = useState(false);
  const [exchanger, setExchanger] = useState({});
  const [transaction, setTransaction] = useState({});
  const [additionalInfo, setAdditionalInfo] = useState({});
  const withdrawalFee = 100;

  const initiateWithdraw = async () => {
    setInitiateWithdrawLoader(true);
    // Make Api Call Here
    const response = await initiateWithdrawApi(amount);
    if(parseInt(amount) < 100) {
      setShowModal(true);
      setModalMessage(`Minimum withdrawal amount is ${utils.toCurrency(100)}`);
      setModalType("FAILED");
      return;
    }
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
    setInitiateWithdrawLoader(false);
  };

  const addTransactionId = async () => {
    setInitiateWithdrawLoader(true);
    const response = await addWithdrawTxnId(
      additionalInfo,
      transactionId,
      transaction.referenceNumber
    );
    if (response.code === 0) {
      setTransaction(response.data);
    } else {
      // display modal error
    }
    setInitiateWithdrawLoader(false);
  };

  const renderTransferModal = () => {
    return displayTransferModal ? (
      <Row className="mb-4">
        <Col lg={12}>
          <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
            <h4 className="text-muted p-4">Transfer</h4>
            <Form className="px-4">
              <p>
                A Withdrawal request for <b>{utils.toCurrency(transaction.amount)}</b> has been initiated. The following phone number will credit your paga wallet within the next 24 hours.
              </p>
    <p>A charge of {utils.toCurrency(withdrawalFee)} will be deducted from your account.</p>
    <p>
      <b>Withdrawal Amount:</b> {utils.toCurrency(parseInt(transaction.amount) - 100)}<br />
      <b>Withdrawal Charge:</b> {utils.toCurrency(withdrawalFee)}<br />
      <b>Total Transfer:</b> {utils.toCurrency(parseInt(transaction.amount))}<br />
      </p>
              <p>
                An email will be sent notifying you of the completed transaction
              </p>
              <Row>
                <Col>
                  <p>Paga Phone Number</p>
                  <h3 className="text-muted">{exchanger.phoneNumber}</h3>
                  <p>Name: {`${exchanger.firstName} ${exchanger.lastName}`}</p>
                </Col>
              </Row>
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
                  <h4 className="text-muted p-4">Withdraw</h4>
                  <Form className="px-4" action="#">
                    <Form.Group controlId="amount">
                      <Form.Label>Amount to Withdraw</Form.Label>
                      <Form.Control
                        name="amount"
                        type="number"
                        min="100"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="success"
                      type=""
                      size=""
                      disabled={initiateWithdrawLoader || (transaction.updateDate && transaction.createDate !== transaction.updateDate)}
                      className="form-control mb-2 mt-1"
                      onClick={initiateWithdraw}
                    >
                      {initiateWithdrawLoader ? (
                        <i className="fa fa-circle-o-notch fa-spin"></i>
                      ) : (
                        "Initiate Withdraw"
                      )}
                    </Button>
                  </Form>
                </div>
              </Col>
              {renderTransferModal()}
            </Col>

            {/* <Col lg={6}>
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">Withdraw History</h4>
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

export default Withdraw;
