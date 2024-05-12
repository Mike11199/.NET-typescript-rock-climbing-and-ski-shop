import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { setReduxUserState } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useWindowWidth } from "@react-hook/window-size";

const GoogleLoginButton = ({ googleLogin, reduxDispatch }) => {
  const navigate = useNavigate();
  const onSuccess = async (res) => {
    let token = res.credential;
    try {
      const data = await googleLogin(token);
      if (data === undefined) {
        console.log(
          "Error! Bad google log in.  Please make sure you are registered first."
        );
        toastError(
          "Error logging in with Google Oauth2.0.  Please Register manually first."
        );
        throw Error("Error with google login.");
      }
      if (data.userLoggedIn) {
        reduxDispatch(setReduxUserState(data.userLoggedIn));
      }
      if (data.success === "user logged in" && !data.userLoggedIn.isAdmin) {
        navigate("/user", { replace: true });
      } else {
        navigate("/admin/orders", { replace: true }); //replace: true means react deletes history of web page switch
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFailure = async () => {
    toastError(
      "Error logging in with Google Oauth2.0.  Please Register manually first."
    );
  };

  function toastError(text: string) {
    toast.dismiss();
    toast.error(text, {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  }

  
  const windowWidth = useWindowWidth();
  const isMobileView = windowWidth <= 600;

  return (
    <div>
      {/* //https://console.cloud.google.com/  */}
      <GoogleOAuthProvider clientId="421793135719-tbnlgi65j46cc3oo2j74eot1ou5tg06n.apps.googleusercontent.com">
        <GoogleLogin
          width={ isMobileView ? "320" : "1000"}
          theme={"filled_black"}
          onSuccess={onSuccess}
          onError={onFailure}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;
