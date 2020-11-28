import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { search } from "../../services/predictions";

import { getAllTransactions, getDisputeRequests } from "../../services/transactions";
import { getAllUsers } from "../../services/users";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [disputedTransactions, setDisputedTransactions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [users, setUsers] = useState([]);

  const DATE_MINUS_WEEK = new Date();
  DATE_MINUS_WEEK.setDate(DATE_MINUS_WEEK.getDate() - 7);

  useEffect(() => {
    const txn = async () => {
      await _getTransactions();
      await _getDisputeTransactions();
      await _searchPredictions();
      await _getUsers();
    };
    txn();
  }, []);

  const _getTransactions = async () => {
    const response = await getAllTransactions();
    if (response.code === 0) {
      setTransactions(response.data);
    } else {
      // throw error
    }
  };

  const _getDisputeTransactions = async () => {
    const response = await getDisputeRequests();
    if (response.code === 0) {
      setDisputedTransactions(response.data);
    } else {
      // throw error
    }
  };

  const _searchPredictions = async () => {
    const response = await search();
    if (response.code === 0) {
      setPredictions(response.data);
    } else {
      // throw error
    }
  };

  const _getUsers = async () => {
    const response = await getAllUsers();
    if (response.code === 0) {
      setUsers(response.data);
    } else {
      // throw error
    }
  };

  return (
    <>
      <h3 className="pb-3">Dashboard</h3>
      <Row>
        <Col md={3}>
          <div className="c-card p-3 mb-3 h-100">
            <h4 className="text-muted pb-2">Transactions</h4>
            <Row>
              <Col>
                <h6 className="text-muted">Total</h6>
                <h3>{transactions.length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">This Week</h6>
                <h3>{transactions.filter((txn) => new Date(txn.txnStartDate) > DATE_MINUS_WEEK).length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">Disputes</h6>
                <h3>{disputedTransactions.length}</h3>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={3}>
          <div className="c-card p-3 mb-3 h-100">
            <h4 className="text-muted pb-2">Predictions</h4>
            <Row>
              <Col>
                <h6 className="text-muted">Total Predictions</h6>
                <h3>{predictions.length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">Pending Review</h6>
                <h3>{predictions.filter((pred) => pred.availability === "PENDING").length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">Pending Approval</h6>
                <h3>{predictions.filter((pred) => pred.availability === "APPROVED").length}</h3>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={3}>
          <div className="c-card p-3 mb-3 h-100">
            <h4 className="text-muted pb-2">Users</h4>
            <Row>
              <Col>
                <h6 className="text-muted">Customers</h6>
                <h3>{users.filter((user) => user.userType === "USER").length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">Exchangers</h6>
                <h3>{users.filter((user) => user.userType === "EXCHANGER").length}</h3>
              </Col>
              <Col>
                <h6 className="text-muted">admins</h6>
                <h3>{users.filter((user) => user.userType === "ADMIN").length}</h3>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={3}>
          <div className="c-card p-3 mb-3 h-100">
            <h4 className="text-muted pb-2">All Transactions</h4>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
