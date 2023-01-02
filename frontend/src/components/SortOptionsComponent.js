import { Form } from "react-bootstrap";

const SortOptionsComponent = () => {
  return (
    // source is from:  https://react-bootstrap.netlify.app/forms/select/#default
    <Form.Select aria-label="Default select example">
      <option>SORT BY</option>
      {/* underscores to later use with MongoDB to split string */}
      <option value="price_1">Price: Low To High</option>
      <option value="price_-1">Price: High To Low</option>
      <option value="rating_-1">Customer Rating</option>
      <option value="name-1">Name A-Z</option>
      <option value="name-1">Name Z-A</option>
    </Form.Select>
  );
};

export default SortOptionsComponent;
