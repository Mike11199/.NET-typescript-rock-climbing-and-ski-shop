import { Button } from "react-bootstrap";

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
  return (
    <Button
      disabled={orderCreated}
      type="button"
      variant="secondary"
      onClick={
        removeFromCartHandler
          ? () => removeFromCartHandler(productId, quantity, price)
          : undefined
      }
    >
      <i className="bi bi-trash"></i>
    </Button>
  );
};

export default RemoveFromCartComponent;
