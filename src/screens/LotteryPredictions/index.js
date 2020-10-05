import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import LotterySection from "../../components/Lotteries";
import { search } from "../../services/predictions";

const LotteryPredictions = () => {
  const [lotteryPredictions, setLotteryPredictions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await search(
        // new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        // new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),

        "2019-09-01T22:59:59.999Z",
        "2022-09-01T22:59:59.999Z",
        "LOTTERY"
      );
      if (response.code === 0) {
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
