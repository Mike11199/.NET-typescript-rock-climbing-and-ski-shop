import { Spinner } from "react-bootstrap";

export const ProductDetailsLoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          marginBottom: "1rem",
        }}
      >
        Loading product details...
      </div>
      <Spinner
        as="span"
        animation="border"
        variant="primary"
        role="status"
        aria-hidden="true"
      />
    </div>
  );
};

