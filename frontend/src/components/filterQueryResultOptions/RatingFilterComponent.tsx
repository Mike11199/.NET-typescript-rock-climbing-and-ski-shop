import { Rating } from "react-simple-star-rating";

const RatingFilterComponent = ({ setRating, rating }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <strong>Minimum Rating</strong>
      {Array.from({ length: 4 }).map((_, idx) => {
        const ratingIndex = 4 - idx;
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
              gap: "0.5rem",
              margin: 0,
            }}
          >
            <input
              type="checkbox"
              onChange={() =>
                setRating((prev) =>
                  prev === ratingIndex ? undefined : ratingIndex
                )
              }
              checked={ratingIndex === rating}
            />
            <Rating
              readonly
              size={20}
              ratingValue={ratingIndex}
              onClick={() => null}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RatingFilterComponent;
