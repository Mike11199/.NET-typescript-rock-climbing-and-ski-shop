import { Button } from "react-bootstrap";

interface RemoveFromCartComponentProps {
  orderCreated: boolean;
  productID: any;
  quantity: any;
  price: any;
  removeFromCartHandler: any;
}

const RemoveFromCartComponent = ({ productID, orderCreated, quantity, price, removeFromCartHandler = false }: RemoveFromCartComponentProps) => {
    return (
       <Button
       disabled={orderCreated}
       type="button"
       variant="secondary"
       onClick={removeFromCartHandler ? () => removeFromCartHandler(productID, quantity, price) : undefined}
       >
         <i className="bi bi-trash"></i>
       </Button>
    )
}

export default RemoveFromCartComponent;
