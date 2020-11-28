import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import LotterySection from "../../components/Lotteries";
import { search } from "../../services/predictions";

const LotteryPredictions = () => {
  const [lotteryPredictions, setLotteryPredictions] = useState([]);
  const [lotteryPredictionsToday, setLotteryPredictionsToday] = useState([]);
  const [lotteryPredictionsWeek, setLotteryPredictionsWeek] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await search(
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        "2022-09-01T22:59:59.999Z",
        "LOTTERY"
      );
        
      if (response.code === 0) {
        const currentTime = new Date();
        const today = response.data.filter(r => new Date(new Date().setHours(0, 0, 0, 0)) < currentTime && currentTime < new Date(new Date().setHours(0, 0, 0, 0)))
        console.log(today)
        setLotteryPredictions(response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Container fluid>
        <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
          <Row className="mt-3">
            <Col md="6">
              <h4 className="text-muted">Lottery <span className="text-danger">Predictions</span></h4>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md="12">
              <LotterySection lotteryPredictions={lotteryPredictions} />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default LotteryPredictions;
