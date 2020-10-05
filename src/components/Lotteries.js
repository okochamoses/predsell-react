import React, { useState } from "react";
import { Table, Tab, Tabs, Button, Modal, Form, FormControl, InputGroup, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import utils from "../utils";

const LotterySection = ({ lotteryPredictions }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [itemToPruchase, setItemToPurchase] = useState({});

  const { register, handleSubmit, errors } = useForm();

  const handleClose = () => setShowBuyModal(false);
  const handleShow = (prediction) => {
    setItemToPurchase(prediction);
    setShowBuyModal(true);
  };
  return (
    <>
      <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
        <Tab eventKey="today" title="Today's Predictions">
          <Table responsive className="table-striped2">
            <thead>
              <tr>
                <th>Time</th>
                <th>Predictor</th>
                <th>Bookmaker</th>
                <th>Est. Odds</th>
                <th>Price(₦)</th>
                <th>Stats</th>
                <th>Buy</th>
                <th>Promote</th>
              </tr>
            </thead>
            <tbody>
              {lotteryPredictions.map((p, idx) => {
                const { successful, failed } = p.predictor.predictionStats;
                const percent = (successful / (successful + failed)) * 100;
                return (
                  <tr key={idx}>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(p.startTime)}</span> <br />
                      {utils.getDayMonth(p.startTime)}
                    </td>
                    <td>{p.predictor.username}</td>
                    <td>{p.bookmaker}</td>
                    <td>{p.price}</td>
                    <td>{p.estimatedOdds}</td>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>Total: {p.predictor.predictionStats.successful + p.predictor.predictionStats.failed}</span> <br />
                      <span className="text-success">Successful: {p.predictor.predictionStats.successful}</span> <br />
                      <span className="text-danger">Failed: {p.predictor.predictionStats.failed}</span>
                    </td>
                    <td>
                      <Button size="sm" as={Link} to={`/buy-prediction/${p.predictionId}`}>
                        Buy
                      </Button>
                    </td>
                    <td>
                      {p.promotionsAllowed ? (
                        <Button size="sm" variant="danger">
                          Promote
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="weekly" title="This Week">
          <Table responsive className="table-striped2">
            <thead>
              <tr>
                <th>Time</th>
                <th>Predictor</th>
                <th>Bookmaker</th>
                <th>Est. Odds</th>
                <th>Price(₦)</th>
                <th>Stats</th>
                <th>Buy</th>
                <th>Promote</th>
              </tr>
            </thead>
            <tbody>
              {lotteryPredictions.map((p, idx) => {
                const { successful, failed } = p.predictor.predictionStats;
                const percent = (successful / (successful + failed)) * 100;
                return (
                  <tr key={idx}>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(p.startTime)}</span> <br />
                      {utils.getDayMonth(p.startTime)}
                    </td>
                    <td>{p.predictor.username}</td>
                    <td>{p.bookmaker}</td>
                    <td>{p.price}</td>
                    <td>{p.estimatedOdds}</td>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>Total: {p.predictor.predictionStats.successful + p.predictor.predictionStats.failed}</span> <br />
                      <span className="text-success">Successful: {p.predictor.predictionStats.successful}</span> <br />
                      <span className="text-danger">Failed: {p.predictor.predictionStats.failed}</span>
                    </td>
                    <td>
                      <Button size="sm">Buy</Button>
                    </td>
                    <td>
                      {p.promotionsAllowed ? (
                        <Button size="sm" variant="danger">
                          Promote
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>Master Predictor</td>
                <td>Nairabet</td>
                <td>7,500.00</td>
                <td>214.78</td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>81.7%</span> <br />
                  <span className="text-success">23</span>|<span className="text-danger">31</span>
                </td>
                <td>
                  <Button size="sm">Buy</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>Master Predictor</td>
                <td>Nairabet</td>
                <td>7,500.00</td>
                <td>214.78</td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>81.7%</span> <br />
                  <span className="text-success">23</span>|<span className="text-danger">31</span>
                </td>
                <td>
                  <Button size="sm">Buy</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>Master Predictor</td>
                <td>Nairabet</td>
                <td>7,500.00</td>
                <td>214.78</td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>81.7%</span> <br />
                  <span className="text-success">23</span>|<span className="text-danger">31</span>
                </td>
                <td>
                  <Button size="sm">Buy</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>Master Predictor</td>
                <td>Nairabet</td>
                <td>7,500.00</td>
                <td>214.78</td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>81.7%</span> <br />
                  <span className="text-success">23</span>|<span className="text-danger">31</span>
                </td>
                <td>
                  <Button size="sm">Buy</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>17:25</span> <br />
                  17 Jul
                </td>
                <td>Master Predictor</td>
                <td>Nairabet</td>
                <td>7,500.00</td>
                <td>214.78</td>
                <td>
                  <span style={{ color: "#4F4F4F" }}>81.7%</span> <br />
                  <span className="text-success">23</span>|<span className="text-danger">31</span>
                </td>
                <td>
                  <Button size="sm">Buy</Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="search" title="Search">
          <Form className="pt-4">
            <Row>
              <Col lg={3}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control className="mb-2 mr-sm-2" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control className="mb-2 mr-sm-2" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="promotions">
                  <Form.Label>Promotions Allowed</Form.Label>
                  <Form.Control as="select" className="mb-2 mr-sm-2">
                    <option value={null}>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="bookmaker">
                  <Form.Label>Bookmaker</Form.Label>
                  <Form.Control as="select" className="mb-2 mr-sm-2">
                    <option value={null}></option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {/* <Form.Check type="checkbox" className="mb-2 mr-sm-2" id="inlineFormCheck" label="Remember me" /> */}
            <Button size="sm" type="submit" className="mb-2">
              Submit
            </Button>
          </Form>
          <hr />
          <Table responsive className="table-striped2">
            <thead>
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Predictor</th>
                <th>Bookmaker</th>
                <th>Est. Odds</th>
                <th>Price(₦)</th>
                <th>Stats</th>
                <th>Buy</th>
                <th>Promote</th>
              </tr>
            </thead>
            <tbody>
              {lotteryPredictions.map((p, idx) => {
                const { successful, failed } = p.predictor.predictionStats;
                return (
                  <tr key={idx}>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(p.startTime)}</span> <br />
                      {utils.getDayMonth(p.startTime)}
                    </td>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(p.endTime)}</span> <br />
                      {utils.getDayMonth(p.endTime)}
                    </td>
                    <td>{p.predictor.username}</td>
                    <td>{p.bookmaker}</td>
                    <td>{p.price}</td>
                    <td>{p.estimatedOdds}</td>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>Total: {p.predictor.predictionStats.successful + p.predictor.predictionStats.failed}</span> <br />
                      <span className="text-success">Successful: {p.predictor.predictionStats.successful}</span> <br />
                      <span className="text-danger">Failed: {p.predictor.predictionStats.failed}</span>
                    </td>
                    <td>
                      <Button size="sm" as={Link} to={`/buy-prediction/${p.predictionId}`}>
                        Buy
                      </Button>
                    </td>
                    <td>
                      {p.promotionsAllowed ? (
                        <Button size="sm" variant="danger">
                          Promote
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* BUY PREDICTION MODAL */}
      <Modal show={showBuyModal} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Buy Prediction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>START TIME: {itemToPruchase.startTime}</p>
          <p>PREDICTOR: {itemToPruchase.predictionId}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button size="sm" variant="primary">
            Make Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LotterySection;
