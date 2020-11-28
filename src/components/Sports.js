import React, { useState, useEffect } from "react";
import { Table, Tab, Tabs, Button, Modal, Form, FormControl, InputGroup, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import utils from "../utils";
import { getSportsBookmakers } from "../services/predictions";

const SportsSection = ({ sportsPredictions }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [sportsBookmakers, setSportsBookmakers] = useState([]);
  const [itemToPruchase, setItemToPurchase] = useState({});
  const [sportsPredictionsToday, setSportsPredictionsToday] = useState([]);
  // const [itemToPruchase, setItemToPurchase] = useState({});
  const startToday = new Date();

  useEffect(() => {
    const run = async () => {
      await getBookmakers();
    };
    run();
  }, []);

  const handleClose = () => setShowBuyModal(false);

  const getBookmakers = async () => {
    const response = await getSportsBookmakers();
    if (response.code === 0) {
      console.log(response.data);
      setSportsBookmakers(response.data);
    }
  };
  
  return (
    <>
      <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
        <Tab eventKey="today" title="Today's Predictions">
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
              {sportsPredictionsToday.map((p, idx) => {
                const { successful, failed } = p.predictor ? p.predictor.predictionStats : {success:0, failed:0};
                const percent = (successful / (successful + failed)) * 100;
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
                    <td>{p.predictor ? p.predictor.username : null}</td>
                    <td>{p.bookmaker}</td>
                    <td>{p.price}</td>
                    <td>{p.estimatedOdds}</td>
                    <td>
                      <span style={{ color: "#4F4F4F" }}>Total: {successful + failed}</span> <br />
                      <span className="text-success">Successful: {successful}</span> <br />
                      <span className="text-danger">Failed: {failed}</span>
                    </td>
                    <td>
                      <Button size="sm" as={Link} to={`/buy-prediction/${p.predictionId}`}>
                        Buy
                      </Button>
                    </td>
                    <td>
                      {p.promotionsAllowed ? (
                        <Button size="sm" variant="danger" as={Link} to={`/buy-prediction/${p.predictionId}`}>
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
          {sportsPredictions.map((p) => (
            <div className="table-card">
              <div className="table-card-item">
                <div>
                  Start Time: <span className="text-muted">{utils.get24hrTime(p.startTime)}, {utils.getDayMonth(p.startTime)}</span>
                </div>
                <div>
                  End Time: <span className="text-muted">{utils.get24hrTime(p.endTime)}, {utils.getDayMonth(p.endTime)}</span>
                </div>
              </div>
              <div className="table-card-item">
                <span>Predictor</span>
                <span className="text-muted">{p.predictor.username}</span>
              </div>
              <div className="table-card-item">
                <span>Bookmaker</span>
                <span className="text-muted">{p.bookmaker}</span>
              </div>

              <div className="table-card-item">
                <span>Estimated Odds Odds</span>
                <span className="text-muted">{p.estimatedOdds}</span>
              </div>

              <div className="table-card-item">
                <span>Price</span>
                <span className="text-muted">{utils.toCurrency(p.price)}</span>
              </div>

              <div className="table-card-item">
                <span>Stats</span>
                <div>
                  <span className="float-right">Total: {p.predictor.predictionStats.successful + p.predictor.predictionStats.failed}</span> <br />
                  <span className="float-right text-success">Successful: {p.predictor.predictionStats.successful}</span> <br />
                  <span className="float-right text-danger">Failed: {p.predictor.predictionStats.failed}</span>
                </div>
              </div>

              <div className="table-card-item">
                <Button className="form-control" size="sm" to={`/buy-prediction/${p.predictionId}`}>
                  Buy
                </Button>
                <div style={{width: "10px"}}></div>
                {p.promotionsAllowed ? (
                  <Button className="form-control" size="sm" variant="danger" to={`/buy-prediction/${p.predictionId}`}>
                    Promote
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </Tab>
        <Tab eventKey="weekly" title="This Week">
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
              {sportsPredictions.map((p, idx) => {
                const { successful, failed } = p.predictor.predictionStats;
                const percent = (successful / (successful + failed)) * 100;
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
                    <td>{p.estimatedOdds}</td>
                    <td>{utils.toCurrency(p.price)}</td>
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
                        <Button size="sm" variant="danger" as={Link} to={`/buy-prediction/${p.predictionId}`}>
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
        <Tab eventKey="search" title="Search">
          <Form className="pt-4">
            <Row>
              <Col lg={3}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control className="mb-2 mr-sm-2" type="date" />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control className="mb-2 mr-sm-2" type="date" />
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
                    {sportsBookmakers.map((bookmaker, idx) => (
                      <option key={idx} value={bookmaker}>
                        {bookmaker}
                      </option>
                    ))}
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
              {sportsPredictions.map((p, idx) => {
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
                        <Button size="sm" variant="danger" as={Link} to={`/buy-prediction/${p.predictionId}`}>
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

export default SportsSection;
