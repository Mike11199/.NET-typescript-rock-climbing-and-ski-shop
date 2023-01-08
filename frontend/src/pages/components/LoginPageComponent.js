import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import GoogleLoginButton from "../../components/GoogleLogIn";


const LoginPageComponent = ({ loginUserApiRequest, reduxDispatch, setReduxUserState, googleLogin }) => {

  //react state for form - if validated or not
  const [validated, setValidated] = useState(false)
  

  const [LogInUserResponseState, setLogInUserResponseState] = useState(
      {success:"", error:"", loading: false}
  )

  const navigate = useNavigate()
    
  //event handler for form submission
  const handleSubmit = async (event) => {
    
    event.preventDefault()
    event.stopPropagation()
    
    const form = event.currentTarget.elements;
    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;

    //if form is valid, send request to back end to log in.  catch errors.
    if (event.currentTarget.checkValidity() === true && email && password) {

        setLogInUserResponseState({loading: true})

        try {
          const res = await loginUserApiRequest(email, password, doNotLogout)
          console.log(res)
          setLogInUserResponseState({success: res.success, loading: false, error: ""})
          setValidated(true)

          // this dispatches the setReduxUserState action that is passed from the LoginPage.js component
          // the action is passed to the userReducer to update global state the the user data
          if (res.userLoggedIn) {
            reduxDispatch(setReduxUserState(res.userLoggedIn))
          }

          if (res.success === "user logged in" && !res.userLoggedIn.isAdmin){
            navigate("/user", {replace: true})
          }else{
            navigate("/admin/orders", {replace: true})  //replace: true means react deletes history of web page switch
          }

          
        } catch (er) {
          setLogInUserResponseState({error: er.response.data.message ? er.response.data.message : er.response.data})
        }
    }}


  const displaySpinner = () =>{
    if(LogInUserResponseState && LogInUserResponseState.loading === true){
      return <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
    }
    else{
      return ""
    }    
  }


  return (
    <Container>
      <Row className="mt-5 justify-content-md-center">
        <Col md={6}>
          <h1>Login</h1>

          {/* Initial state of form validation is False */}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            
            {/* Email */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            {/* Checkbox to extend JWT to 7 days */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Do not logout"
              />
            </Form.Group>

            {/* Link to Register Instead */}
            <Row className="pb-2">
              <Col>
                Don't you have an account?
                <Link to={"/register"}> Register </Link>
              </Col>
            </Row>

            {/* Submit Button */}
            <div width="300px">
            <Button variant="primary" type="submit"  style={{width:'230px'}}>             
            {displaySpinner()}
              Login
            </Button>
            <GoogleLoginButton googleLogin={googleLogin}/>
            </div>

            {/* Alert to show if wrong credentials -- wrong credentials string is the API response from server - userController.js if error*/}
            <Alert show={LogInUserResponseState && LogInUserResponseState.error ==="wrong credentials"} variant="danger">
              Wrong credentials
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPageComponent
