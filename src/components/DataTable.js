import React, { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";

const DataTable = ({ tableHead = [], data = [], dataProcess = [], location }) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [dataObj, setdataObj] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPaageSize] = useState(5);
  useEffect(() => {

    const d = renderPagination();

    setPaginatedData(d[pageNumber] ? d[pageNumber] : d[1]);
  }, [data, pageNumber]);

  const renderPagination = () => {
    const dataObj = { 1: [] };
    // if (data.length > pageSize) {
      data.forEach((i, idx) => {
        const value = Math.floor(idx / pageSize) + 1;
  
        if (idx % pageSize !== 0) {
          dataObj[value] = [...dataObj[value], i];
        } else {
          dataObj[value] = [i];
        }
      });
    // } else {

    // }
    setdataObj(dataObj);
    return dataObj;
  };
  // head, body
  return (
    <>
      <Table responsive className="table-striped2">
        <thead>
          <tr>
            {tableHead.map((head, idx) => {
              return <th key={idx}>{head.title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, idx) => {
            return (
              <tr key={idx}>
                {tableHead.map((head) => {
                  return <td>{dataProcess[head.key] ? dataProcess[head.key](item[head.key]) : item[head.key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination className="float-right">
        <Pagination.First onClick={() => setPageNumber(1)} />
        <Pagination.Prev disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}/>
        {
        Object.keys(dataObj).map((d) => (
          <Pagination.Item onClick={() => setPageNumber(d/1)} active={pageNumber == d}>{d/1}</Pagination.Item>
        ))}
        <Pagination.Next disabled={pageNumber === Math.round(data.length / pageSize)} onClick={() => setPageNumber(pageNumber + 1)} />
        <Pagination.Last onClick={() => setPageNumber(Math.round(data.length / pageSize))}/>
      </Pagination>
    </>
  );
};

export default DataTable;
