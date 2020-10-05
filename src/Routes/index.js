import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

// layout HOC
import withLayout from "../components/layout";
import { allRoutes as routes } from "./router"; 

const Routes = () => {
  return (
    // rendering the router with layout
    <BrowserRouter>
      <Switch>
        {routes.map((route, index) => {
          return (
            !route.children && (
              <route.route
                key={index}
                path={route.path}
                roles={route.roles}
                exact={route.exact}
                component={withLayout((props) => {
                  return <route.component {...props} />;
                })}
              ></route.route>
            )
          );
        })}
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
