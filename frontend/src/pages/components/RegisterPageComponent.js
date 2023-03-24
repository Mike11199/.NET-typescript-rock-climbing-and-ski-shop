import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";


const RegisterPageComponent = ({registerUserApiRequest, reduxDispatch, setReduxUserState}) => {


  //local react state values
  const [validated, setValidated] = useState(false);
  const [registerUserResponseState, setRegisterUserResponseState] = useState({success: "", error: "", loading: false})
  const [passwordsMatchState, setPasswordsMatchState] = useState(true);


  //onChange handler to ensure that passwords match
  const onChange = () => {
    
    //grab values from form
    const password = document.querySelector("input[name=password]")
    const confirmPassword = document.querySelector("input[name=confirmPassword]")

    // set state value if values match.  state value used elsewhere to mark form valid/invalid
    if (confirmPassword.value === password.value) {
      setPasswordsMatchState(true);
    } else {
      setPasswordsMatchState(false);
    }
  }


  // form submission to submit registration request to API and error handling 
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const email = form.email.value;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const password = form.password.value;
    if (
      event.currentTarget.checkValidity() === true &&
      email &&
      password &&
      name &&
      lastName &&
      form.password.value === form.confirmPassword.value
    ) {
      setRegisterUserResponseState({ loading: true });
      registerUserApiRequest(name, lastName, email, password)
        .then((data) => {
          setRegisterUserResponseState({
            success: data.success,
            loading: false,
          });
          reduxDispatch(setReduxUserState(data.userCreated));
          
        })
        .catch((er) =>
          setRegisterUserResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>

          <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            

            {/* NAME - FIRST NAME */}
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your first name"
                name="name"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a name
              </Form.Control.Feedback>
            </Form.Group>
            

            {/* NAME - LAST NAME */}
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Your last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your last name"
                name="lastName"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>


            {/* EMAIL ADDRESS */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address
              </Form.Control.Feedback>
            </Form.Group>


            {/* PASSWORD */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid password
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Password should have at least 6 characters
              </Form.Text>
            </Form.Group>


            {/* REPEAT PASSWORD */}
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                required
                type="password"
                placeholder="Repeat Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
              />
              <Form.Control.Feedback type="invalid">
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            {/* LINK TO LOGIN PAGE */}
            <Row className="pb-2">
              <Col>
                Do you have an account already?
                <Link to={"/login"}> Login </Link>
              </Col>
            </Row>

            {/* SUBMIT BUTTON */}
            <Button type="submit">

              {/* CONDITIONALLY DISPLAY THE SPINNER IF LOADING */}
              {registerUserResponseState && registerUserResponseState.loading === true ? 
              (<Spinner as="span"animation="border" size="sm "role="status" aria-hidden="true"/>) : ( "" )}
              
              Submit
            </Button>

            {/* ALERT IF EMAIL ALREADY EXISTS IN DATABASE */}
            <Alert show={registerUserResponseState && registerUserResponseState.error === "user exists"} variant="danger">
              User with that email already exists!
            </Alert>

            {/* ALERT ON SUCCESSFUL USER CREATION */}
            <Alert show={registerUserResponseState && registerUserResponseState.success === "User created"} variant="info">
              User created
            </Alert>

          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPageComponent

