import { LOGIN_USER, LOGOUT_USER } from "../constants/userConstants";
import axios from "axios";
import { Dispatch } from "redux";
import { StoredUserInfo } from "types";


export const setReduxUserState = (userCreated: boolean | StoredUserInfo) => (dispatch: Dispatch) => {

    dispatch({
        type: LOGIN_USER,
        payload: userCreated
    })
}

export const logout = () => (dispatch) => {

     //move to logout page
    document.location.href = "/login"

    // call server to remove JWT token from cookies using API
    axios.get('/api/logout')

    // clear local storage of user info and cart items on logout
    localStorage.removeItem('userInfo')
    sessionStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    localStorage.removeItem('cart')

    // clear user info from redux state on logout
    dispatch({ type: LOGOUT_USER })

}