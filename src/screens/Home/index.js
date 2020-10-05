import React, { useEffect, useState } from "react";
import { Button, Container, Col, Row, Card } from "react-bootstrap";
import { search } from "../../services/predictions";
import SportsSection from "../../components/Sports.js";
import { Link } from "react-router-dom";

const Home = () => {
  const [sportsPredictions, setSportsPredictions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      // await userLogin("dev.mosesokocha@gmail.com", "123456")
      const response = await search(
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString,
        new Date(new Date().setHours(23, 59, 59, 999)).toISOString,
        "SPORTS"
      );
      if (response.code === 0) {
        setSportsPredictions(response.data);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Container style={{ backgroundColor: "#FFD615", height: "85vh" }} fluid>
        <Row className="h-100">
          <Col md={5} className="d-md-block px-5 my-auto">
            <div>
              <h1 style={{ fontSize: "4em" }}>PREDSELL</h1>
              <p style={{ fontSize: "1em" }}>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it
                over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words,
                consectetur
              </p>
              <Button as={Link} to="/register" className="btn-danger pl-5 pr-5 pt-3 pb-3">Get Started</Button>
            </div>
          </Col>
          <Col md={7} className="h-100 pl-0 pr-0 d-none d-md-block my-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
            {/* <Carousel className="d-block w-100" style={{display: "flex", justifyContent: "center"}}>
              <Carousel.Item> */}
                  <img className="d-block" src="./images/mo_salah_Yellow.png" alt="First slide" style={{ maxWidth: "90%", maxHeight: "70vh", alignSelf: "center" }} />
                {/* <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption> */}
              {/* </Carousel.Item> */}
              {/* <Carousel.Item>
                <img className="d-block w-100" src="./images/de-bruyne.png" alt="First slide" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src="./img1.png" alt="First slide" />
              </Carousel.Item> */}
            {/* </Carousel> */}
          </Col>
        </Row>
      </Container>
      <Container fluid className="pt-5 px-md-5">
        <Row>
          <Col md={9}>
            <h2 className="text-danger">
              <span style={{ color: "#1E2A78" }}>Sports</span> Predictions
            </h2>
            <SportsSection sportsPredictions={sportsPredictions} />
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
                {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="pt-5">
          <Col md={9}>
            <h2 className="text-danger pb-3">
              <span style={{ color: "#1E2A78" }}>Lottery</span> Predictions
            </h2>
            <SportsSection sportsPredictions={sportsPredictions} />
          </Col>
          <Col md={3} className="pt-5">
            <Card>
              <Card.Body>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
                <Card.Title>IMAGE HERE</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
