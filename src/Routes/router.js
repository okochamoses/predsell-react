import React from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import { isUserAuthenticated, getLoggedInUser } from "../utils/authUtils";
import NotFound from "..//screens/Others/404"

const Home = React.lazy(() => import("../screens/Home"));

// AUTH PAGES
const Login = React.lazy(() => import("../screens/Auth/Login"));
const Register = React.lazy(() => import("../screens/Auth/Register"));
const twoFA = React.lazy(() => import("../screens/Auth/2FA"));
const SportsPredictions = React.lazy(() => import("../screens/SportsPredictions"));
const LotteryPredictions = React.lazy(() => import("../screens/LotteryPredictions"));
const MakePrediction = React.lazy(() => import("../screens/MakePrediction"));
const Predictions = React.lazy(() => import("../screens/Predictions"));
const Promotions = React.lazy(() => import("../screens/Promotions"));
const Deposit = React.lazy(() => import("../screens/Deposit"));
const Withdraw = React.lazy(() => import("../screens/Withdraw"));
const Dashboard = React.lazy(() => import("../screens/Dashboard"));
const Settings = React.lazy(() => import("../screens/Settings"));
const Transactions = React.lazy(() => import("../screens/Transactions"));
const BuyPrediction = React.lazy(() => import("../screens/BuyPrediction"));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
      {...rest}
      render={(props) => {
          if (!isUserAuthenticated()) {
              // not logged in so redirect to login page with the return url
              return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
          }

          const loggedInUser = getLoggedInUser();
          console.log("YAYAYAYYAYAY!!! SOMETHING WONG")
          console.log(roles.indexOf(loggedInUser.role.toUpperCase()))
          console.log(loggedInUser.role.toUpperCase())
          console.log(roles && roles.indexOf(loggedInUser.role.toUpperCase()) === -1)
          // check if route is restricted by role
          if (roles.indexOf(loggedInUser.role.toUpperCase()) === -1) {
              // role not authorised so redirect to home page
              return <Route to={{ pathname: '/' }} component={NotFound} />;
          }


          // authorised so return component
          return <Component {...props} />;
      }}
  />
);

// root routes
const rootRoute = {
  path: "/",
  exact: true,
  component: Home,
  roles: ["ALL"],
  route: Route,
};

// auth routes
const loginRoute = {
  path: "/login",
  exact: true,
  component: Login,
  route: Route,
};

const registerRoute = {
  path: "/register",
  exact: true,
  component: Register,
  route: Route,
};

const twoFARoute = {
  path: "/2fa",
  exact: true,
  component: twoFA,
  route: Route,
};

const sportsPredictionsRoute = {
  path: "/sports-predictions",
  exact: true,
  component: SportsPredictions,
  route: Route,
};

const lotteryPredictionsRoute = {
  path: "/lottery-predictions",
  exact: true,
  component: LotteryPredictions,
  route: Route,
};

const makePredictionRoute = {
  path: "/make-predictions",
  exact: true,
  component: MakePrediction,
  route: Route,
};

const promotionsRoute = {
  path: "/promotions",
  exact: true,
  component: Promotions,
  route: Route,
};

const predictionsRoute = {
  path: "/predictions",
  exact: true,
  component: Predictions,
  route: PrivateRoute,
  roles: ["USER"]
};

const depositRoute = {
  path: "/deposit",
  exact: true,
  component: Deposit,
  route: PrivateRoute,
  roles: ["USER"]
};

const withdrawRoute = {
  path: "/withdraw",
  exact: true,
  component: Withdraw,
  route: PrivateRoute,
  roles: ["USER"]
};

const settingsRoute = {
  path: "/settings",
  exact: true,
  component: Settings,
  route: PrivateRoute,
  roles: ["USER"]
};

const dashboardRoute = {
  path: "/dashboard",
  exact: true,
  component: Dashboard,
  route: PrivateRoute,
  roles: ["USER"]
};

const transactionsRoute = {
  path: "/transactions",
  exact: true,
  component: Transactions,
  route: PrivateRoute,
  roles: ["USER"]
};

const buyPredictionRoute = {
  path: "/buy-prediction/:predictionId",
  exact: true,
  component: BuyPrediction,
  route: PrivateRoute,
  roles: ["USER"]
};

/**
 * All ROUTES
 */

const allRoutes = [
  rootRoute,
  loginRoute,
  registerRoute,
  twoFARoute,
  sportsPredictionsRoute,
  lotteryPredictionsRoute,
  makePredictionRoute,
  promotionsRoute,
  predictionsRoute,
  depositRoute,
  withdrawRoute,
  settingsRoute,
  dashboardRoute,
  transactionsRoute,
  buyPredictionRoute
];

export { allRoutes };
