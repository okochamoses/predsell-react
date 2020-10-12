import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer-menu">
      <Link to="dashboard" className="footer-item">
        <img src="./images/icons/dashboard.svg" alt="dashboard" width="23px" style={{ opacity: 0.5 }} />
        Dashboard
      </Link>
      <Link to="/sports-predictions" className="footer-item">
        <img src="./images/icons/ball.svg" alt="sports" width="23px" style={{ opacity: 0.5 }} />
        Sports
      </Link>
      <Link to="/lottery-predictions" className="footer-item">
        <img src="./images/icons/bingo.svg" alt="lottery" width="23px" style={{ opacity: 0.5 }} />
        Lottery
      </Link>
      <Link to="/deposit" className="footer-item">
        <img src="./images/icons/wallet.svg" alt="deposit" width="23px" style={{ opacity: 0.5 }} />
        Deposit
      </Link>
      <Link to="dashboard" className="footer-item">
        <img src="./images/icons/ticket.svg" alt="dashboard" width="23px" style={{ opacity: 0.5 }} />
        More
      </Link>
    </div>
  );
}