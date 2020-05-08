import React, { useEffect, lazy, Suspense, useCallback } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/auth/Logout/Logout";
import * as actions from "./store/actions/index";

const Checkout = lazy(() => {
  return import("./containers/Checkout/Checkout");
});

const Orders = lazy(() => {
  return import("./containers/Orders/Orders");
});

const Auth = lazy(() => {
  return import("./containers/auth/Auth");
});

const App = (props) => {
  const dispatch = useDispatch();

  const onAutoSignup = useCallback(() => dispatch(actions.authCheckState()), [
    dispatch,
  ]);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);

  useEffect(() => {
    onAutoSignup();
  }, [onAutoSignup]);

  let routes = (
    <Switch>
      <Route path="/auth" render={(props) => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );
  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={(props) => <Auth {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </Layout>
  );
};

export default App;
