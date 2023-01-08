
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from "react-redux"
import { setReduxUserState } from "../redux/actions/userActions";
import { useNavigate } from "react-router-dom";


const GoogleLoginButton = ({googleLogin}) => {

  const navigate = useNavigate()
  const reduxDispatch = useDispatch()

  const onSuccess = async (res) => {
    let token = res.credential
    console.log(res.credential)
    const data = await googleLogin(token)
    // console.log("Login Success from the Google Side! Current user: ", res)
    // console.log('api response is')
    // console.log(data)
    if (data.userLoggedIn) {
      reduxDispatch(setReduxUserState(data.userLoggedIn))
    }
    if (data.success === "user logged in" && !data.userLoggedIn.isAdmin){
      navigate("/user", {replace: true})
    }else{
      navigate("/admin/orders", {replace: true})  //replace: true means react deletes history of web page switch
    }
  }

  const onFailure = (res) => {
    console.log("Login Failed! res: ", res)
  }

return (
  <div style={{justifyContent:"center", marginTop:"20px"}}> 

  {/* //https://console.cloud.google.com/  */}
  <GoogleOAuthProvider  clientId="421793135719-tbnlgi65j46cc3oo2j74eot1ou5tg06n.apps.googleusercontent.com">
    <GoogleLogin
        width= "max"     
        buttonText="Login"
        theme="filled_black"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        className='googleButton'      
        isSignedIn={true}
    />
  </GoogleOAuthProvider>
  </div>
)}

export default GoogleLoginButton