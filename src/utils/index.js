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
    return (amount / 100).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  },
  getQueryParam: (name) => {
    return new URLSearchParams(window.location.search).get(name);
  },
};
