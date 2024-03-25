import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";
import { StoredUserInfo } from "../types"

export interface registerUserRequest {
  email: string;
  name: string;
  lastName?: string;
  password: string;
}

export interface registerUserResponse {
  success: string;
  userCreated: StoredUserInfo;
}

// passed to RegisterPageComponent - which implements error handling
export const registerUserApiRequest = async ({name, lastName, email, password}: registerUserRequest): Promise<registerUserResponse> => {
  const { data } = await axios.post<registerUserResponse>("/apiv2/users/register", {name, lastName, email,password,});
  sessionStorage.setItem("userInfo", JSON.stringify(data?.userCreated))
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

