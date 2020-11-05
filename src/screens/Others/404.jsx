import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const NotFound = () => {
    const history = useHistory();
  return (
    <>
      <Container>
        <Row className="mt-5" style={{height: "90vh"}}>
          <Col md="12" className="h-100 d-flex justify-content-center align-items-center">
            <span className="text-center">
              <h1 style={{ fontSize: "8rem" }}>404</h1>
              <p style={{ fontSize: "1rem" }}>Page Not Found: <a href="/" onClick={() => history.goBack()}>Go Back</a></p>
            </span>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NotFound;
