import UserProfilePageComponent from "./components/UserProfilePageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setReduxUserState } from "../../redux/actions/userActions";
import apiURL from "../../utils/ToggleAPI";

const updateUserApiRequest = async (
  name,
  lastName,
  phoneNumber,
  address,
  country,
  zipCode,
  city,
  state,
  password
) => {
  const { data } = await axios.put("/api/users/profile", {
    name,
    lastName,
    phoneNumber,
    address,
    country,
    zipCode,
    city,
    state,
    password,
  });
  return data;
};


const fetchUser = async (id) => {
  try{
    `${apiURL}/users/profile/`
  const { data } = await axios.get( `${apiURL}/users/profile/` + id);
  return data;
  }
  catch (err) {
    console.log(err)
  }
};

const UserProfilePage = () => {
  const reduxDispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.userRegisterLogin);

  return (
    <UserProfilePageComponent
      updateUserApiRequest={updateUserApiRequest}
      fetchUser={fetchUser}
      userInfoFromRedux={userInfo}
      setReduxUserState={setReduxUserState}
      reduxDispatch={reduxDispatch}
      localStorage={window.localStorage}
      sessionStorage={window.sessionStorage}
    />
  );
};

export default UserProfilePage;

