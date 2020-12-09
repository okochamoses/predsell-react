import React from "react";
import { Col, Container, Row, OverlayTrigger, Popover } from "react-bootstrap";
import { updateUser, updateWallet, selectWallet, selectProfile } from "../../redux/reducers/userReducer";
import { useSelector } from "react-redux";
import utils from "../../utils";

const Dahboard = () => {
  const wallet = useSelector(selectWallet);
  const profile = useSelector(selectProfile);
  const predictions = profile.prediction;
  return (
    <>
      <Container fluid>
        <div className="p-sm-4">
          <h3 className="text-muted pt-4">Welcome {profile.firstName ? profile.firstName : ""}</h3>
          <Row className="">
            <Col lg={6}>
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">My Predictions</h4>
                <Row className="px-4">
                  <Col className="" xs="6">
                    <h6>Total Predictions</h6>
                    <h1>{predictions ? predictions.total : "0"}</h1>
                  </Col>
                  <Col className="text-success" xs="6">
                    <h6>Successful Predictions</h6>
                    <h1>{predictions ? predictions.successful : "0"}</h1>
                  </Col>
                </Row>
                <Row className="px-4">
                  <Col className="text-danger" xs="6">
                    <h6>Failed Predictions</h6>
                    <h1>{predictions ? predictions.failed : "0"}</h1>
                  </Col>
                  <Col className="text-warning" xs="6">
                    <h6>Pending Predictions</h6>
                    <h1>{predictions ? predictions.pending : "0"}</h1>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col lg={6}>
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">My Wallet</h4>
                <Row className="px-4 d-flex justify-content-center">
                  <Col lg="5" className="d-flex justify-content-center">
                    <img src="/images/card.svg" />
                  </Col>
                  <Col lg="7" className="">
                    <h6 className="text-muted">Available Balance</h6>
                    <h3>
                      {wallet ? utils.toCurrency(wallet.availableBalance) : "--"}
                    </h3>
                    {/* <h6 className="text-muted">
                      Escrow Balance {" "}
                      <OverlayTrigger
                        trigger="click"
                        key="bottom"
                        placement="bottom"
                        overlay={
                          <Popover id={`popover-positioned-bottom`}>
                            <Popover.Content>Information about the escrow balance</Popover.Content>
                          </Popover>
                        }
                      >
                        <span className="fa fa-info-circle"></span>
                      </OverlayTrigger>
                    </h6>
                    <h3>
                      {(wallet.ledgerBalance).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </h3> */}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <div className="my-2 bg-white pb-4" style={{ borderRadius: 10 }}>
                <h4 className="text-muted p-4">Predictions Available</h4>
                <Row className="px-4 d-flex justify-content-center">
                  <Col lg="5" className="d-flex justify-content-center">
                    <img src="/images/invoice.svg" style={{width: "50%", height: "90%"}} />
                  </Col>
                  <Col lg="7" className="">
                    <h6 className="text-muted">Predictions Available Today</h6>
                    <h3>{profile.dailyPredictionLimit ? profile.dailyPredictionLimit : "0"}</h3>
                    <h6 className="text-muted">
                      Referral Count{" "}
                      <OverlayTrigger
                        trigger="click"
                        key="bottom"
                        placement="bottom"
                        overlay={
                          <Popover id={`popover-positioned-bottom`}>
                            {/* <Popover.Title as="h3"></Popover.Title> */}
                            <Popover.Content>Information about the referrals</Popover.Content>
                          </Popover>
                        }
                      >
                        <span className="fa fa-info-circle"></span>
                      </OverlayTrigger>
                    </h6>
                    <h3>{profile.referralCount === 0 || profile.referralCount? profile.referralCount : "0"}</h3>


                    <h6 className="text-muted">Predictions Used Today</h6>
                    <h3>{profile.dailyPredictionLimit ? (profile.dailyPredictionLimit + profile.referralCount) - profile.availablePredictions : "0"}</h3>
                  </Col>
                </Row>
                <Row className="px-4 pt-4 d-flex justify-content-center">
                  <Col lg="12">
                    <p className="text-muted">You have a total of {profile.availablePredictions} predictions remaining to you today. To get more predictions, get more referrals to register the site with your referral code. The count resets at 00:00 GMT everyday</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Dahboard;
