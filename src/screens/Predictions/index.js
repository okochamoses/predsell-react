import React, { useState, useEffect } from "react";
import { Container, Col, Form, Row, Table, Button, Badge, Modal } from "react-bootstrap";
import {
  search,
  createSportsPrediction,
  createLotteryPrediction,
  getSportsBookmakers,
  getLotteryCategories,
  getAvailableLotteryEntries,
  deletePrediction,
} from "../../services/predictions";
import utils from "../../utils";
import { useForm } from "react-hook-form";
import { getLoggedInUser } from "../../utils/authUtils";
import DataTable from "../../components/DataTable";

const Predictions = ({ setShowModal, setModalMessage, setModalType }) => {
  const [predictions, setPredictions] = useState([]);
  const [bookmakers, setbookmakers] = useState([]);
  const [promo, setPromo] = useState(false);
  const [promoLottery, setPromoLottery] = useState(false);
  const [lotteryCategories, setLotteryCategories] = useState([]);
  const [availableLotteryEntries, setAvailableLotteryEntries] = useState([]);
  const [lotteryTypes, setLotteryTypes] = useState([]);
  const [type, setType] = useState(false);
  const [sportsLoader, setSportsLoader] = useState(false);
  const [showLotteryNumbers, setShowLotteryNumbers] = useState(false);
  const [lotteryNums, setLotteryNums] = useState("");

  const getGameType = (lotteryCode) => {
    let g;
    Object.values(lotteryCategories).forEach((category) => {
      // console.log(category)
      Object.values(category.gameTypes).forEach((game) => {
        console.log(game.code);
        console.log(type);
        if (game.code === lotteryCode[0]) {
          console.log(game.code);
          g = game;
        }
      });
    });
    console.log(g);
    return g;
  };

  const generateLotteryNumberForm = () => {
    const categoryNumberCount = getGameType(type).numberSelect;
    let numberSelect;
    let numberSelectRem;

    if (type && categoryNumberCount > 5) {
      numberSelect = 5;
      numberSelectRem = categoryNumberCount - 5;
    } else {
      numberSelect = categoryNumberCount;
    }

    let refs = [];
    let refs2 = [];

    //Generate refs from numberSelect
    for (let i = 0; i < numberSelect; i++) {
      refs.push(React.createRef());
    }
    for (let i = 0; i < numberSelectRem; i++) {
      refs2.push(React.createRef());
    }

    const _goNextAfterEdit = (inputRefs, value, index) => {
      
      if (value.length == 2 && index < inputRefs.length - 1) {
        inputRefs[index + 1].focus();

        let nums = "";
        refs.forEach((ref) => {
          nums += ref.value + "-";
        });

        setLotteryNums(nums.slice(0, -1));
        return;
      }
      if (value.length == 2) {

        let nums = "";
        refs.forEach((ref) => {
          nums += ref.value + "-";
        });

        setLotteryNums(nums.slice(0, -1));
        setShowLotteryNumbers(false);
      }
      
    };

    return (
      <>
        {refs.map((k, idx) => (
          <input
            onChange={(e) => _goNextAfterEdit(refs, e.target.value, idx)}
            ref={(r) => (refs[idx] = r)}
            type="number"
            minlength="2"
            maxlength="2"
            max={90}
            name="lotteryNumbers1"
            // style={{display: "block"}}
            className="lotteryNumbers"
          />
        ))}
        {refs2.length > 0 ? <hr /> : null}
        {refs2.map((k, idx) => (
          <input
            onChange={(e) => _goNextAfterEdit(refs2, e.target.value, idx)}
            ref={(r) => (refs2[idx] = r)}
            type="number"
            minLength="2"
            maxLength="2"
            max={90}
            name="lotteryNumbers2"
            className="lotteryNumbers"
          />
        ))}
      </>
    );
  };

  const submitLotteryNums = () => {

  }

  useEffect(() => {
    const fetchData = async () => {
      await initialize();
    };
    fetchData();
  }, []);

  const initialize = async () => {
    const response = await search(null, null, null, getLoggedInUser().id);
    if (response.code === 0) {
      setPredictions(response.data.reverse());
    }
    await getBookmakersApi();
    await getLotteryCategoriesApi();
  };

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
    const res = await getAvailableLotteryEntries();
    if (res.code === 0) {
      setAvailableLotteryEntries(res.data);
    }
  };

  const _deletePrediction = async (predictionId) => {
    const response = await deletePrediction(predictionId);

    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
    await initialize();
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
    { title: "Create Time", key: "createDate" },
    { title: "Start Time", key: "startTime" },
    { title: "End Time", key: "endTime" },
    { title: "Bookmaker", key: "bookmaker" },
    { title: "Estimated Odds", key: "estimatedOdds" },
    { title: "Price", key: "price" },
    { title: "Approval", key: "availability" },
    { title: "Status", key: "status" },
    { title: "Buyers", key: "buyers" },
    { title: "Action", key: "_id" },
  ];

  const dataProcess = {
    createDate: (data) => (
      <>
        <span style={{ color: "#4F4F4F" }}>{utils.get24hrTime(data)}</span> <br /> {utils.getDayMonth(data)}
      </>
    ),
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
    status: (data) => renderStatus(data),
    buyers: (data) => data.length,
    _id: (data) => {
      const d = predictions.filter((p) => p._id === data)[0];
      return (
        <>
          {d && d.availability === "PENDING" ? (
            <Button onClick={() => _deletePrediction(d.predictionId)} size="sm" variant="danger">
              Delete
            </Button>
          ) : (
            ""
          )}
        </>
      );
    },
  };

  const handleCreateSportsPrediction = async ({
    price,
    bookingNumber,
    bookmaker,
    promotionsAllowed,
    promotionPercentage,
  }) => {
    // Loader
    setSportsLoader(true);
    //API call
    const response = await createSportsPrediction(
      price,
      bookingNumber,
      bookmaker,
      promotionsAllowed === "true",
      promotionPercentage
    );
    setSportsLoader(false);
    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
    // Reload page with new data
    initialize();
  };

  const handleCreateLotteryPrediction = async ({lotteryEntryGroup, price, lotteryType, promotionsAllowed, promotionsPercentage}) => {
    const category = lotteryType;
    const lotteryNumbers = lotteryNums.replace("-", ",");
    

    // Loader
    setSportsLoader(true);

    //API call
    const response = await createLotteryPrediction(
      price,
      lotteryEntryGroup,
      category,
      lotteryNumbers,
      promotionsAllowed === "true",
      promotionsPercentage
    );
    setSportsLoader(false);
    setShowModal(true);
    setModalMessage(response.message);
    setModalType(response.code === 0 ? "SUCCESS" : "FAILURE");
    // Reload page with new data
    initialize();
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
                <Form.Text className="text-muted">
                  Create a sports prediction on your favourite betting plaform and enter the prediction here.
                </Form.Text>
                <Form.Text className="text-muted pb-3">Note: You will be charged N150 for this transaction</Form.Text>

                <Form.Group className="pt-2">
                  <Form.Label>Booking Number</Form.Label>
                  <Form.Control name="bookingNumber" type="text" ref={register({ required: true })} />
                  {errors.bookingNumber && errors.bookingNumber.type === "required" && (
                    <Form.Text className="text-danger">This field is required</Form.Text>
                  )}
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Bookmaker</Form.Label>
                      <Form.Control as="select" name="bookmaker" type="text" ref={register({ required: true })}>
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
                      {errors.price && errors.price.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Allow Promotions</Form.Label>
                      <Form.Control 
                        onChange={(e) => setPromo(e.target.value === "true" ? true : false)} 
                        as="select" name="promotionsAllowed" type="text" ref={register({ required: true })}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                  {
                    promo ?
                    <Form.Group>
                      <Form.Label>Promotion(%)</Form.Label>
                      <Form.Control disabled={!promo} name="promotionPercentage" type="number" max="50.0" ref={register()} />
                    </Form.Group>
                    : null
                  }
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  type="submit"
                  size=""
                  disabled={sportsLoader}
                  className="form-control mb-2 mt-1"
                >
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

              <Form id="lottery" onSubmit={handleSubmitLottery(handleCreateLotteryPrediction)}>
                <Form.Text className="text-muted">
                  Create a sports prediction on your favourite betting plaform and enter the prediction here.
                </Form.Text>
                <Form.Text className="text-muted pb-3">Note: You will be charged N150 for this transaction</Form.Text>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Lottery Category</Form.Label>
                      <Form.Control
                        onChange={(e) => setLotteryTypes(lotteryCategories[e.target.value].gameTypes)}
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
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Lottery Type</Form.Label>
                      <Form.Control
                        onChange={(e) => setType([e.target.value])}
                        as="select"
                        name="lotteryType"
                        type="text"
                        ref={registerLottery({ required: true })}
                      >
                        <option value="">Select a lottery type</option>
                        {Object.keys(lotteryTypes).map((lotteryType, idx) => (
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
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Event Time</Form.Label>
                      <Form.Control
                        as="select"
                        name="lotteryEntryGroup"
                        type="text"
                        ref={registerLottery({ required: true })}
                      >
                        <option value="">Select Time</option>
                        {availableLotteryEntries.map((entry, idx) => (
                          <option key={idx} value={entry.lotteryEntryGroup}>
                            {utils.getCustomDate(entry.startTime, "DD-MMM-yyyy hh:mm a")}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Text className="text-muted">
                        {availableLotteryEntries.length !== 0
                          ? "Select the time in which predicted event is happening"
                          : "No events available"}
                      </Form.Text>
                      {errorsLottery.lotteryEntryGroup && errorsLottery.lotteryEntryGroup.type === "required" && (
                        <Form.Text className="text-danger">This field is required</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md="6" style={{ alignItems: "baseline" }}>
                    <Form.Group>
                      <Form.Label>Lottery Numbers</Form.Label>
                      <Form.Control as="button" type="button" onClick={() => setShowLotteryNumbers(true)}>
                        {lotteryNums}
                      </Form.Control>
                      {/* <Button>Enter Lottery Numbers</Button> */}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control name="price" type="number" ref={registerLottery()} />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Allow Promotions</Form.Label>
                      <Form.Control 
                        onChange={(e) => setPromoLottery(e.target.value === "true" ? true : false)}
                        as="select" name="promotionsAllowed" type="text" ref={registerLottery({ required: true })}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                  {
                    promoLottery ?
                    <Form.Group>
                      <Form.Label>Promotion (%)</Form.Label>
                      <Form.Control disabled={!promoLottery} name="promotionsPercentage" type="number" max="50.0" ref={registerLottery()} />
                    </Form.Group>
                    : null
                  }
                  </Col>
                </Row>

                <Button variant="dark" type="submit" size="" className="form-control mb-2 mt-1">
                  Create Lottery Prediction
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

              <DataTable tableHead={tableHead} data={predictions} dataProcess={dataProcess} />

              {predictions.map((p, idx) => (
                <div key={idx} className="table-card">
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

        {/* MODAL SECTION */}
        <Modal show={showLotteryNumbers} onHide={() => setShowLotteryNumbers(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter Lottery Numbers</Modal.Title>
          </Modal.Header>
          <Form onSubmit={(e) => console.log(e)}>
            <Modal.Body>
              <Row>
                <Col className="text-center">
                  {showLotteryNumbers && type ? generateLotteryNumberForm() : <p>Select a Lottery Type</p>}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowLotteryNumbers(false)}>
                Close
              </Button>
              <Button type="button" onClick={() => setShowLotteryNumbers(false)} >Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default Predictions;
