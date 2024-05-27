import { Rating } from "react-simple-star-rating";
import { Form } from "react-bootstrap";
import { Fragment } from "react";

const RatingFilterComponent = ({ setRating, rating }) => {
  return (
    <>
      <span className="fw-bold">Minimum Rating</span>
      {Array.from({ length: 4 }).map((_, idx) => {
        const ratingIndex = 4 - idx;

        return (
          <Fragment key={idx}>
            <Form.Check type="checkbox" id={`check-api-${idx}`}>
              <Form.Check.Input
                type="checkbox"
                isValid
                onChange={() =>
                  setRating((prev) =>
                    prev == ratingIndex ? undefined : ratingIndex,
                  )
                }
                checked={ratingIndex === rating}
              />
              <Form.Check.Label style={{ cursor: "pointer" }}>
                <div
                  style={{ display: "flex", alignItems: "end", gap: "1rem" }}
                >
                  <Rating
                    readonly
                    onClick={() => null}
                    size={20}
                    ratingValue={ratingIndex}
                  />
                </div>
              </Form.Check.Label>
            </Form.Check>
          </Fragment>
        );
      })}
    </>
  );
};

export default RatingFilterComponent;
