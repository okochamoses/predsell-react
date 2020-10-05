import React, { useState, useEffect } from "react";
import { Col, Container, Row, Badge } from "react-bootstrap";
import { getUserPromotions } from "../../services/predictions";
import DataTable from "../../components/DataTable";
import utils from "../../utils";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserPromotions();
      if (response.code === 0) {
        setPromotions(response.data.map(p => { return {
          ...p.prediction, promotionBuyers: p.buyers, estEarnings: utils.toCurrency((p.buyers * p.prediction.price)/100)}
        }));
        console.log(response.data)
      }
    };
    fetchData();
  }, []);

  const tableHead = [
    { title: "Prediction ID", key: "predictionId" },
    { title: "Price", key: "price" },
    { title: "Type", key: "type" },
    { title: "Bookmaker", key: "bookmaker" },
    { title: "Agent Percentage", key: "promotionsPercentage" },
    { title: "Status", key: "status" },
    { title: "Buyers", key: "promotionBuyers" },
    { title: "Earnings if successful", key: "estEarnings" },
  ];

  const dataProcess = {
    inEscrow: (data) => (data ? <Badge variant="success">True</Badge> : <Badge variant="danger">false</Badge>),
    price: (data) => utils.toCurrency(data),
    promotionBuyers: (data) => data.length,
    promotionsPercentage: data => data + "%"
  };

  return (
    <>
      <Container fluid>
        <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
          <Row className="mt-3">
            <Col>
              <h3>Promotions</h3>
              <DataTable tableHead={tableHead} data={promotions} dataProcess={dataProcess} />
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Promotions;
