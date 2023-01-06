import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import axios from 'axios'
import { loadScript } from "@paypal/paypal-js"


//error-handling in page component itself
const getOrder = async (orderId) => {
    const { data } = await axios.get("/api/orders/user/" + orderId);
    return data;
}


const UserOrderDetailsPage = () => {
    
    //get user info from redux global state
    const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

    //error-handling in page component itself
    const getUser = async () => {
        const { data } = await axios.get("/api/users/profile/" + userInfo._id);
        return data;
    }
          //pass functions for API requests to component and state
  return <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadScript={loadScript} />;
};

export default UserOrderDetailsPage;

