
import { Product } from "types";
import { Image } from "react-bootstrap";


const ProductDetailsImagesContainer = ({ product }: {product: Product | undefined}) => {
  return (
    <div>
      {product?.images?.map((image, id) => (
        <div style={{ marginBottom: "2rem" }} key={id}>
          <Image
            crossOrigin="anonymous"
            fluid
            src={image?.imageUrl ?? ""}
            style={{
              filter: "drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.7))",
              padding: "4rem",
              background: "rgba(0, 0, 0, 0.082)",
              borderRadius: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.103)",
            }}
          />
          <br />
        </div>
      ))}
    </div>
  );
};

export default ProductDetailsImagesContainer;
