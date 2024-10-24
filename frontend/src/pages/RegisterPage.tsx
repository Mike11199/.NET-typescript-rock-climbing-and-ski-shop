import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";
import { LoggedInOrRegisteredUserResponse } from "../types";

export interface registerUserRequest {
  email: string;
  name: string;
  lastName?: string;
  password: string;
}

export const registerUserApiRequest = async ({
  name,
  lastName,
  email,
  password,
}: registerUserRequest): Promise<LoggedInOrRegisteredUserResponse> => {
  const { data } = await axios.post<LoggedInOrRegisteredUserResponse>(
    "/apiv2/users/register",
    { name, lastName, email, password },
  );

  // localStorage.clear();
  sessionStorage.clear();
  if (data.userLoggedIn.doNotLogout) {
    localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn));
    localStorage.setItem("token", data.token);
  } else {
    sessionStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn));
    sessionStorage.setItem("token", data.token);
  }

  return data;
};

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
