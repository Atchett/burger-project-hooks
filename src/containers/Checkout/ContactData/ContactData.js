import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios/axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "../../../shared/index";

const ContactData = (props) => {
  const ings = useSelector((state) => state.burgerBuilder.ingredients);
  const price = useSelector((state) => state.burgerBuilder.totalPrice);
  const loading = useSelector((state) => state.order.loading);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();
  const onOrderBurger = (orderData, token) =>
    dispatch(actions.purchaseBurger(orderData, token));

  const [formIsValid, setFormIsValid] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your name",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid name.",
    },
    street: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your street",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid street.",
    },
    postCode: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your postcode",
      },
      value: "",
      validation: {
        required: true,
        minLength: 5,
        maxLength: 8,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid postcode.",
    },
    country: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your country",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid country.",
    },
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your email address",
      },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid email address.",
    },
    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" },
        ],
      },
      value: "fastest",
      validation: {},
      valid: true,
    },
  });

  const orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }

    const order = {
      ingredients: ings,
      price: price,
      orderData: formData,
      userId: userId,
    };

    onOrderBurger(order, token);
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(orderForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(
        event.target.value,
        orderForm[inputIdentifier].validation
      ),
      touched: true,
    });
    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormElement,
    });

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key],
    });
  }

  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map((formElement) => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          errorMessage={formElement.config.errorMessage}
          changed={(event) => inputChangedHandler(event, formElement.id)}
        />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );

  if (loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your contact data</h4>
      {form}
    </div>
  );
};

export default withErrorHandler(ContactData, axios);
