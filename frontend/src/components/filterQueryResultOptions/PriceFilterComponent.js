import { Form } from "react-bootstrap";

const PriceFilterComponent = () => {
  return (
    <>
    {/* https://react-bootstrap.netlify.app/forms/range/#overview */}
      <Form.Label>Range</Form.Label>
      <Form.Range />
    </>
  );
};

export default PriceFilterComponent;
