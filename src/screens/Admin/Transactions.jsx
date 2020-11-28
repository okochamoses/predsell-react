import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import DataTable from "../../components/DataTable";

import { getAllTransactions, getDisputeRequests, settleDisputeRequests } from "../../services/transactions";
import utils from "../../utils";

const Dashboard = ({ setShowModal, setModalMessage, setModalType }) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [disputedTransactions, setDisputedTransactions] = useState([]);

  const DATE_MINUS_WEEK = new Date();
  DATE_MINUS_WEEK.setDate(DATE_MINUS_WEEK.getDate() - 7);

  useEffect(() => {
    const txn = async () => {
      await _getTransactions();
      await _getDisputeTransactions();
    };
    txn();
  }, []);

  const _getTransactions = async () => {
    const response = await getAllTransactions();
    if (response.code === 0) {
      setTransactions(response.data);
    } else {
      // throw error
    }
  };

  const _getDisputeTransactions = async () => {
    const response = await getDisputeRequests();
    if (response.code === 0) {
      setDisputedTransactions(response.data);
    } else {
      // throw error
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (transaction) => {
    setTransaction(transaction);
    setShow(true);
  };

  const settleDispute = async(referenceNumber, winningParty) => {
    const response = await settleDisputeRequests(referenceNumber, winningParty);
    setShowModal(true);
    setModalMessage(response.message);
    if (response.code === 0) {
      await _getTransactions();
      await _getDisputeTransactions();
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
  }

  const tableHead = [
    { title: "Initiate Date", key: "txnStartDate" },
    { title: "Complete Date", key: "txnEndDate" },
    { title: "Approval Status", key: "approvalStatus" },
    { title: "Txn Status", key: "transferStatus" },
    { title: "Reference Number", key: "referenceNumber" },
    { title: "Amount", key: "amount" },
    { title: "Sender", key: "sender" },
    { title: "Receiver", key: "receiver" },
  ];

  const disputeTableHead = [
    { title: "Initiate Date", key: "txnStartDate" },
    { title: "Approval Status", key: "approvalStatus" },
    { title: "Txn Status", key: "transferStatus" },
    { title: "Paga Txn Id", key: "pagaTxnId" },
    { title: "Reference Number", key: "referenceNumber" },
    { title: "Amount", key: "amount" },
    { title: "Sender", key: "sender" },
    { title: "Receiver", key: "receiver" },
    { title: "Action", key: "_id" },
  ];

  const dataProcess = {
    amount: (data) => utils.toCurrency(data),
    txnStartDate: (data) => utils.getCustomDate(data, "h:mm a, DD-MM-yyyy"),
    txnEndDate: (data) => (data ? utils.getCustomDate(data, "h:mm a, DD-MM-yyyy") : null),
    sender: (data) => data.firstName + " " + data.lastName,
    receiver: (data) => data.firstName + " " + data.lastName,
  };
  
  const disputeDataProcess = {
    amount: (data) => utils.toCurrency(data),
    txnStartDate: (data) => utils.getCustomDate(data, "h:mm a, DD-MM-yyyy"),
    txnEndDate: (data) => (data ? utils.getCustomDate(data, "h:mm a, DD-MM-yyyy") : null),
    _id: (data) => {
      const p = transactions.find((txn) => txn._id === data);

      return (
        <>
          <Button variant="dark" onClick={() => handleShow(p)} className="mx-1" size="sm">
            Details
          </Button>
          <Button onClick={() => settleDispute(p.referenceNumber, "SENDER")} className="mx-1" size="sm">
            Sender
          </Button>
          <Button onClick={() => settleDispute(p.referenceNumber, "RECEIVER")} variant="success" className="mx-1" size="sm">
            Receiver
          </Button>
        </>
      );
    },
    sender: (data) => data.username,
    receiver: (data) => data.username,
  };

  return (
    <>
      <h3 className="pb-3">Transactions</h3>
      <Row>
        <Col className="c-card">
          <Tabs defaultActiveKey="transactions" id="uncontrolled-tab-example">
            <Tab eventKey="transactions" title="Transactions">
              <DataTable tableHead={tableHead} data={transactions} dataProcess={dataProcess} />
            </Tab>
            <Tab eventKey="disputes" title="Disputes">
              <DataTable tableHead={disputeTableHead} data={disputedTransactions} dataProcess={disputeDataProcess} />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* MODAL SECTION */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped>
            <tbody>
              <tr>
                <td>
                  <b>Amount</b>
                </td>
                <td>{utils.toCurrency(transaction.amount ? transaction.amount : "")}</td>
              </tr>
              <tr>
                <td>
                  <b>Sender Name</b>
                </td>
                <td>{transaction.sender ? transaction.sender.firstName + " " + transaction.sender.lastName : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Sender Paga ID</b>
                </td>
                <td>{transaction.sender ? transaction.sender.accountNumber : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Sender Email</b>
                </td>
                <td>{transaction.sender ? transaction.sender.email : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Receiver Name</b>
                </td>
                <td>{transaction.receiver ? transaction.receiver.firstName + " " + transaction.receiver.lastName : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Receiver Paga ID</b>
                </td>
                <td>{transaction.receiver ? transaction.receiver.accountNumber : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Receiver Email</b>
                </td>
                <td>{transaction.receiver ? transaction.receiver.email : null}</td>
              </tr>
              <tr>
                <td>
                  <b>Narration</b>
                </td>
                <td>{transaction.narration}</td>
              </tr>
              <tr>
                <td>
                  <b>Sender Comments</b>
                </td>
                <td>{transaction.additionalDetails}</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
