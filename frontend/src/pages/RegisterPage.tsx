import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";
import { LoggedInOrRegisteredUserResponse } from "../types"

export interface registerUserRequest {
  email: string;
  name: string;
  lastName?: string;
  password: string;
}

// passed to RegisterPageComponent - which implements error handling
export const registerUserApiRequest = async ({name, lastName, email, password}: registerUserRequest): Promise<LoggedInOrRegisteredUserResponse> => {
  const { data } = await axios.post<LoggedInOrRegisteredUserResponse>("/apiv2/users/register", {name, lastName, email,password,});
  sessionStorage.setItem("userInfo", JSON.stringify(data?.userLoggedIn))
  sessionStorage.setItem("token", JSON.stringify(data?.token))
  if (data?.success === "User created") window.location.href = "/user"
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

