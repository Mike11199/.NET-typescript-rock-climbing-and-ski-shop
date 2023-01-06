import { createStore, combineReducers,applyMiddleware } from "redux";
import {composeWithDevTools } from 'redux-devtools-extension'
import { counterReducer } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from "./reducers/userReducers";
import thunk from "redux-thunk"

const reducer = combineReducers({
    cart: counterReducer,
    userRegisterLogin: userRegisterLoginReducer
})

// this is conditional chaining - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
const userInfoInLocalStorage = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')) 
: sessionStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')) 
: {}

const INITIAL_STATE = {
    cart: {value: 0,},
    userRegisterLogin: {userInfo: userInfoInLocalStorage}
}

const middleware = [thunk]
const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)))


export default store;

