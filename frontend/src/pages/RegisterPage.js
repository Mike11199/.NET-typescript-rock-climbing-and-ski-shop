import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";


// function passed to the register page component with API request to make testing with JEST easier
const registerUserApiRequest = async (name, lastName, email, password) => {
  
  //send request to API - error handling in component itself
  const { data } = await axios.post("/api/users/register", {name, lastName, email,password,});
  sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated))
  if (data.success === "User created") window.location.href = "/user"
  return data
}



const RegisterPage = () => {
  const reduxDispatch = useDispatch();
  return (
    <RegisterPageComponent
      registerUserApiRequest={registerUserApiRequest}
      reduxDispatch={reduxDispatch}
      setReduxUserState={setReduxUserState}
    />
  );
};

export default RegisterPage;

