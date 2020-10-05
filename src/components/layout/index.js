// @flow
import React, { Component, Suspense } from "react";
import { connect } from "react-redux";

import { isUserAuthenticated } from "../../utils/authUtils";
// import * as layoutConstants from '../constants/layout';

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => <div>
  LOADING
</div>;

// All layouts/containers
const AuthLayout = React.lazy(() => import("./AuthLayout"));
const UserLayout = React.lazy(() => import("./UserLayout"));
// const VerticalLayout = React.lazy(() => import('../layouts/Vertical'));
// const HorizontalLayout = React.lazy(() => import('../layouts/Horizontal'));

/**
 * Exports the component with layout wrapped to it
 * @param {} WrappedComponent
 */
const withLayout = (WrappedComponent) => {
  const HOC = class extends Component {
    /**
     * Returns the layout component based on different properties
     */
    getLayout = () => {
      if (!isUserAuthenticated()) {
        return AuthLayout;
      } else {
        return UserLayout;
      }
    };

    render() {
      const Layout = this.getLayout();
      return (
        <Suspense fallback={loading()}>
          <Layout {...this.props}>
            <WrappedComponent {...this.props} />
          </Layout>
        </Suspense>
      );
    }
  };

  const mapStateToProps = (state) => {
    return {
      layout: state.Layout,
    };
  };

  return connect(mapStateToProps, null)(HOC);
};

export default withLayout;
