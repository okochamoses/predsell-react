import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Modal, Row, Tab, Table, Tabs } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DataTable from "../../components/DataTable";
import {
  approvePrediction,
  declinePrediction,
  getAvailableLotteryEntries,
  search,
  successfulPrediction,
  approveLotteryEntry as approveLotteryEntryApi,
} from "../../services/predictions";
import utils from "../../utils";

const Dashboard = ({ setShowModal, setModalMessage, setModalType }) => {
  const [show, setShow] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showLottery, setShowLottery] = useState(false);
  const [lotteryEntryGroup, setLotteryEntryGroup] = useState(false);
  const [approveLotteryEntry, setApproveLotteryEntry] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [prediction, setPrediction] = useState([]);
  const [pendingPredictions, setPendingPredictions] = useState([]);
  const [lotteryEntries, setlotteryEntries] = useState([]);
  const [unprocessedPredictions, setUnprocessedPredictions] = useState([]);

  useEffect(() => {
    const txn = async () => {
      await _searchPredictions();
      await _lotteryEntries();
    };
    txn();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (prediction) => {
    setPrediction(prediction);
    setShow(true);
  };

  // FORMS

  const { register: registerDecline, errors: errorsDecline, handleSubmit: handleSubmitDecline } = useForm({
    mode: "onBlur",
  });
  const { register: registerApprove, errors: errorsApprove, handleSubmit: handleSubmitApprove } = useForm({
    mode: "onBlur",
  });
  const {
    register: registerLotteryEntry,
    errors: errorsLotteryEntry,
    handleSubmit: handleApproveLotteryEntry,
  } = useForm({
    mode: "onBlur",
  });
  const { register: createEntry, errors: errorsCreateEntry, handleSubmit: handleSubmitCreateEntry } = useForm({
    mode: "onBlur",
  });

  const _declinePrediction = async ({ reason }) => {
    const response = await declinePrediction(prediction.predictionId, reason);
    setShowDecline(false);
    setShowModal(true);
    setModalMessage(response.message);
    if (response.code === 0) {
      await _searchPredictions();
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
  };

  const _approvePrediction = async ({ startDate, startTime, endDate, endTime, estimatedOdds }) => {
    const start = new Date(startDate + " " + startTime);
    const end = new Date(endDate + " " + endTime);
    const response = await approvePrediction(prediction.predictionId, start, end, estimatedOdds);
    setShowApprove(false);
    setShowModal(true);
    setModalMessage(response.message);
    if (response.code === 0) {
      await _searchPredictions();
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
  };

  const _predictionSuccessful = async (prediction) => {
    const response = await successfulPrediction(prediction.predictionId);
    setShowApprove(false);
    setShowModal(true);
    setModalMessage(response.message);
    if (response.code === 0) {
      await _searchPredictions();
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
  };

  const _searchPredictions = async () => {
    const response = await search();
    if (response.code === 0) {
      setPredictions(response.data);
      const pending = response.data.filter((p) => p.availability === "PENDING");
      setPendingPredictions(pending);
      setUnprocessedPredictions(response.data.filter((p) => p.availability === "APPROVED" && p.status === "PENDING"));
    } else {
      // throw error
    }
  };

  const _lotteryEntries = async () => {
    const response = await getAvailableLotteryEntries();
    if (response.code === 0) {
      setlotteryEntries(response.data);
    } else {
      // throw error
    }
  };

  const _approveLotteryEntry = async ({ winningNumbers }) => {
    const response = await approveLotteryEntryApi(winningNumbers, lotteryEntryGroup);
    setShowApprove(false);
    setShowModal(true);
    setModalMessage(response.message);
    if (response.code === 0) {
      await _searchPredictions();
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }
  };

  const tableHead = [
    { title: "Create Date", key: "createDate" },
    { title: "Prediction ID", key: "_id" },
    { title: "Bookmaker", key: "bookmaker" },
    { title: "Booking Number", key: "bookingNumber" },
    { title: "Price", key: "price" },
    { title: "Prediction Type", key: "type" },
    { title: "Availability", key: "availability" },
    { title: "Completion Status", key: "status" },
    { title: "Actions", key: "predictionId" },
  ];

  const lotteryTableHead = [
    { title: "Start Date", key: "startTime" },
    { title: "Actions", key: "lotteryEntryGroup" },
  ];

  const dataProcess = {
    // inEscrow: (data) => (data ? <Badge variant="success">True</Badge> : <Badge variant="danger">false</Badge>),
    price: (data) => utils.toCurrency(data),
    createDate: (data) => utils.getCustomDate(data, "DD-MM-yyyy hh:mm a"),
    _id: (data) => predictions.find((pred) => pred._id === data).predictionId,
    predictionId: (data) => {
      const p = predictions.find((pred) => pred.predictionId === data);
      return (
        <>
          <Button onClick={() => handleShow(p)} className="mx-1" size="sm">
            Details
          </Button>
          <Button
            onClick={() => {
              setPrediction(p);
              setShowApprove(true);
            }}
            className="mx-1"
            variant="success"
            size="sm"
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              setPrediction(p);
              setShowDecline(true);
            }}
            className="mx-1"
            variant="danger"
            size="sm"
          >
            Decline
          </Button>
        </>
      );
    },
  };

  const dataProcessUnprocessed = {
    price: (data) => utils.toCurrency(data),
    createDate: (data) => utils.getCustomDate(data, "DD-MM-yyyy hh:mm a"),
    _id: (data) => predictions.find((pred) => pred._id === data).predictionId,
    predictionId: (data) => {
      const p = predictions.find((pred) => pred.predictionId === data);
      return (
        <>
          <Button onClick={() => handleShow(p)} className="mx-1" size="sm">
            Details
          </Button>
          <Button onClick={() => _predictionSuccessful(p)} className="mx-1" variant="success" size="sm">
            Successful
          </Button>
          <Button className="mx-1" variant="danger" size="sm">
            Failed
          </Button>
        </>
      );
    },
  };

  const dataProcessAll = {
    price: (data) => utils.toCurrency(data),
    createDate: (data) => utils.getCustomDate(data, "DD-MM-yyyy hh:mm a"),
    _id: (data) => predictions.find((pred) => pred._id === data).predictionId,
    predictionId: (data) => {
      const p = predictions.find((pred) => pred.predictionId === data);
      return <>N/A</>;
    },
  };

  const dataProcessLottery = {
    startTime: (data) => utils.getCustomDate(data, "DD-MM-yyyy hh:mm a"),
    lotteryEntryGroup: (data) => (
      <Button
        onClick={() => {
          setLotteryEntryGroup(data);
          setShowLottery(true);
        }}
        className="mx-1"
        variant="success"
        size="sm"
      >
        Approve
      </Button>
    ),
  };

  return (
    <>
      <h3 className="pb-3">Predictions</h3>
      <Row>
        <Col className="c-card">
          <Tabs defaultActiveKey="entries" id="uncontrolled-tab-example">
            <Tab eventKey="pending" title="Pending">
              <DataTable tableHead={tableHead} data={pendingPredictions} dataProcess={dataProcess} />
            </Tab>
            <Tab eventKey="unprocessed" title="Unprocessed">
              <DataTable tableHead={tableHead} data={unprocessedPredictions} dataProcess={dataProcessUnprocessed} />
            </Tab>
            <Tab eventKey="all" title="All Predictions">
              <DataTable tableHead={tableHead} data={predictions} dataProcess={dataProcessAll} />
            </Tab>

            <Tab eventKey="entries" title="Approve Lottery Entries">
              <DataTable tableHead={lotteryTableHead} data={lotteryEntries} dataProcess={dataProcessLottery} />
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
                  <b>Price</b>
                </td>
                <td>{utils.toCurrency(prediction.price ? prediction.price : "")}</td>
              </tr>
              <tr>
                <td>
                  <b>Availability</b>
                </td>
                <td>{prediction.availability}</td>
              </tr>
              <tr>
                <td>
                  <b>Promotions</b>
                </td>
                <td>{prediction.promotionsAllowed ? "Active" : "Inactive"}</td>
              </tr>
              <tr>
                <td>
                  <b>Promotions(%)</b>
                </td>
                <td>{prediction.promotionsAllowed ? prediction.promotionsPercentage + "%" : "-"}</td>
              </tr>
              <tr>
                <td>
                  <b>Buyers</b>
                </td>
                <td>{prediction.buyers && prediction.buyers.length !== 0 ? prediction.buyers.length : "No buyers"}</td>
              </tr>
              {prediction.declineReason ? (
                <tr>
                  <td>
                    <b>Decline Reason</b>
                  </td>
                  <td>{prediction.declineReason}</td>
                </tr>
              ) : null}
              <tr>
                <td>
                  <b>Date Initiated</b>
                </td>
                <td>{utils.getCustomDate(prediction.txnStartDate, "h:mm a, DD-MM-yyyy")}</td>
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

      <Modal show={false} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Approve</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control name="startDate" type="date" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control name="startTime" type="time" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control name="endDate" type="date" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control name="endTime" type="time" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Prediction Odds</Form.Label>
              <Form.Control name="odds" type="number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button>Submit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDecline} onHide={() => setShowDecline(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decline</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitDecline(_declinePrediction)}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Decline Reason</Form.Label>
              <Form.Control as="textarea" rows={5} name="reason" ref={registerDecline({ required: true })} />
              {errorsDecline.reason && errorsDecline.reason.type === "required" && (
                <Form.Text className="text-danger">This field is required</Form.Text>
              )}
            </Form.Group>
            <Form.Control name="predictionId" type="hidden" value={prediction.predictionId} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDecline(false)}>
              Close
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showApprove} onHide={() => setShowApprove(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitApprove(_approvePrediction)}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control name="startDate" type="date" ref={registerApprove({ required: true })} />
                  {errorsApprove.startDate && errorsApprove.startDate.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control name="startTime" type="time" ref={registerApprove({ required: true })} />
                  {errorsApprove.startTime && errorsApprove.startTime.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control name="endDate" type="date" ref={registerApprove({ required: true })} />
                  {errorsApprove.endDate && errorsApprove.endDate.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control name="endTime" type="time" ref={registerApprove({ required: true })} />
                  {errorsApprove.endTime && errorsApprove.endTime.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Prediction Odds</Form.Label>
              <Form.Control name="estimatedOdds" type="number" step="0.01" ref={registerApprove({ required: true })} />
              {errorsApprove.estimatedOdds && errorsApprove.estimatedOdds.type === "required" && (
                <Form.Text className="text-danger">This field is required</Form.Text>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApprove(false)}>
              Close
            </Button>
            <Button type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showLottery} onHide={() => setShowLottery(false)}>
        <Form onSubmit={handleApproveLotteryEntry(_approveLotteryEntry)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Approve <span className="text-danger">Lottery</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col>
                <Form.Group className="">
                  <Form.Label>WinningNumbers</Form.Label>
                  <Form.Control name="lotteryEntry" type="text" ref={registerLotteryEntry({ required: true })} />
                  <Form.Text>Enter lottery number separated By commas. e.g 06, 11, 03, 86, 34</Form.Text>
                  {errorsLotteryEntry.lotteryEntry && errorsLotteryEntry.lotteryEntry.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
{/* 
                <Button
                  variant="primary"
                  type="submit"
                  size=""
                  disabled={approveLotteryEntry}
                  className="form-control mb-2 mt-1"
                >
                  {approveLotteryEntry ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Approve"}
                </Button> */}
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              size=""
              disabled={approveLotteryEntry}
              className=""
            >
              {approveLotteryEntry ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Approve"}
            </Button>
            <Button variant="secondary" onClick={() => setShowLottery(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Dashboard;
