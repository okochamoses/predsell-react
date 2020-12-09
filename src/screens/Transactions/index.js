import React, { useState, useEffect } from "react";
import { Badge, Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import DataTable from "../../components/DataTable";
import util from "../../utils";
import { getUserTransactions } from "../../services/transactions";
import utils from "../../utils";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [disputeTransactions, setDisputeTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getUserTransactions();
      if (response.code === 0) {
        const txns = response.data.reverse();
        setTransactions(txns);
        const disputes = txns.filter(txn => txn.approvalStatus === "DISPUTE");
        setDisputeTransactions(disputes)
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const tableHead = [
    { title: "Date", key: "txnStartDate" },
    { title: "Reference Number", key: "referenceNumber" },
    { title: "Amount", key: "amount" },
    { title: "Transaction Type", key: "transactionType" },
    { title: "Paga Transaction ID", key: "pagaTxnId" },
    { title: "Status", key: "approvalStatus" },
    { title: "Narration", key: "narration" },
  ];

  const dataProcess = {
    txnStartDate: (data) => utils.getCustomDate(data, "hh:mm a | DD-MM-yyyy"),
    transactionType: (data) =>
      data === "WALLET" ? <Badge variant="success">WALLET</Badge> : <Badge variant="info">PAGA</Badge>,
    approvalStatus: (data) => {
      switch (data) {
        case "PENDING":
          return <Badge variant="warning">{data}</Badge>;
        case "COMPLETED":
          return <Badge variant="success">{data}</Badge>;
        case "APPROVED":
          return <Badge variant="success">{data}</Badge>;
        case "DECLINED":
          return <Badge variant="danger">{data}</Badge>;
        case "DISPUTE":
          return <Badge variant="danger">{data}</Badge>;
        default:
          return <Badge variant="info">{data}</Badge>;
      }
    },
    amount: (data) => util.toCurrency(data),
  };

  return (
    <>
      <Container fluid>
        <div className="p-4 my-4" style={{ backgroundColor: "#FFF", borderRadius: 10 }}>
          <Row className="mt-3">
            <Col>
              <h3>Transactions</h3>
              <Tabs defaultActiveKey="transactions" id="uncontrolled-tab-example">
                <Tab eventKey="transactions" title="Transactions">
                  <DataTable tableHead={tableHead} data={transactions} dataProcess={dataProcess} loading={loading} />
                </Tab>
                <Tab eventKey="disputes" title="Disputes">
                  { loading ? 
                      <i className="fa fa-circle-o-notch fa-spin text-danger"></i> :
                      <DataTable tableHead={tableHead} data={disputeTransactions} dataProcess={dataProcess} />
                  }
                </Tab>
              </Tabs>

              {/* {transactions.map((transaction) => (
                <div className="table-card">
                  <div className="table-card-item">
                    <span>Reference Number</span>
                    <span className="text-muted">{transaction.referenceNumber}</span>
                  </div>
                  <div className="table-card-item">
                    <span>In Escrow</span>
                    <span className="float-right">
                      {transaction.inEscrow ? (
                        <Badge variant="success">True</Badge>
                      ) : (
                        <Badge variant="danger">false</Badge>
                      )}
                    </span>
                  </div>
                  <div className="table-card-item">
                    <span>Amount</span>
                    <span className="text-muted">{util.toCurrency(transaction.amount)}</span>
                  </div>

                  <div className="table-card-item">
                    <span>Narration</span>
                    <div className="m-4"></div>
                    <span className="text-muted float-right text-justify">{transaction.narration}</span>
                  </div>
                </div>
              ))} */}
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Transactions;
