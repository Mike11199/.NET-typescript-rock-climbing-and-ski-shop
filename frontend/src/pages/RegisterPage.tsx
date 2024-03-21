import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

export interface registerUserRequest {
  email: string;
  name: string;
  lastName?: string;
  password: string;
}

// passed to RegisterPageComponent - which implements error handling
export const registerUserApiRequest = async ({name, lastName, email, password}: registerUserRequest): Promise<any> => {
  const { data } = await axios.post("/apiv2/users/register", {name, lastName, email,password,});
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

