import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import IceClimbingPhoto from "../../images/ski_mountaineering_5.png";
import IceCavePhoto from "../../images/ice_cave_2.png";
import "../../../src/mobileStyles.css";
import { AxiosResponse } from "axios";
import GoogleLoginButton from "../../../src/components/GoogleLogIn";
import { useWindowWidth } from "@react-hook/window-size";
import { Toaster } from "react-hot-toast";
import {
  toastSuccess,
  toastError,
} from "../../../src/utils/ToastNotifications";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    doNotLogout: true,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //event handler for login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!loginWithDefaultUser) setValidated(true);

    let form = event.currentTarget.elements;
    let email = form.email.value;
    let password = form.password.value;
    let doNotLogout = form.doNotLogout.checked;

    // ok to expose credentials - API won't allow profile edits for test user
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

  const LoadingSpinner = () => {
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

  const windowWidth = useWindowWidth();
  const isMobileView = windowWidth <= 600;
  const [validated, setValidated] = useState<boolean>(false);

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
        />
      </div>

      <div className="login-container">
        <Form
          className="register-form"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h1>Login</h1>

          {/* EMAIL ADDRESS */}
          <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
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
          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="formBasicPassword"
              className="custom-input-group-field"
              name="password"
              required
              type="password"
              placeholder="Password"
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid password.
            </Form.Control.Feedback>
          </Form.Group>

          {/* OPTION TO KEEP USER LOGGED IN IF THEY NAVIGATE FROM SITE */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              className="custom-input-group-field"
              name="doNotLogout"
              type="checkbox"
              checked={formData.doNotLogout}
              onChange={handleChange}
            />
            <label>Keep me logged in</label>
          </div>

          {/* LINK TO LOGIN PAGE */}
          <Row className="pb-2 mt-2 mb-4">
            <Col>
              Don't have an account? &nbsp; 👉 &nbsp;
              <Link to={"/register"}>
                <strong>Register</strong>
              </Link>
            </Col>
          </Row>

          <div className="button-group">
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Login
                <LoadingSpinner />
              </div>
            </Button>
            <Button
              style={{ width: "100%" }}
              variant="danger"
              type="submit"
              onClick={(e) => {
                setLoginWithDefaultUser(true);
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Demo Login
                <LoadingSpinner />
              </div>
            </Button>
            <GoogleLoginButton
              googleLogin={googleLogin}
              reduxDispatch={reduxDispatch}
            />
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginPageComponent;

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
