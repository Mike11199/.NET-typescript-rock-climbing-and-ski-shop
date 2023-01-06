
<h1>Summary</h1>

- A full stack e-commerce web application using the MERN (MongoDB, Express.js, React.js, Node.js) stack.  
- Used Redux to manage global state as opposed to context in past projects.

<br/>

<h1> PayPal Payment Integration </h1>

- Used the Paypal SDK to simulate live payment of an order from the store. 
- Referenced PayPal documentation to pass order details such as the order total and products to PayPal.
  - https://developer.paypal.com/sdk/js/reference/#createorder
  
- Created business/personal PayPal sandbox accounts with fake credit/debit cards, and account balances to simulate a real order.
- On a successful response from the Paypal API, the order is marked as paid in the MongoDB database.  An admin must later mark the product as delivered manually.

<br/>
<br/>

![storeGif1](https://user-images.githubusercontent.com/91037796/211115640-cd6b2af0-b670-45f9-a01b-c51b9888f107.gif)

<br/>



