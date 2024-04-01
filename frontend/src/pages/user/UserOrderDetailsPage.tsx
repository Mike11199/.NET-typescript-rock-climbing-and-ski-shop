import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent";
import { useSelector } from "react-redux";
import axios from 'axios'
import { loadScript } from "@paypal/paypal-js"
import { StoredUserInfo, ReduxAppState } from "types";


// GET Request to retrieve order based on id in URL - error-handling in page component itself
// this function is passed and called from within the page component
const getOrder = async (orderId) => {
    const { data } = await axios.get("/apiv2/orders/user/" + orderId);
    console.log('order items or cart data log')
    console.log(data)
    return data;
}

// Paypal script to work with SDK using sandbox
// this function is passed and called from within the component

// business - sb-1gtla24828028@business.example.com  ; password = testtest
// personal - sb-yhuyo24828035@personal.example.com  ; password = testtest

const loadPayPalScript = async (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
    try {
        const paypal = await loadScript(
          {"client-id": "AXBC2IGDVF_ZQyQYrhAVa8UIs_OIvV8d2Q8LI6gsG7fCqQt4OjgOy4ijgibC5KGVXq0oeG39s6qt2aca"})  // this is ok to expose

          if (paypal?.Buttons !== undefined){
            paypal?.Buttons(buttons(cartSubtotal, cartItems, orderId, updateStateAfterOrder)).render("#paypal-container-element")
          }

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

                // this is the paypal response obj - look at it to see if order is APPROVED and amount matches cart
                let transaction = orderData.purchase_units[0].payments.captures[0]


                if (transaction.status === "COMPLETED" && Number(transaction.amount.value) === Number(cartSubtotal)) {
                    updateOrder(orderId)  //API should also do verification
                    .then(data =>{
                        if(data?.isPaid) {
                            updateStateAfterOrder(data?.paidAt)
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

// marks the order as paid
const updateOrder = async(orderId) => {
    const { data } = await axios.put("/apiv2/orders/user/pay-order/" + orderId)
    return data
}


const onErrorHandler = () => {
    console.log('onErrorHandler')
}


const UserOrderDetailsPage = () => {

    //get user info from redux global state
    const userInfo = useSelector((state: ReduxAppState) => state.userRegisterLogin.userInfo as StoredUserInfo);

    //error-handling in page component itself
    const getUser = async () => {
        const { data } = await axios.get("/apiv2/users/profile/" + userInfo.userId);
        return data;
    }
          //pass functions for API requests to component and state
  return <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadPayPalScript={loadPayPalScript} />;
};

export default UserOrderDetailsPage;

