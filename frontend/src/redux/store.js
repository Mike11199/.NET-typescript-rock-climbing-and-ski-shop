import { createStore, combineReducers,applyMiddleware } from "redux";
import {composeWithDevTools } from 'redux-devtools-extension'
import { counterReducer } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from "./reducers/userReducers";
import thunk from "redux-thunk"

const reducer = combineReducers({
    cart: counterReducer,
    userRegisterLogin: userRegisterLoginReducer
})

// this for setting initial state - get user data from local storage or session storage if there 
// only for conditional header link rendering - Use JSON web token for protected routes
const userInfoInLocalStorage = () =>{
    if(localStorage.getItem('userInfo')){
        return JSON.parse(localStorage.getItem('userInfo')) 
    }
    else if(sessionStorage.getItem('userInfo')) {
        return JSON.parse(sessionStorage.getItem('userInfo')) 
    }
    else return {}
} 

// set initial state values for redux
const INITIAL_STATE = {
    cart: {value: 0},
    userRegisterLogin: {userInfo: userInfoInLocalStorage()}
}


const middleware = [thunk]
const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)))

export default store;

