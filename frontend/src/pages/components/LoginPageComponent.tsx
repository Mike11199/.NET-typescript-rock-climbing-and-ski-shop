import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import IceClimbingPhoto from "../../images/ski_mountaineering_5.png";
import IceCavePhoto from "../../images/ice_cave_2.png";
import "../../../src/mobileStyles.css";
import { AxiosResponse } from "axios";
import GoogleLoginButton from "../../../src/components/GoogleLogIn";
import { Button } from "react-bootstrap";
import { useWindowWidth } from "@react-hook/window-size";

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
    doNotLogout: false,
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

    let form = event.currentTarget.elements;
    let email = form.email.value;
    let password = form.password.value;
    let doNotLogout = form.doNotLogout.checked;

    if (loginWithDefaultUser) {
      email = "test@test.com";
      password = "easy_to_guess_password"; // this doesn't matter - API won't allow test user edits
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

  const windowWidth = useWindowWidth();
  const isMobileView = windowWidth <= 600;

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
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Login</h1>
          <div className="form-group">
            <label>Email address</label>
            <input
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              id="formBasicPassword"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                name="doNotLogout"
                type="checkbox"
                checked={formData.doNotLogout}
                onChange={handleChange}
              />
              <label>Keep me logged in</label>
            </div>
            <div className="links">
              Don't have an account? 👉{" "}
              <strong>
                <Link to={"/register"}>Register</Link>
              </strong>
            </div>
          </div>
          <div className="button-group">
            <Button
              variant="primary"
              type="submit"
              style={{ width: isMobileView ? "320px" : "400px" }}
            >
              {displaySpinner()}
              Login
            </Button>
            <Button
              style={{ width: isMobileView ? "320px" : "400px" }}
              variant="danger"
              type="submit"
              onClick={(e) => {
                setLoginWithDefaultUser(true);
              }}
            >
              {displaySpinner()}
              Demo Login
            </Button>
            <GoogleLoginButton
              googleLogin={googleLogin}
              reduxDispatch={reduxDispatch}
            />
          </div>
        </form>
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
