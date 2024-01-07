import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import GoogleLoginButton from "components/GoogleLogIn";
import toast, { Toaster } from "react-hot-toast";
import IceClimbingPhoto from "images/ski_mountaineering_5.png";
import IceCavePhoto from "images/ice_cave_2.png";
import "mobileStyles.css";
import { AxiosResponse } from "axios";

interface LoginPageComponentProps {
  loginUserApiRequest: (
    email: string,
    password: string,
    doNotLogout: boolean
  ) => Promise<any>;
  reduxDispatch?: Function;
  setReduxUserState: Function;
  googleLogin?: (googleToken: string) => Promise<AxiosResponse<any>>;
}

interface LoginUserResponse {
  success: string;
  error: string;
  loading: boolean;
}

const LoginPageComponent = ({
  loginUserApiRequest,
  reduxDispatch,
  setReduxUserState,
  googleLogin,
}: LoginPageComponentProps) => {
  const [LogInUserResponseState, setLogInUserResponseState] =
    useState<LoginUserResponse>({
      success: "",
      error: "",
      loading: false,
    });
  const [loginWithDefaultUser, setLoginWithDefaultUser] = useState(false);

  //event handler for form submission
  const handleSubmit = async (event) => {
    console.log("submitting");
    event.preventDefault();
    event.stopPropagation();

    let form = event.currentTarget.elements;
    let email = form.email.value;
    let password = form.password.value;
    let doNotLogout = form.doNotLogout.checked;

    if (loginWithDefaultUser) {
      email = "test@test.com";
      password = "easy_to_guess_password";
    }

    if (email === "" || password === "") {
      toastError("Please provide all form values!");
      return;
    }

    setLogInUserResponseState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const res = await loginUserApiRequest(email, password, doNotLogout);
      if (!res?.userLoggedIn) throw Error;

      setLogInUserResponseState({
        success: res?.success,
        loading: false,
        error: "",
      });
      reduxDispatch!(setReduxUserState(res?.userLoggedIn));
      toastSuccess("Logging you in!");
      return redirectUserOrAdminAfterLogin(res);
    } catch (er: any) {
      setLogInUserResponseState((prevState) => ({
        ...prevState,
        error: er?.response?.data?.message ?? "error",
      }));
      setLogInUserResponseState((prevState) => ({
        ...prevState,
        loading: false,
      }));
      toastError("Error logging in!  Wrong credentials.");
      return shakeDivById("formBasicPassword");
    }
  };

  const displaySpinner = () => {
    if (LogInUserResponseState && LogInUserResponseState.loading === true) {
      return (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      );
    } else {
      return "";
    }
  };

  return (
    <>
      <Toaster />
      <img
        className="ski_image"
        alt="ice_climbing_photo"
        src={IceClimbingPhoto}
      ></img>
      <div style={{ display: "flex", height: "100%" }}>
        <img
          className="ice_cave_image"
          alt="ice_climbing_photo"
          src={IceCavePhoto}
        ></img>
      </div>
      <div style={{ display: "flex", height: "100%" }}>
        <Container style={{ maxWidth: "100%", marginTop: "5%" }}>
          <Row className="mt-5">
            <Col md={5}></Col>
            <Col
              md={3}
              id="log_in_page_form_1"
              className="pr-md-2"
              style={{ maxWidth: "100%", marginRight: "2%" }}
            >
              <h1>Login</h1>
              {/* Initial state of form validation is False */}
              <Form noValidate onSubmit={handleSubmit} id="loginInForm">
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
                <Form.Group
                  className="mb-3"
                  controlId="formBasicPassword"
                  id="formBasicPassword"
                >
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
                    label="Keep me logged in"
                    defaultChecked
                  />
                </Form.Group>

                {/* Link to Register Instead */}
                <Row className="pb-2">
                  <Col>
                    Don't have an account? &nbsp; 👉 &nbsp;
                    <Link to={"/register"}>
                      <strong>Register</strong>
                    </Link>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "230px" }}
                  >
                    {displaySpinner()}
                    Login
                  </Button>
                  <Button
                    variant="danger"
                    type="submit"
                    style={{ width: "230px", marginTop: "20px" }}
                    onClick={(e) => {
                      setLoginWithDefaultUser(true);
                    }}
                  >
                    Demo Login
                  </Button>
                  <GoogleLoginButton
                    googleLogin={googleLogin}
                    reduxDispatch={reduxDispatch}
                  />
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoginPageComponent;

function toastError(text: string) {
  toast.dismiss();
  toast.error(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
  });
}

function toastSuccess(text: string) {
  toast.dismiss();
  toast.success(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
  });
}

/**
 * Redirects the user or admin to the appropriate page after a successful login.
 *
 * @param {any} res - The response object from the login API request.
 * @returns {void}
 */
function redirectUserOrAdminAfterLogin(res: any) {
  if (res?.success === "user logged in" && !res?.userLoggedIn?.isAdmin) {
    setTimeout(function () {
      window?.location?.assign("/user");
    }, 1000);
  } else {
    setTimeout(function () {
      window?.location?.assign("/admin/orders");
    }, 1000);
  }
}

function shakeDivById(id: string): void {
  const formControl = document?.querySelector(`#${id}`);
  if (formControl) {
    formControl?.classList.add("shake");
    formControl?.addEventListener("animationend", () => {
      formControl?.classList.remove("shake");
    });
  }
}
