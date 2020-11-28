import { post, get } from "./api";
import { isUserAuthenticated } from "../utils/authUtils";

export const search = async (startDate, endDate, type, userId) => {
  try {
    if (isUserAuthenticated()) {
      return await post("/prediction/search-auth", { startDate, endDate, type, userId });
    } else {
      return await post("/prediction/search", { startDate, endDate, type, userId });
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const searchPending = async (startDate, endDate, type, userId) => {
  try {
    return await post("/prediction/search", { startDate, endDate, type, userId });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getPredictionById = async (predictionId) => {
  try {
    return await get(`/prediction/${predictionId}`);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const buyPrediction = async (predictionId) => {
  try {
    console.log("Some")
    return await post(`/prediction/${predictionId}/buy`, {});
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const promotePrediction = async (predictionId) => {
  try {
    return await post(`/prediction/promote`, { predictionId });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createSportsPrediction = async (
  price,
  bookingNumber,
  bookMaker,
  promotionsAllowed,
  promotionsPercentage
) => {
  try {
    return await post(`/prediction/sports/predict`, {
      price,
      bookingNumber,
      bookMaker,
      promotionsAllowed,
      promotionsPercentage,
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createLotteryPrediction = async (
  price,
  lotteryEntryGroup,
  category,
  lotteryNumbers,
  promotionsAllowed,
  promotionPercentage
) => {
  try {
    return await post(`/prediction/lottery/predict`, {
      price,
      lotteryEntryGroup,
      category,
      lotteryNumbers,
      promotionsAllowed,
      promotionPercentage
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSportsBookmakers = async () => {
  try {
    return await get(`/prediction/sports/bookmakers`);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getLotteryCategories = async () => {
  return await get("/prediction/lottery/categories");
};

export const getUserPromotions = async () => {
  return await get("/prediction/promotions");
};

//
export const declinePrediction = async (predictionId, reason) => {
  return await post(`/prediction/sports/${predictionId}/decline`, { reason });
};

export const approvePrediction = async (predictionId, startTime, endTime, estimatedOdds) => {
  return await post(`/prediction/sports/${predictionId}/accept`, { startTime, endTime, estimatedOdds });
};

export const successfulPrediction = async (predictionId) => {
  return await post(`/prediction/sports/${predictionId}/success`, {});
};

export const failedPrediction = async (predictionId) => {
  return await post(`/prediction/sports/${predictionId}/failed`, {});
};

export const getAvailableLotteryEntries = async () => {
  return await get(`/prediction/lottery/entries`);
};

export const approveLotteryEntry = async (winningNumbers, lotteryEntryGroup) => {
  return await post(`/prediction/lottery/approve`, { winningNumbers, lotteryEntryGroup });
};

export const deletePrediction = async (predictionId) => {
  return await post(`/prediction/${predictionId}/delete`, {});
};
