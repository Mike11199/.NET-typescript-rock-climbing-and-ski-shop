import {Rating} from 'react-simple-star-rating'
import Form from 'react-bootstrap/Form';
import { Fragment } from 'react';  //this for key


const RatingFilterComponent = () => {
  // https://www.npmjs.com/package/react-simple-star-rating
  //https://react-bootstrap.netlify.app/forms/checks-radios/#customizing-formcheck-rendering
  return (
    <>    
    <span className='fw-bold'>Rating</span>
    {Array.from({length: 5}).map((_, idx) => (
        <Fragment key={idx}>
          <Form>
              <Form.Check type="checkbox" id={`check-api-${idx}`}>
                <Form.Check.Input type="checkbox" isValid />
                <Form.Check.Label style={{cursor: "pointer"}}>
                <Rating readonly size={20} initialValue={5 - idx} />
                </Form.Check.Label>          
                <Form.Control.Feedback type="valid">
                </Form.Control.Feedback>
              </Form.Check>          
          </Form>
        </Fragment>

    ))}

  </>
  );
};

export default RatingFilterComponent;
