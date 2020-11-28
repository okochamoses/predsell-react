import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import SportsSection from "../../components/Sports";
import { searchPending } from "../../services/predictions";
import { isUserAuthenticated } from "../../utils/authUtils";

const SportsPredictions = () => {
  const [sportsPredictions, setSportsPredictions] = useState([]);
  const [sportsPredictionsToday, setSportsPredictionsToday] = useState([]);
  const [sportsPredictionsWeek, setSportsPredictionsWeek] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // await userLogin("dev.mosesokocha@gmail.com", "123456")
      const response = await searchPending(
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        // new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),

        // "2019-09-01T22:59:59.999Z",
        "2022-09-01T22:59:59.999Z",
        "SPORTS"
      );
      if (response.code === 0) {
        const currentTime = new Date();
        const today = response.data.filter(r => new Date(new Date().setHours(0, 0, 0, 0)) < currentTime && currentTime < new Date(new Date().setHours(23, 59, 59, 999)))
        const week = response.data.filter(r => new Date(new Date().setHours(0, 0, 0, 0)) < currentTime && currentTime < new Date(new Date().setHours(23, 59, 59, 999)))
        setSportsPredictionsToday(today)
        setSportsPredictions(response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Container fluid>
        {/* {renderMakePrediction()} */}

        <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
          <Row className="mt-3">
            <Col md="6">
              <h4 className="text-muted">Sports <span className="text-danger">Predictions</span></h4>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md="12">
              <SportsSection 
                sportsPredictions={sportsPredictions}
                sportsPredictionsToday={sportsPredictionsToday}
                sportsPredictionsWeek={sportsPredictionsWeek}
              />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default SportsPredictions;
