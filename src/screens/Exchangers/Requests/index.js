import React, { useEffect } from "react";
import { useState } from "react";
import {
  Badge,
  Button,
  Col,
  Image,
  Modal,
  OverlayTrigger,
  Popover,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  selectWallet,
  updateUserStateFromApi,
} from "../../../redux/reducers/userReducer";
import {
  getActiveExchangerRequests,
  processActiveExchangerRequest,
} from "../../../services/transactions";
import utils from "../../../utils";
import { getLoggedInUser } from "../../../utils/authUtils";

const renderEmpty = (
  <div className="row justify-content-md-center">
    <Col md={12} className="d-flex justify-content-md-center">
      <Image
        src="./images/empty.png"
        width="90%"
        style={{ maxWidth: "400px", padding: "80px 0px" }}
      />
    </Col>
    <Col md={12} className="d-flex justify-content-md-center">
      <h3 className="text-muted text-center">
        There are no requests right now
      </h3>
    </Col>
  </div>
);

function Exchanger({ setShowModal, setModalMessage, setModalType }) {
  const dispatch = useDispatch();
  const wallet = useSelector(selectWallet);
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState({});
  const user = getLoggedInUser();

  useEffect(() => {
    const txn = async () => {
      return await _getTransactions();
    };
    txn();
  }, []);

  const _getTransactions = async () => {
    const response = await getActiveExchangerRequests();
    if (response.code === 0) {
      setTransactions(response.data);
    } else {
      // throw error
    }
  };

  const _approveTransaction = async (referenceNumber, approve) => {
    const response = await processActiveExchangerRequest(
      referenceNumber,
      approve
    );
    if (response.code === 0) {
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
    dispatch(updateUserStateFromApi());
    setModalMessage(response.message);
    setShowModal(true);
    _getTransactions();
  };

  const handleClose = () => setShow(false);
  const handleShow = (additionalDetails) => {
    setAdditionalDetails(additionalDetails);
    setShow(true);
  };

  const renderRequests = (handleShow) => {
    return (
      <Table responsive striped>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Paga ID</th>
            <th>Txn Type</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const txnType =
              user.id === transaction.receiver._id ? "DEPOSIT" : "WITHDRAW";
            const otherParty =
              txnType === "DEPOSIT" ? transaction.sender : transaction.receiver;
            return (
              <tr>
                <td>
                  {utils.getCustomDate(
                    transaction.txnStartDate,
                    "h:mm a, DD-MM-yyyy"
                  )}
                </td>
                <td>{utils.toCurrency(transaction.amount)}</td>
                <td>{transaction.pagaTxnId}</td>
                <td>
                  {txnType === "DEPOSIT" ? (
                    <Badge variant="info">Deposit</Badge>
                  ) : (
                    <Badge variant="warning">Withdrawal</Badge>
                  )}
                </td>
                <td>{otherParty.username}</td>
                <td>{`${otherParty.firstName} ${otherParty.lastName}`}</td>
                <td>{otherParty.phoneNumber}</td>
                <td>
                  <Button
                    onClick={() => handleShow(transaction)}
                    className="btn-sm mx-1"
                    variant="info"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() =>
                      _approveTransaction(transaction.referenceNumber, true)
                    }
                    className="btn-sm mx-1"
                    variant="success"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() =>
                      _approveTransaction(transaction.referenceNumber, false)
                    }
                    className="btn-sm mx-1"
                    variant="danger"
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <div>
        <Row className="p-4 justify-content-md-center">
          <Col className="c-card" lg={8}>
            <h5 className="px-4 pb-2 text-muted">Requests</h5>
            {/* <hr></hr> */}
            {transactions.length === 0
              ? renderEmpty
              : renderRequests(handleShow)}
          </Col>
        </Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table bordered>
              <tbody>
                <tr>
                  <td>
                    <b>Narration</b>
                  </td>
                  <td>{additionalDetails.narration}</td>
                </tr>
                <tr>
                  <td>
                    <b>Paga ID</b>
                  </td>
                  <td>{additionalDetails.pagaTxnId}</td>
                </tr>
                <tr>
                  <td>
                    <b>Reference Number</b>
                  </td>
                  <td>{additionalDetails.referenceNumber}</td>
                </tr>
                <tr>
                  <td>
                    <b>Aditional Details</b>
                  </td>
                  <td>{additionalDetails.additionalDetails}</td>
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
      </div>
    </>
  );
}

export default Exchanger;
