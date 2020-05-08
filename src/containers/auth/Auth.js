import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import { updateObject, checkValidity } from "../../shared/index";

const Auth = (props) => {
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const buildingBurger = useSelector((state) => state.burgerBuilder.building);
  const authRedirectPath = useSelector((state) => state.auth.authRedirectPath);

  const dispatch = useDispatch();
  const onAuth = (email, password, isSignup) =>
    dispatch(actions.auth(email, password, isSignup));
  const onSetAuthRedirectPath = useCallback(
    () => dispatch(actions.setAuthRedirectPath("/")),
    [dispatch]
  );

  const [isSignUp, setIsSignUp] = useState(true);
  const [controls, setControls] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Email address",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid email.",
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid password.",
    },
  });

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true,
      }),
    });
    setControls(updatedControls);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    onAuth(controls.email.value, controls.password.value, isSignUp);
  };

  const switchAuthModeHandler = (event) => {
    event.preventDefault();
    setIsSignUp(!isSignUp);
  };

  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key],
    });
  }
  let form = formElementsArray.map((formElement) => (
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
  ));

  if (loading) {
    form = <Spinner />;
  }

  let errorMessage = null;
  if (error) {
    errorMessage = <p>{error.message}</p>;
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={authRedirectPath} />;
  }

  return (
    <div>
      <form className={classes.Auth} onSubmit={submitHandler}>
        {authRedirect}
        {errorMessage}
        {form}
        <Button btnType="Success">LOGIN</Button>
        <Button clicked={switchAuthModeHandler} btnType="Danger">
          SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
