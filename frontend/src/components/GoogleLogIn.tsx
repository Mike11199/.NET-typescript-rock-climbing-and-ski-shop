import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setReduxUserState } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = ({ googleLogin, reduxDispatch }) => {
  const navigate = useNavigate();
  const onSuccess = async (res) => {
    let token = res.credential;
    const data = await googleLogin(token);

    if (data.userLoggedIn) {
      reduxDispatch(setReduxUserState(data.userLoggedIn));
    }
    if (data.success === "user logged in" && !data.userLoggedIn.isAdmin) {
      navigate("/user", { replace: true });
    } else {
      navigate("/admin/orders", { replace: true }); //replace: true means react deletes history of web page switch
    }
  };

  const onFailure = (res) => {
    console.log("Login Failed! res: ", res);
  };

  return (
    <div style={{ justifyContent: "center", marginTop: "20px" }}>
      {/* //https://console.cloud.google.com/  */}
      <GoogleOAuthProvider clientId="421793135719-tbnlgi65j46cc3oo2j74eot1ou5tg06n.apps.googleusercontent.com">
        <GoogleLogin
          width="max"
          text="signin_with"
          theme="filled_black"
          onSuccess={onSuccess}
          onError={() => onFailure}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;
