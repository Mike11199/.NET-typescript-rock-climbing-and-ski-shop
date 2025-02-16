import { useState } from "react";
import { Trash, Trash2 } from "lucide-react"; // Import both icons

interface RemoveFromCartComponentProps {
  orderCreated: boolean;
  productId: any;
  quantity: any;
  price: any;
  removeFromCartHandler: any;
}

const RemoveFromCartComponent = ({
  productId,
  orderCreated,
  quantity,
  price,
  removeFromCartHandler = false,
}: RemoveFromCartComponentProps) => {
  const [hovered, setHovered] = useState(false);

  if (orderCreated) return <></>;

  return (
    <button
      disabled={orderCreated}
      type="button"
      className="trash_button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={
        removeFromCartHandler
          ? () => removeFromCartHandler(productId, quantity, price)
          : undefined
      }
    >
      {hovered ? <Trash2 size={18} /> : <Trash size={18} />}
    </button>
  );
};

export default RemoveFromCartComponent;
