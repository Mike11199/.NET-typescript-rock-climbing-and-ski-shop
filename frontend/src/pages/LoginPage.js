import LoginPageComponent from "./components/LoginPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux"
import { setReduxUserState } from "../redux/actions/userActions";

const loginUserApiRequest = async (email, password, doNotLogout) => {
    
    const { data } = await axios.post("/api/users/login", { email, password, doNotLogout });
    
    if (data.userLoggedIn.doNotLogout){
      localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    } else {
      sessionStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    }
    return data
}

const googleLogin = async (google_token) => {      

    const token_request = {token: google_token}
    const {data} = await axios.post('/api/users/loginGoogle', token_request)     //post request going to our backend
    const {user, location} = data                        //destructure the response object returned from axios
    console.log(data)
    localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    return data

}


const LoginPage = () => {
  
  const reduxDispatch = useDispatch()
  return <LoginPageComponent loginUserApiRequest={loginUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} googleLogin={googleLogin}/>
};

export default LoginPage;


