import { LOGIN_USER } from "../constants/userConstants";


export const setReduxUserState = (userCreated) => (dispatch) => {

    dispatch({
        type: LOGIN_USER,
        payload: userCreated
    })
}
