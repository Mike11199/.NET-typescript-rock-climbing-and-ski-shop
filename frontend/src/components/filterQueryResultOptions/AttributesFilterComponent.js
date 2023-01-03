import { Form } from "react-bootstrap";

const AttributesFilterComponent = () => {
  return (
    // https://react-bootstrap.netlify.app/forms/checks-radios/#rb-docs-content
    <>    
    {[ {Color:["red", "blue", "green"]}, {RAM: ["1 TB", "2 TB"]}].map((item, idx)=>(
      
      // map Keys to form label.  category name such as color
      <div key={idx} className="mb-3">
      <Form.Label><b>{Object.keys(item)}</b></Form.Label>
     
      {/* map  items in value of each key, list of values for that attribute, to checkboxes.  for example, colors for the category color*/}
        {item[Object.keys(item)].map((i,idx2) => (
          <Form.Check type="checkbox" id={idx2} label={i} key={idx2}  />
        ))}
      
      </div>
    )
    )}
    </>
  );
};

export default AttributesFilterComponent;
