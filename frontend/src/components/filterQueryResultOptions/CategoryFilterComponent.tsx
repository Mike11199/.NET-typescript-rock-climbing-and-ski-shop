import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { ReduxAppState } from "types";

const CategoryFilterComponent = ({
  setCategoryFromFilter,
  categoryFromFilter,
  queryParamCategoryName,
}) => {
  const { categories } = useSelector(
    (state: ReduxAppState) => state.getCategories,
  );

  return (
    <>
      <span className="fw-bold">Category</span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx}>
            <Form.Check type="checkbox" id={`check-api2-${idx}`}>
              <Form.Check.Input
                type="checkbox"
                checked={category?.name === categoryFromFilter}
                onChange={() => setCategoryFromFilter(category?.name)}
              />
              <Form.Check.Label style={{ cursor: "pointer", color: "#137b28" }}>
                {category.name}
              </Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
