import React, { Fragment } from "react";
import Modal from "../../components/UI/Modal/Modal";
import useHttpErrorHandler from "../../hooks/httpErrorHandler";

const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, setClearError] = useHttpErrorHandler(axios);

    return (
      <Fragment>
        <Modal show={error} modalClosed={setClearError}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />;
      </Fragment>
    );
  };
};

export default withErrorHandler;
