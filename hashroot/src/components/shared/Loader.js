import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = ({ height, width }) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        height: height || "100vh",
        width: width || "100vw",
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;
