import { createStore, combineReducers,applyMiddleware } from "redux";
import {composeWithDevTools } from 'redux-devtools-extension'
import { counterReducer } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from "./reducers/userReducers";
import thunk from "redux-thunk"

const reducer = combineReducers({
    cart: counterReducer,
    userRegisterLogin: userRegisterLoginReducer
})

const middleware = [thunk]
const store = createStore(
    reducer, 

    
    {cart:{value: 0}}, 
    
    
    composeWithDevTools(applyMiddleware(...middleware)))


export default store;

