import React, { useState, useEffect } from "react";
import { Container, Col, Form, Row, Table, Button, Badge } from "react-bootstrap";
import { search, createSportsPrediction, getSportsBookmakers, getLotteryCategories } from "../../services/predictions";
import utils from "../../utils";
import { useForm } from "react-hook-form";
import { getLoggedInUser } from "../../utils/authUtils";
import DataTable from "../../components/DataTable";

const Predictions = ({ setShowModal, setModalMessage, setModalType }) => {
  const [predictions, setPredictions] = useState([]);
  const [bookmakers, setbookmakers] = useState([]);
  const [lotteryCategories, setLotteryCategories] = useState([]);
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [sportsLoader, setSportsLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await search(null, null, null, getLoggedInUser().id);
      if (response.code === 0) {
        setPredictions(response.data);
      }
      await getBookmakersApi();
      await getLotteryCategoriesApi();
    };
    fetchData();
  }, []);

  const getBookmakersApi = async () => {
    const response = await getSportsBookmakers();
    if (response.code === 0) {
      setbookmakers(response.data);
    }
  };

  const getLotteryCategoriesApi = async () => {
    const response = await getLotteryCategories();
    if (response.code === 0) {
      setLotteryCategories(response.data);
    }
  };

  const { register, handleSubmit, errors } = useForm();
  const { register: registerLottery, errors: errorsLottery, handleSubmit: handleSubmitLottery } = useForm({
    mode: "onBlur",
  });

  const renderStatus = (status) => {
    if (status === "SUCCESSFUL") {
      return <Badge variant="success">{status}</Badge>;
    }
    if (status === "FAILED") {
      return <Badge variant="danger">{status}</Badge>;
    }
    if (status === "PENDING") {
      return <Badge variant="warning">{status}</Badge>;
    }
  };

  const renderAvailability = (status) => {
    if (status === "APPROVED") {
      return <Badge variant="success">{status}</Badge>;
    }
    if (status === "DECLINED") {
      return <Badge variant="danger">{status}</Badge>;
    }
    if (status === "PENDING") {
      return <Badge variant="warning">{status}</Badge>;
    }
  };

  // PREDICTION TABLE DATA
  const tableHead = [
    { title: "Start Time", key: "startTime" },
    { title: "End Time", key: "endTime" },
    { title: "Bookmaker", key: "bookmaker" },
    { title: "Estimated Odds", key: "estimatedOdds" },
    { title: "Price", key: "amount" },
    { title: "Approval", key: "availability" },
    { title: "Status", key: "status" },
    // { title: "Buyers", key: "buyers" },
    // { title: "Action", key: "buyers" },
  ];

  const dataProcess = {
    startTime: (data) => (
      <>
        <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(data)}</span> <br /> {utils.getDayMonth(data)}
      </>
    ),
    endTime: (data) => (
      <>
        <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(data)}</span> <br /> {utils.getDayMonth(data)}
      </>
    ),
    price: (data) => utils.toCurrency(data),
    availability: (data) => renderAvailability(data),
    status: (data) => renderAvailability(data),
  };

  const handleCreateSportsPrediction = async ({ price, bookingNumber, bookmaker, promotionsAllowed, promotionPercentage }) => {
    // Loader
    setSportsLoader(true);
    const response = await createSportsPrediction(price, bookingNumber, bookmaker, promotionsAllowed === "true", promotionPercentage);
    // console.log(response)
    setSportsLoader(false);
    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
  };

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col lg="6">
            <div className="p-4 my-2 mt-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h4 className="text-muted">
                Create <span className="text-danger">Sports</span> Prediction
              </h4>

              <Form id="sports" onSubmit={handleSubmit(handleCreateSportsPrediction)}>
                <Form.Text className="text-muted">Create a sports prediction on your favourite betting plaform and enter the prediction here.</Form.Text>
                <Form.Text className="text-muted pb-3">Note: You will be charged N150 for this transaction</Form.Text>

                <Form.Group className="pt-2">
                  <Form.Label>Booking Number</Form.Label>
                  <Form.Control name="bookingNumber" type="text" ref={register({ required: true })} />
                  {errors.bookingNumber && errors.bookingNumber.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Bookmaker</Form.Label>
                      <Form.Control className="" as="select" name="bookmaker" type="text" ref={register({ required: true })}>
                        {bookmakers.map((bookmaker, idx) => (
                          <option key={idx} value={bookmaker}>
                            {bookmaker}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control name="price" type="number" ref={register({ required: true })} />
                      {errors.price && errors.price.type === "required" && <Form.Text className="text-danger">This field is required</Form.Text>}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Allow Promotions</Form.Label>
                      <Form.Control className="" as="select" name="promotionsAllowed" type="text" ref={register({ required: true })}>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Promotion(%)</Form.Label>
                      <Form.Control name="promotionPercentage" type="number" ref={register()} />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" size="" disabled={sportsLoader} className="form-control mb-2 mt-1">
                  {sportsLoader ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Create sports prediction"}
                </Button>
              </Form>
            </div>
          </Col>
          <Col lg="6">
            <div className="p-4 my-2 mt-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h4 className="text-muted">
                Create <span className="text-danger">Lottery</span> Prediction
              </h4>

              <Form id="lottery" onSubmit={handleSubmitLottery((data) => console.log(data))}>
                <Form.Text className="text-muted">Create a sports prediction on your favourite betting plaform and enter the prediction here.</Form.Text>
                <Form.Text className="text-muted pb-3">Note: You will be charged N150 for this transaction</Form.Text>
                <Form.Group className="pt-2">
                  <Form.Label>Lottery Number</Form.Label>
                  <Form.Control name="lotteryNumber" type="text" ref={registerLottery({ required: true })} />
                  {errorsLottery.lotteryNumber && errorsLottery.lotteryNumber.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                  {/* Pattern validation */}
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Lottery Category</Form.Label>
                      <Form.Control
                        className=""
                        onChange={(e) => setLotteryTypes(Object.values(lotteryCategories[e.target.value]))}
                        as="select"
                        name="category"
                        type="text"
                        ref={registerLottery({ required: true })}
                      >
                        <option key={0} value={null}>
                          Select Category
                        </option>
                        {Object.keys(lotteryCategories).map((lotteryCategory, idx) => (
                          <option key={idx} value={lotteryCategory}>
                            {lotteryCategory}
                          </option>
                        ))}
                      </Form.Control>
                      {errorsLottery.category && errorsLottery.category.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Lottery Type</Form.Label>
                      <Form.Control className="" as="select" name="lotteryType" type="text" ref={registerLottery({ required: true })}>
                        {lotteryTypes.map((lotteryType, idx) => (
                          <option key={idx} value={lotteryType}>
                            {lotteryType}
                          </option>
                        ))}
                      </Form.Control>
                      {errorsLottery.lotteryType && errorsLottery.lotteryType.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Allow Promotions</Form.Label>
                      <Form.Control className="" as="select" name="promotions" type="text" ref={registerLottery({ required: true })}>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Promotion (%)</Form.Label>
                      <Form.Control name="bookingNumber" type="number" ref={registerLottery()} />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="dark" type="submit" size="" className="form-control mb-2 mt-1">
                  Create
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="12">
            <div className="p-4 my-2 mt-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
              <h4 className="text-muted">
                My <span className="text-danger">Predictions</span>
              </h4>
              <Table responsive className="table-striped2">
                <thead>
                  <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Bookmaker</th>
                    <th>Est. Odds</th>
                    <th>Price(₦)</th>
                    <th>Approval</th>
                    <th>Status</th>
                    <th>Buyers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, idx) => {
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
                        <td>{p.bookmaker}</td>
                        <td>{p.estimatedOdds}</td>
                        <td>{utils.toCurrency(p.price)}</td>
                        <td>{renderAvailability(p.availability)}</td>
                        <td>{renderStatus(p.status)}</td>
                        <td>{p.buyers.length}</td>
                        <td>
                          {p.buyers.length === 0 ? (
                            <Button size="sm" variant="danger">
                              Delete
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

              {/* <DataTable tableHead={tableHead} data={predictions} dataProcess={dataProcess} /> */}

              {predictions.map((p) => (
                <div className="table-card">
                  <div className="table-card-item">
                    <div>
                      Start Time:{" "}
                      <span className="text-muted">
                        {utils.get24hrTime(p.startTime)}, {utils.getDayMonth(p.startTime)}
                      </span>
                    </div>
                    <div>
                      End Time:{" "}
                      <span className="text-muted">
                        {utils.get24hrTime(p.endTime)}, {utils.getDayMonth(p.endTime)}
                      </span>
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
                    <span>Available</span>
                    <span className="text-muted">{renderAvailability(p.availability)}</span>
                  </div>

                  <div className="table-card-item">
                    <span>Status</span>
                    <span className="text-muted">{renderAvailability(p.status)}</span>
                  </div>

                  <div className="table-card-item">
                    <span>Buyers</span>
                    <span className="text-muted">{p.buyers.length}</span>
                  </div>
                  {p.buyers.length === 0 ? (
                    <div className="table-card-item">
                      <Button className="form-control" size="sm" variant="danger">
                        Delete
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Predictions;
