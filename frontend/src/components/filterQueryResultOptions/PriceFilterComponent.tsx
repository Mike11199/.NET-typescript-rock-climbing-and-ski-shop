import { Form } from "react-bootstrap";

const PriceFilterComponent = ({ price, setPrice }) => {
  const handleChange = (e) => {
    setPrice(e.target.value);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{fontWeight: "bold" }}>
          Price no greater than: $
        </span>
        <Form.Control
          type="number"
          min={10}
          max={4000}
          step={5}
          value={price}
          onChange={handleChange}
          className="price-filter-input-field"
        />
      </div>

      <div className="mt-1">
        <Form.Range
          min={10}
          max={4000}
          step={5}
          value={price}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PriceFilterComponent;
