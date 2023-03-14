import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const SubmitButton = ({ loading, children, ...rest }) => {
  return (
    <Button disabled={loading} {...rest}>
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            variant="light"
          />
          &nbsp;
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
