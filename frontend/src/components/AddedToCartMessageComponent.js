import {Alert, Button, Image} from 'react-bootstrap'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const AddedToCartMessageComponent = () => {

    const [show, setShow] = useState(true);
    //https://react-bootstrap.github.io/components/alerts#dismissing


      return (
        <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>The product was added to your cart!</Alert.Heading>
          <p>
            <Button variant="success">Go back</Button>{" "}
            <Link to="/cart">
              <Button variant="danger">Go to cart</Button>
            </Link>            
          </p>
        </Alert>
      )
}

export default AddedToCartMessageComponent