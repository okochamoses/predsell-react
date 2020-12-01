import { post, get } from "./api";

export const initiateDeposit = async (amount) => {
  try {
    return await post("/transactions/deposit/initiate", { amount });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const searchTransactions = async (startDate, endDate) => {
  try {
    return await post("/users/transactions", { startDate, endDate });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const addDepositTxnId = async (info, transactionId, referenceNumber) => {
  try {
    return await post("/transactions/deposit/completed", {
      info,
      transactionId,
      referenceNumber,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const initiateWithdraw = async (amount) => {
  try {
    return await post("/transactions/withdraw/initiate", { amount });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getActiveExchangerRequests = async () => {
  try {
    return await post("/transactions/exchangers/active", {});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getDisputeRequests = async () => {
  try {
    return await post("/transactions/exchangers/dispute", {});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const settleDisputeRequests = async (referenceNumber, winningParty) => {
  try {
    return await post("/transactions/dispute/settle", {referenceNumber, winningParty});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getAllTransactions = async () => {
  try {
    return await get("/transactions", {});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getUserTransactions = async () => {
  try {
    return await get("/transactions/user", {});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const processActiveExchangerRequest = async (referenceNumber, approve, pagaTxnId) => {
  try {
    return await post("/transactions/deposit/process", {
      referenceNumber,
      approve,
      pagaTxnId
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};
