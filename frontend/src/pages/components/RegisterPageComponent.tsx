import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import RockClimbingPhoto from "../../images/climbing_inverted_2.png";
import RappelClimbingPhoto from "../../images/rappel_5.png";
import { registerUserRequest } from "pages/RegisterPage";
import { LoggedInOrRegisteredUserResponse } from "types";
import { Toaster } from "react-hot-toast";
import {
  toastSuccess,
  toastError,
} from "../../../src/utils/ToastNotifications";

const RegisterPageComponent = ({
  registerUserApiRequest,
  reduxDispatch,
  setReduxUserState,
}) => {
  //local react state values
  const [validated, setValidated] = useState<boolean>(false);
  const [registerUserResponseState, setRegisterUserResponseState] =
    useState<any>({ success: "", error: "", loading: false });
  const [passwordsMatchState, setPasswordsMatchState] = useState<boolean>(true);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(true);
  const navigate = useNavigate();

  //onChange handler to ensure that passwords match
  const onChange = () => {
    //grab values from form
    const password: HTMLInputElement | null = document.querySelector(
      "input[name=password]"
    );
    const confirmPassword: HTMLInputElement | null = document.querySelector(
      "input[name=confirmPassword]"
    );
    // check here if password and confirm passwords match and if password requirements are met
    const passwordsBothMatch =
      (confirmPassword &&
        password &&
        confirmPassword?.value === password?.value) ??
      false;
    setPasswordsMatchState(passwordsBothMatch);

    // regex to test password validity
    const specialCharacters = /[!@#$%^&*]/;
    const containsDigit = /\d/;
    const containsLetter = /[a-zA-Z]/;

    const isPasswordValid =
      password?.value?.length !== undefined &&
      password?.value?.length > 6 &&
      containsDigit.test(password?.value) &&
      containsLetter.test(password?.value) &&
      specialCharacters.test(password?.value);

    setPasswordIsValid(isPasswordValid);
  };

  // form submission handler for registration request - includes error handling
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

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
      try {
        setRegisterUserResponseState({ loading: true });
        const registerRequest = {
          name,
          lastName,
          email,
          password,
        } as registerUserRequest;
        const data: LoggedInOrRegisteredUserResponse =
          await registerUserApiRequest(registerRequest);
        setRegisterUserResponseState({
          success: data?.success,
          loading: false,
        });
        reduxDispatch(setReduxUserState(data?.userLoggedIn));
        if (data?.success === "New user registered!") {
          toastSuccess("Registered user.");
          setTimeout(function () {
            navigate("/user");
          }, 1000);
        }
      } catch (er: any) {
        const errMessage = er?.response?.data?.message ?? er?.response?.data
        setRegisterUserResponseState({
          error: errMessage,
        });
        console.error(errMessage)
        toastError(`Error registering user: \n ${errMessage}`);
      }
    } else {
      toastError("Please ensure all form fields are correctly filled out.");
    }
  };

  const LoadingSpinner = () => {
    return (
      registerUserResponseState?.loading === true && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )
    );
  };

  return (
    <>
      <Toaster />
      <div style={{ display: "flex" }}>
        <div>
          <img
            className="rock_inverted_photo"
            style={{ flexShrink: "0" }}
            alt="rock_climbing_photo"
            src={RockClimbingPhoto}
          ></img>
        </div>
        <div className="register-container">
          <Form
            className="register-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>Register</h1>
            {/* NAME - FIRST NAME */}
            <Form.Group className="mb-3 mt-4" controlId="validationCustom01">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className="custom-input-group-field"
                required
                type="text"
                placeholder="Enter your first name"
                name="name"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your first name.
              </Form.Control.Feedback>
            </Form.Group>

            {/* NAME - LAST NAME */}
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Your last name</Form.Label>
              <Form.Control
                className="custom-input-group-field"
                required
                type="text"
                placeholder="Enter your last name"
                name="lastName"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please enter your last name.
              </Form.Control.Feedback>
            </Form.Group>

            {/* EMAIL ADDRESS */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="custom-input-group-field"
                name="email"
                required
                type="email"
                placeholder="Enter email"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="custom-input-group-field"
                name="password"
                required
                type="password"
                placeholder="Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordIsValid}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid password.
              </Form.Control.Feedback>
            </Form.Group>

            {/* REPEAT PASSWORD */}
            <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                className="custom-input-group-field"
                name="confirmPassword"
                required
                type="password"
                placeholder="Repeat Password"
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordsMatchState}
                autoComplete="off"
              />
              <Form.Text className="text-muted">
                Password must be at least six characters long and include a
                number, letter, and a special character (!@#$%^&*).
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Both passwords should match.
              </Form.Control.Feedback>
            </Form.Group>

            {/* LINK TO LOGIN PAGE */}
            <Row className="pb-2">
              <Col>
                Have an account already? &nbsp; 👉 &nbsp;
                <Link to={"/login"}>
                  <strong>Login</strong>
                </Link>
              </Col>
            </Row>

            {/* SUBMIT BUTTON */}
            <Button type="submit" style={{ marginTop: "1rem" }}>
              {/* CONDITIONALLY DISPLAY THE SPINNER IF LOADING */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Submit
                <LoadingSpinner />
              </div>
            </Button>

            {/* ALERT IF EMAIL ALREADY EXISTS IN DATABASE */}
            <Alert
              show={
                registerUserResponseState &&
                registerUserResponseState.error === "user exists"
              }
              variant="danger"
            >
              User with that email already exists!
            </Alert>

            {/* ALERT ON SUCCESSFUL USER CREATION */}
            <Alert
              show={
                registerUserResponseState &&
                registerUserResponseState.success === "User created"
              }
              variant="info"
            >
              User created
            </Alert>
          </Form>
        </div>
        <div style={{ display: "flex", height: "100%" }}>
          <img
            className="rappel_image"
            alt="rappel_image"
            src={RappelClimbingPhoto}
          ></img>
        </div>
      </div>
    </>
  );
};

export default RegisterPageComponent;
