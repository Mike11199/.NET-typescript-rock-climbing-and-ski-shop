import {Alert, Button, Image} from 'react-bootstrap'
import { useState } from 'react';

const AddedToCartMessageComponent = () => {

    const [show, setShow] = useState(true);
    //https://react-bootstrap.github.io/components/alerts#dismissing


      return (
        <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>
      )
}

export default AddedToCartMessageComponent