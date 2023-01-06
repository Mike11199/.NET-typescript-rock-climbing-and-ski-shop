import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import axios from 'axios'
import { loadScript } from "@paypal/paypal-js"


//error-handling in page component itself
const getOrder = async (orderId) => {
    const { data } = await axios.get("/api/orders/user/" + orderId);
    return data;
}

const loadPayPalScript = async (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    try {
        const paypal = await loadScript(
          {"client-id": "AXBC2IGDVF_ZQyQYrhAVa8UIs_OIvV8d2Q8LI6gsG7fCqQt4OjgOy4ijgibC5KGVXq0oeG39s6qt2aca"})                       
        paypal.Buttons(buttons(cartSubtotal, cartItems, orderId, updateStateAfterOrder)).render("#paypal-container-element")
          
      } catch (error) {
        console.error("failed to load Paypal JS script!!", error)
      }
}

const buttons = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    return {
        // https://developer.paypal.com/sdk/js/reference/#createorder
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: cartSubtotal,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: cartSubtotal,
                                }
                            }
                        },
                        items: cartItems.map(product => {
                            return {
                               name: product.name,
                                unit_amount: {
                                   currency_code: "USD", 
                                   value: product.price,
                                },
                                quantity: product.quantity,
                            }
                        })
                    }
                ]
            })
        },
        onCancel: onCancelHandler,

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {

                console.log(orderData)

                let transaction = orderData.purchase_units[0].payments.captures[0]
             
                if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {                 
                    updateOrder(orderId)
                    .then(data =>{
                        if(data.isPaid) {
                            updateStateAfterOrder(data.paidAt)
                        }
                    })
                }
            })
        },
        onError: onErrorHandler,
    }
}

const onCancelHandler = () => {
    console.log('onCancelHandler')
}

const updateOrder = async(orderId) => {
    console.log('order id is ' + orderId)    
    const { data } = await axios.put("/api/orders/paid/" + orderId)
    return data
}


const onErrorHandler = () => {
    console.log('onErrorHandler')
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
  return <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadPayPalScript={loadPayPalScript} />;
};

export default UserOrderDetailsPage;

