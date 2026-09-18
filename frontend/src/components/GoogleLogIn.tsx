import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setReduxUserState } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toastError } from "../../src/utils/ToastNotifications";
import "./GoogleLogIn.css";

const GoogleLoginButton = ({ googleLogin, reduxDispatch }) => {
  const navigate = useNavigate();
  const onSuccess = async (res) => {
    let token = res.credential;
    try {
      const data = await googleLogin(token);
      if (data?.success !== "user logged in" || !data?.userLoggedIn) {
        console.log(
          "Error! Bad google log in.  Please make sure you are registered first.",
        );
        toastError(
          "Error logging in with Google Oauth2.0.  Please Register manually first.",
        );
        throw Error("Error with google login.");
      }
      if (data.userLoggedIn) {
        reduxDispatch(setReduxUserState(data.userLoggedIn));
      }
      navigate("/user", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const onFailure = async () => {
    toastError(
      "Error logging in with Google Oauth2.0.  Please Register manually first.",
    );
  };

  const [divWidth, setDivWidth] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = divRef.current;
    if (!container) return;
    const handleResize = () => {
      // Google supports at most 400 CSS pixels, even on wider screens.
      setDivWidth(
        Math.min(400, Math.floor(container.getBoundingClientRect().width)),
      );
    };

    handleResize();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(handleResize);
      observer.observe(container);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* //https://console.cloud.google.com/  */}
      <GoogleOAuthProvider clientId="421793135719-tbnlgi65j46cc3oo2j74eot1ou5tg06n.apps.googleusercontent.com">
        <div
          ref={divRef}
          className="google-login-button"
          style={{
            width: "100%",
            maxWidth: 400,
            minWidth: 0,
            minHeight: 40,
            marginInline: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {divWidth > 0 && (
            <GoogleLogin
              width={String(divWidth)}
              theme={"filled_black"}
              onSuccess={onSuccess}
              onError={onFailure}
            />
          )}
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;
