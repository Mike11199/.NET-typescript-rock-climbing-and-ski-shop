import { Form } from "react-bootstrap";

enum SortOption {
  PriceAsc = "price_asc",
  PriceDesc = "price_desc",
  RatingDesc = "rating_desc",
  NameAsc = "name_asc",
  NameDesc = "name_desc",
}

const SortOptionsComponent = ({ setSortOption }) => {
  return (
    <Form.Select
      onChange={(e) => setSortOption(e.target.value)}
      aria-label="Default select example"
    >
      <option>SORT BY</option>
      <option value={SortOption.PriceAsc}>Price: Low To High</option>
      <option value={SortOption.PriceDesc}>Price: High To Low</option>
      <option value={SortOption.RatingDesc}>Customer Rating</option>
      <option value={SortOption.NameAsc}>Name A-Z</option>
      <option value={SortOption.NameDesc}>Name Z-A</option>
    </Form.Select>
  );
};

export default SortOptionsComponent;
