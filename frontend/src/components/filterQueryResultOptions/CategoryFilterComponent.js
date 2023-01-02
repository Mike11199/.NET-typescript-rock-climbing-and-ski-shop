import { Form } from "react-bootstrap";

const CategoryFilterComponent = () => {
  return (
    // https://react-bootstrap.netlify.app/forms/checks-radios/#default-stacked
    <Form>
      {["checkbox", "radio"].map((type) => (
        <div key={type} className="mb-3">
          <Form.Check type={type} id={`check-api-${type}`}>
            <Form.Check.Input type={type} isValid />
            <Form.Check.Label>{`Custom api ${type}`}</Form.Check.Label>
            <Form.Control.Feedback type="valid">
              You did it!
            </Form.Control.Feedback>
          </Form.Check>
        </div>
      ))}
    </Form>
  );
};

export default CategoryFilterComponent;
