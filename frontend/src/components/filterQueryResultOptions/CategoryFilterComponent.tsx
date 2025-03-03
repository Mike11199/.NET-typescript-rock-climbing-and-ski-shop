import { useSelector } from "react-redux";
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
    <div>
      <strong>Category</strong>
      <div>
        {categories.map((category, idx) => (
          <div key={idx} style={{display:"flex", gap: "0.5rem"}}>
            <input
              type="checkbox"
              id={`check-api2-${idx}`}
              checked={category?.name === categoryFromFilter}
              onChange={() => setCategoryFromFilter(category?.name)}
            />
            <label
              htmlFor={`check-api2-${idx}`}
              style={{ cursor: "pointer" }}
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilterComponent;
