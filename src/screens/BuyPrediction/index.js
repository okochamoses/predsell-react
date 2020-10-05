import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getPredictionById, buyPrediction, promotePrediction } from "../../services/predictions";
import moment from "moment";

const BuyPrediction = ({ setShowModal, setModalMessage, setModalType }) => {
  const { predictionId } = useParams();
  const [prediction, setPrediction] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getPredictionById(predictionId);
      if (response.code === 0) {
        setPrediction(response.data);
      }
    };
    fetchData();
  }, []);

  const purchasePrediction = async () => {
    const response = await buyPrediction(predictionId);
    if (response.code === 0) {
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }

    setModalMessage(response.message);
    setShowModal(true);
  };

  const promotePredictionApi = async () => {
    const response = await promotePrediction([prediction._id]);
    if (response.code === 0) {
      setModalType("SUCCESS");
    } else {
      setModalType("FAILURE");
    }

    setModalMessage(response.message);
    setShowModal(true);
  };

  const renderSuccessRatio = (predictor) => {
    const stats = prediction.predictor.predictionStats;
    if (stats.successful === 0 && stats.failed === 0) {
      return "-";
    }
    if (stats.successful === 0 && stats.failed !== 0) {
      return "0";
    }
    return (stats.successful / (stats.failed + stats.successful)) * 100;
  };

  return (
    <>
      <Container fluid>
        <div className="p-2">
          {/* <h3>Buy Prediction</h3> */}
          <Row className="mt-3 d-flex justify-content-center">
            <Col lg="4">
              <div className="py-3 px-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
                <h5 className="text-muted text-center">Prediction Details</h5>
                <CardInfo icon="account_balance_wallet" title="Amount" value={prediction ? prediction.price / 100 : 0} />
                <CardInfo icon="receipt" title="Bookmaker" value={prediction ? prediction.bookmaker : ""} />

                <CardInfo icon="donut_large" title="Estimated Odds" value={prediction ? prediction.estimatedOdds : ""} />
                <CardInfo icon="query_builder" title="Start Time" value={prediction ? moment(prediction.startTime).format("ddd MMM, YYYY") : ""} />
                <CardInfo icon="query_builder" title="End Time" value={prediction ? moment(prediction.endTime).format("ddd MMM, YYYY") : ""} />
                <Row>
                  <Col>
                    <Button className="form-control my-3" onClick={purchasePrediction}>
                      Buy
                    </Button>
                  </Col>
                  <Col className={prediction ? (prediction.promotionsAllowed ? "" : "d-none") : ""}>
                    <Button variant="danger" className="form-control my-3" onClick={promotePredictionApi}>
                      Promote
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col lg="4">
              <div className="py-3 px-4 pb-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
                <h5 className="text-muted text-center">Predictor Stats</h5>
                <CardInfo icon="face" title="Username" value={prediction ? prediction.predictor.username : ""} />
                <CardInfo
                  icon="account_balance_wallet"
                  title="Total Predictions"
                  value={prediction ? prediction.predictor.predictionStats.failed + prediction.predictor.predictionStats.successful : ""}
                />
                <CardInfo icon="check_circle" title="Successful Predictions" value={prediction ? prediction.predictor.predictionStats.successful : ""} />
                <CardInfo icon="highlight_off" title="Failed Predictions" value={prediction ? prediction.predictor.predictionStats.failed : ""} />
                <CardInfo icon="pie_chart" title="Win Ratio" value={prediction ? renderSuccessRatio(prediction) : ""} />
                <CardInfo icon="calendar_today" title="Join Date" value="21 Jul, 2020" />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

const CardInfo = ({ icon, title, value }) => (
  <div className="py-3" style={{ display: "flex", justifyContent: "space-between", borderBottom: "solid 1px #DEDEDE" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <i class="material-icons text-danger pr-2">{icon}</i>
      <span>{title}</span>
    </div>
    <span>{value}</span>
  </div>
);

export default BuyPrediction;
