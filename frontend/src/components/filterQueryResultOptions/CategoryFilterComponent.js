import { Form } from "react-bootstrap";

const CategoryFilterComponent = () => {
  return (
    // https://react-bootstrap.netlify.app/forms/checks-radios/#default-stacked
    <>
    <span className="fw-bold">Category</span>
    <Form>
      {Array.from({length: 5}).map((_, idx) => (
       
       <div key={idx} >
          <Form.Check type="checkbox" id={`check-api2-${idx}`}>
            <Form.Check.Input type="checkbox"  isValid />
            <Form.Check.Label style={{cursor: "pointer"}}>Category - {idx}</Form.Check.Label>
          </Form.Check>
        
        </div>
      ))}
    </Form>
    </>
  );
};

export default CategoryFilterComponent;
