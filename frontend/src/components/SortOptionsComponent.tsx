enum SortOption {
  PriceAsc = "price_asc",
  PriceDesc = "price_desc",
  RatingDesc = "rating_desc",
  RatingAsc = "rating_asc",
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
        <option value={SortOption.PriceAsc}>Price - Asc</option>
        <option value={SortOption.PriceDesc}>Price - Desc</option>
        <option value={SortOption.RatingDesc}>Rating - Desc</option>
        <option value={SortOption.RatingAsc}>Rating - Asc</option>
        <option value={SortOption.NameAsc}>Name - Asc</option>
        <option value={SortOption.NameDesc}>Name - Desc</option>
      </select>
    </div>
  );
};

export default SortOptionsComponent;
