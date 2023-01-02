import { Form } from "react-bootstrap";

const PriceFilterComponent = () => {
  return (
    <>
    {/* https://react-bootstrap.netlify.app/forms/range/#overview */}      
      <Form.Label>
        <span className="fw-bold">Price no greater than: </span>
        $500
      </Form.Label>
      <Form.Range min={10} max={1000} step={10} />
    </>
  );
};

export default PriceFilterComponent;
