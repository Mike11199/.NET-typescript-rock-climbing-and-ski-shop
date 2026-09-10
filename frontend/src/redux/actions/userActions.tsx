import { LOGIN_USER, LOGOUT_USER } from "../constants/userConstants";
import { Dispatch } from "redux";
import { StoredUserInfo } from "types";

export const setReduxUserState =
  (userCreated: boolean | StoredUserInfo) => (dispatch: Dispatch) => {
    dispatch({
      type: LOGIN_USER,
      payload: userCreated,
    });
  };

export const logout = () => (dispatch) => {
  // clear local storage of user info and cart items on logout
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  localStorage.removeItem("cart");

  // clear user info from redux state on logout
  dispatch({ type: LOGOUT_USER });
  document.location.href = "/login";
};
