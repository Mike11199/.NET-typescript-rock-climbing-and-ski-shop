import { Container, Row, Col, Form, Button} from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import GoogleLoginButton from "components/GoogleLogIn";
import toast, { Toaster } from 'react-hot-toast';
import IceClimbingPhoto from "images/ski_mountaineering_5.png"
import IceCavePhoto from "images/ice_cave_2.png"
import "mobileStyles.css"


const LoginPageComponent = ({ loginUserApiRequest, reduxDispatch, setReduxUserState, googleLogin }) => {

  //react state for form - if validated or not
  const [validated, setValidated] = useState(false)  
  const [LogInUserResponseState, setLogInUserResponseState] = useState(
      {success:"", error:"", loading: false}
  )

  //event handler for form submission
  const handleSubmit = async (event) => {
    
    event.preventDefault()
    event.stopPropagation()
    
    const form = event.currentTarget.elements
    const email = form.email.value
    const password = form.password.value
    const doNotLogout = form.doNotLogout.checked


    if ( email === '' || password === ''){
      toast.dismiss();  //https://react-hot-toast.com/docs/toast
      toast.error('Please provide all form values.',{style: {borderRadius: '10px',background: '#333',color: '#fff'}})
      return
    }

    // If form is valid, send request to back end
    if (event.currentTarget.checkValidity() === true && email && password) {

        setLogInUserResponseState({loading: true})

        try {
          const res = await loginUserApiRequest(email, password, doNotLogout)
          console.log(res)
          
          setLogInUserResponseState({success: res.success, loading: false, error: ""})
          setValidated(true)

          // Dispatch the setReduxUserState action that is passed from the LoginPage.js component
          // The action is passed to the userReducer to update global state with the the user data
          if (res.userLoggedIn) {
            reduxDispatch(setReduxUserState(res.userLoggedIn))
          }

          toast.dismiss();
          toast.success('Logging you in!',{style: {borderRadius: '10px', background: '#333', color: '#fff',},})          

          // redirect to user or admin page depending on if user has admin privileges
          if (res.success === "user logged in" && !res.userLoggedIn.isAdmin){
            setTimeout(function() {window.location.assign('/user')}, 1000)     
          }else{
            setTimeout(function() {window.location.assign('/admin/orders')}, 1000)
          }
          return          
        } 
        catch (er) {
          const errorMessage = er?.response?.data?.message ?? 'error'
          setLogInUserResponseState({ error: errorMessage })
          toast.dismiss();
          toast.error('Error logging in!  Wrong credentials.', { style: {borderRadius: '10px',background: '#333',color: '#fff',},})
          

          // shake password box 
          const formControl = document.querySelector('#formBasicPassword');
          formControl.classList.add('shake')
          formControl.addEventListener('animationend', () => {
              formControl.classList.remove('shake');
          })
          return
        }
    }

    // If form is not valid, run shake animation and exit
    toast.dismiss()
    toast.error('Error logging in!  Wrong credentials.',{style: {borderRadius: '10px', background: '#333',color: '#fff'},})

    // shake password box 
    const formControl = document.querySelector('#formBasicPassword');
    formControl.classList.add('shake')
    formControl.addEventListener('animationend', () => {
    formControl.classList.remove('shake')
    })

    return
  }



  const displaySpinner = () =>{
    if(LogInUserResponseState && LogInUserResponseState.loading === true){
      return <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
    }
    else{
      return ""
    }
  }

  return (
    <>
    <Toaster/>
    <img className="ski_image" alt="ice_climbing_photo" src={IceClimbingPhoto} ></img>
    <div style={{display:"flex", height:"100%"}}>
    <img className="ice_cave_image" alt="ice_climbing_photo" src={IceCavePhoto} ></img>
    </div>
    <div style={{display:"flex", height:"100%"}}>
    <Container style={{maxWidth:"100%", marginTop:"5%" }} >
      <Row className="mt-5">
        <Col md={5} ></Col>
        <Col md={3} id="log_in_page_form_1" className="pr-md-2" style={{maxWidth:"100%", marginRight:"2%" }} >
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
            <Form.Group className="mb-3" controlId="formBasicPassword" id="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>

            {/* Checkbox to extend JWT to 7 days */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox" >
              <Form.Check
                name="doNotLogout"
                type="checkbox"
                label="Keep me logged in."
                defaultChecked
              />
            </Form.Group>

            {/* Link to Register Instead */}
            <Row className="pb-2">
              <Col>
                Don't have an account? &nbsp; 👉 &nbsp;
                <Link to={"/register"}><strong>Register</strong></Link>
              </Col>
            </Row>

            {/* Submit Button */}
            <div width="300px">
            <Button variant="primary" type="submit"  style={{width:'230px'}}>
            {displaySpinner()}
              Login
            </Button>
            <GoogleLoginButton googleLogin={googleLogin} reduxDispatch={reduxDispatch}/>
            </div>

          </Form>
        </Col>
      </Row>
    </Container>
    </div>
    </>
  )
}

export default LoginPageComponent
