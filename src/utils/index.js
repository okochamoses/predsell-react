import moment from "moment";

export default {
  get24hrTime: (date) => {
    return date ? moment(date).format("HH:mm") : null;
  },

  getDayMonth: (date) => {
    return date ? moment(date).format("DD MMM") : null;
  },

  getCustomDate: (date, format) => {
    return moment(date).format(format);
  },

  toCurrency: (amount) => {
    return (amount).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  },
  getQueryParam: (name) => {
    return new URLSearchParams(window.location.search).get(name);
  },
  addDays: (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  addSeconds: (date, seconds) => {
    var result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  }
};
