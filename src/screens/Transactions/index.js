import React, { useState, useEffect } from "react";
import { Badge, Container, Row, Col } from "react-bootstrap";
import MaterialTable from "material-table";
import DataTable from "../../components/DataTable";
import util from "../../utils";
import { searchTransactions } from "../../services/users";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await searchTransactions();
      if (response.code === 0) {
        const txns = response.data.reverse();
        setTransactions(txns);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const tableHead = [
    { title: "Reference Number", key: "referenceNumber" },
    { title: "Amount", key: "amount" },
    { title: "Escrow", key: "inEscrow" },
    { title: "Narration", key: "narration" },
  ];

  const dataProcess = {
    inEscrow: (data) =>
      data ? (
        <Badge variant="success">True</Badge>
      ) : (
        <Badge variant="danger">false</Badge>
      ),
    amount: (data) => util.toCurrency(data),
  };

  return (
    <>
      <Container fluid>
        <div
          className="p-4 my-4"
          style={{ backgroundColor: "#FFF", borderRadius: 10 }}
        >
          <Row className="mt-3">
            <Col>
              <h3>Transactions</h3>
              <DataTable
                tableHead={tableHead}
                data={transactions}
                dataProcess={dataProcess}
              />

              {transactions.map((transaction) => (
                <div className="table-card">
                  <div className="table-card-item">
                    <span>Reference Number</span>
                    <span className="text-muted">
                      {transaction.referenceNumber}
                    </span>
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
                    <span className="text-muted">
                      {util.toCurrency(transaction.amount)}
                    </span>
                  </div>

                  <div className="table-card-item">
                    <span>Narration</span>
                    <div className="m-4"></div>
                    <span className="text-muted float-right text-justify">
                      {transaction.narration}
                    </span>
                  </div>
                </div>
              ))}
            </Col>
          </Row>

          {/* <MaterialTable
              columns={[
                { title: "Adı", field: "name" },
                { title: "Soyadı", field: "surname" },
                { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
                {
                  title: "Doğum Yeri",
                  field: "birthCity",
                  lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
                },
              ]}
              data={[
                {
                  name: "Mehmet",
                  surname: "Baran",
                  birthYear: 1987,
                  birthCity: 63,
                },
              ]}
              title="Demo Title"
            /> */}
        </div>
      </Container>
    </>
  );
};

export default Transactions;
