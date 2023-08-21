<h1>Live Website</h1>

- https://recreational-equipment-shop.herokuapp.com/

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/a43e3526-8814-4c67-ae01-f37700468012)

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/6ea92f24-d4a7-43d8-a305-ff517d31dace)

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/57850923-072d-42a9-a0be-49e360e40bcc)



- Use the following for both username and password at login for testing (or create a new account):    
  - Username: test@gmail.com
  - Password: test@gmail.com

- Use the following user and password to test the fake PayPal sandbox account to pay for an order (fake account with bank/credit cards):
  - Username: sb-yhuyo24828035@personal.example.com
  - Password: testtest

<h1>Summary</h1>

- A full stack e-commerce web application using the MERN stack (MongoDB, Express.js, React.js, Node.js).  

- Added the PayPal SDK and sandbox accounts to simulate live payment of an order and front/back end response of a submitted order.

- Added an admin dashboard that only is displayed if a user is an admin, so that an entire new area of the site is rendered.  This Admin area includes components to add new products, edit products, mark orders as delivered, and other tasks (such as deleting products or responding to user chats), without having to directly access the MongoDB database.

- Implemented Socket.IO to allow for bi-directional client and server communication, to enable real-time messaging between an admin and multiple users. 

- Used the Cloudinary service to allow an Admin to upload and delete images of a product.  Links to Cloudinary are stored in MongoDB and fetched as needed.  

- Used Cloudinary AI Background Removal to dynamically remove background of images when redux dark mode state variable is set (later removed due to rate limit).

- Used Redux store/actions/reducers to manage global state as opposed to context in past projects (job tracker).

- Created various database relationships between collections in MongoDB using embedded documents (storing object IDs in other documents). For example, a product has an array of reviews in MongoDB, each a foreign key pointing to a review document, allowing for a one-to-many relationship between products and reviews.

- Added Google OAuth2.0 Log In, decoding JWT credentials from Google, and locating the user by email in MongoDB to verify the user. 

- Modified order controller to update inventory counts upon placing an order in the MongoDB database.  Front end also now advises if a product is low in stock.

<br/>

<h1> Screenshots & GIFs </h1>

- Dark Mode (NEW)

<br/>

![image](https://user-images.githubusercontent.com/91037796/227739396-17ed80e0-afdc-49c7-85d0-fd963d604da8.png)

<br/>

- GIF #1 - User placing an order from the cart:

<br/>



![placeOrder4K_4](https://user-images.githubusercontent.com/91037796/227748705-6cc4e68a-1dab-4904-bacb-753d67c9fcf3.gif)

<br/>
<br/>

- GIF #2 - Sorting products (boots) by price and looking at the product details page component:

<br/>


![sortProducts_2](https://user-images.githubusercontent.com/91037796/227748961-8c466dbf-cac4-4780-97db-775ce5ae9fc9.gif)

<br/>

- Admin dashboard where an admin can edit/create new products, manage users, see real-time chart data with Socket.IO on sales, and response to various user chats.

<br/>

![adminScreens](https://user-images.githubusercontent.com/91037796/215300841-5ae4a0d5-5187-46f9-9e88-458ec37d15cc.gif)


<br/>
<br/>


<h1> PayPal Payment Integration </h1>

- Used the Paypal SDK to simulate live payment of an order from the store. 
- Referenced PayPal documentation to pass order details such as the order total and products to PayPal.
  - https://developer.paypal.com/sdk/js/reference/#createorder
  
- Created business/personal PayPal sandbox accounts with fake credit/debit cards, and account balances to simulate a real order.
- On a successful response from the PayPal API, the order is marked as paid in the MongoDB database.  An admin must later mark the product as delivered manually.

<br/>
<br/>

![image](https://user-images.githubusercontent.com/91037796/228109773-3610a7cf-2db1-4221-8a29-f11c29f02e13.png)

- GIF #3 - Paying for an order with PayPal and server/front end processing PayPal API response.

![storeGif1](https://user-images.githubusercontent.com/91037796/211115640-cd6b2af0-b670-45f9-a01b-c51b9888f107.gif)


<br/>

<h1> Real Time Chats - Socket.IO </h1>

- Implemented the Socket.IO libary to enable real-time, bi-directional communication between web clients and servers.  
- This will allow for real-time chats between site users and the site admin, as well as real-time charts of sales data.
- Used Redux so that an admin can be notified via an icon on the header and website sound that a new message has arrived from a user.

<br/>
<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/51ceb43a-6153-4c6a-afc5-12b4002420aa)


![storeGif5](https://user-images.githubusercontent.com/91037796/211240679-522a0592-a543-4f43-a91c-940d2d28fd48.gif)

<br/>

```js
Server.js

//back end connects to front end with this code, listening for this message
io.on("connection", (socket) => {
  socket.on("client sends message", (msg) => {
      console.log(msg);
  })
})

```
```js
UserChatComponent.js

  const clientSubmitChatMsg = (e) => {
    // handler for chat message submit
    // if the key is not enter, return
    if (e.keyCode && e.keyCode !== 13) {
        return
    }
    socket.emit("client sends message", "message from client")  //server is listening for this named event
}
```


<br/>
<br/>

<br/>

<h1> AI Dynamic Background Removal and Cloudinary Image Upload by Admin</h1>

- Used the Cloudinary service to allow an Admin to directly upload image files when creating a product to the Cloudinary REST API.
- Referenced Cloudinary documentation for code:
  - https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_unsigned
- Stored URL of images in the MongoDB database as an array.  The front-end simply populates the image source with this URL to retrieve the resource from Cloudinary.

<br/>
<br/>

```js

const uploadImagesCloudinaryApiRequest = (images) => {
   
    //https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_unsigned

    //dwgvi9vwb is env cloud name from cloudinary settings
    const url = "https://api.cloudinary.com/v1_1/dwgvi9vwb/image/upload"
    const formData = new FormData();
    
    for (let i = 0; i < images.length; i++) {
        let file = images[i];
        formData.append("file", file);
        formData.append("upload_preset", "gdsFDSW32") //upload preset from cloudinary settings
        fetch(url, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
    }
}
```

![image](https://user-images.githubusercontent.com/91037796/211130625-73228d61-b1ef-46a2-b017-237aa046221a.png)

- Added dynamic background removal for dark mode based on redux state variable using Cloudinary's background removal API to be able to transform images with AI on the fly.  https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon
- Eventually reverted back to original method as hit API rate limit.  Manually removed backgrounds using https://www.photoroom.com/background-remover.  

```js
src={item.images ? (mode === 'dark' ? `${item.images[0].path.replace('/upload/', '/upload/e_background_removal/')}` : item.images[0].path) : null} 
```

![image](https://user-images.githubusercontent.com/91037796/227737135-8e9279b5-d12b-48bf-8a97-12a7487732ce.png)
![image](https://user-images.githubusercontent.com/91037796/227737146-18aa76e8-5393-4781-8c1a-894b4d46c27e.png)
![image](https://user-images.githubusercontent.com/91037796/227741558-d2c166d7-729b-4ff4-963f-4de0a812e854.png)



<br/>

<br/>

<h1> Redux State Mangement </h1>


![image](https://user-images.githubusercontent.com/91037796/211220213-8bdba8eb-f3f1-4aee-8992-2ef58e2eaac6.png)

- Orders state:

<img src="https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/aed331d7-67c8-48a4-848b-f65786d46e79" alt="image" width="65%">



<br/>

<h1> Google OAuth2.0 Log In </h1>

<br/>


![storeGif3](https://user-images.githubusercontent.com/91037796/211220292-558792a6-c0be-4a58-8466-f657da3c699d.gif)


<h1> Filtering and Sorting </h1>

- Filtering and sorting abilities of the website are configured on both the back and front-end, and are implemented by use of a query string which the back end processses and sends to MongoDB.  This returns a JSON object of the products that match the criteria selected.

https://recreational-equipment-shop.herokuapp.com/api/products/?pageNum=null&price=500&rating=&category=Boots/Climbing/Sportiva,&attrs=color-yellow,&sort=price_1

- For example, a category string could be '&category=Boots/Climbing/Sportiva'.


<h1> Local Docker Test  </h1>

- Run docker in the respective front end/ back end folder

- docker build -t react-ski-shop .
- docker run -dp 3000:3000 react-ski-shop

- docker build -t backend-ski-shop .
- docker run -dp 5000:5000 backend-ski-shop

- Edit proxy to use host.docker.internal

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/a5b2adfb-f5ed-47ab-b604-331fb8de193c)

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/118cb8bd-e0bd-4b67-a319-db488606640b)

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/0e2c9adb-12ef-477e-8c1e-c0c2ba2f126f)



- ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/1b7f1ade-afa0-4a49-9150-42c1cbc2301a)

