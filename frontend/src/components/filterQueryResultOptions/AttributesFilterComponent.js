import { Form } from "react-bootstrap";

const AttributesFilterComponent = () => {
  return (
    // https://react-bootstrap.netlify.app/forms/checks-radios/#rb-docs-content
    <>    
      <Form.Label>stuff for categories here</Form.Label>
      <Form.Check 
        type="checkbox"
        id="default-checkbox"
        label="details for categories here"
      />
    </>
  );
};

export default AttributesFilterComponent;
