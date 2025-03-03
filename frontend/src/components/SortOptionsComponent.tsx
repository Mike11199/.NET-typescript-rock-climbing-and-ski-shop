enum SortOption {
  PriceAsc = "price_asc",
  PriceDesc = "price_desc",
  RatingDesc = "rating_desc",
  NameAsc = "name_asc",
  NameDesc = "name_desc",
}

const SortOptionsComponent = ({ setSortOption }) => {
  return (
    <div style={{display: "flex", width: "100%"}}>
      <select
        style={{display: "flex", width: "100%", padding: "0.245em", borderRadius: "0.25rem"}}
        onChange={(e) => setSortOption(e.target.value)}
        aria-label="Default select example"
      >
        <option>SORT BY</option>
        <option value={SortOption.PriceAsc}>Price: Low To High</option>
        <option value={SortOption.PriceDesc}>Price: High To Low</option>
        <option value={SortOption.RatingDesc}>Customer Rating</option>
        <option value={SortOption.NameAsc}>Name A-Z</option>
        <option value={SortOption.NameDesc}>Name Z-A</option>
      </select>
    </div>
  );
};

export default SortOptionsComponent;
