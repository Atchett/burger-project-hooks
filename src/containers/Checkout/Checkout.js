import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

const Checkout = (props) => {
  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const purchased = useSelector((state) => state.order.purchased);

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };

  const checkoutContinueHandler = () => {
    props.history.replace("/checkout/contact-data");
  };

  let summary = <Redirect to="/" />;
  const purchasedRedirect = purchased ? <Redirect to="/" /> : null;
  if (ings) {
    summary = (
      <Fragment>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinue={checkoutContinueHandler}
        />
        <Route
          path={props.match.path + "/contact-data"}
          component={ContactData}
        />
      </Fragment>
    );
  }
  return <div>{summary}</div>;
};

export default Checkout;
