import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios/axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

import Order from "../../components/Order/Order";
import Spinner from "../../components/UI/Spinner/Spinner";

const Orders = (props) => {
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const onFetchOrders = useCallback(
    (token, userId) => dispatch(actions.fetchOrders(token, userId)),
    [dispatch]
  );

  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);

  let ordersInt = <Spinner />;
  if (!loading) {
    ordersInt = orders.map((order) => (
      <Order
        key={order.id}
        ingredients={order.ingredients}
        price={+order.price}
      />
    ));
  }
  return <div>{ordersInt}</div>;
};

export default withErrorHandler(Orders, axios);
