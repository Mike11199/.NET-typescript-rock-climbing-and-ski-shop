<h1>Live Website</h1>

- https://recreational-equipment-shop.herokuapp.com/

- Use the following for both username and password at login for testing (or create a new account):     test@gmail.com


<h1>Summary</h1>

- A full stack e-commerce web application using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
- Added the PayPal SDK and sandbox accounts to simulate live payment of an order and front/back end response of a submitted order.
- Implemented Socket.IO to allow for bi-directional client and server communication, to enable real-time messaging an admin and users. 
- Used the Cloudinary service to allow an Admin to upload and delete images of a product.  
- Used Cloudinary AI Background Removal to dynamically remove background of images when redux dark mode state variable is set (limit 25K calls a month - free tier).
- Used Redux store/actions/reducers to manage global state as opposed to context in past projects (job tracker).
- Created various database relationships between collections in MongoDB using embedded documents (storing object IDs in other documents). 
- Added Google OAuth2.0 Log In, decoding JWT credentials from Google, and locating the user by email in MongoDB to verify the user. 

<br/>

<h1> Screenshots & GIFs </h1>

- Dark Mode (NEW)

<br/>

![image](https://user-images.githubusercontent.com/91037796/227739396-17ed80e0-afdc-49c7-85d0-fd963d604da8.png)

<br/>

- User adding an item to the cart, placing an order, and paying for the order via PayPal.

<br/>
<br/>

![storeGif2](https://user-images.githubusercontent.com/91037796/211180465-9dcf14d8-eb64-4af0-9e88-dd1145f0f5cc.gif)


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

![storeGif1](https://user-images.githubusercontent.com/91037796/211115640-cd6b2af0-b670-45f9-a01b-c51b9888f107.gif)


<br/>

<h1> Real Time Chats - Socket.IO </h1>

- Implemented the Socket.IO libary to enable real-time, bi-directional communication between web clients and servers.  
- This will allow for real-time chats between site users and the site admin, as well as real-time charts of sales data.
- Used Redux so that an admin can be notified via an icon on the header and website sound that a new message has arrived from a user.

<br/>
<br/>

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

<br/>

<h1> Google OAuth2.0 Log In </h1>

<br/>


![storeGif3](https://user-images.githubusercontent.com/91037796/211220292-558792a6-c0be-4a58-8466-f657da3c699d.gif)


<h1> Filtering and Sorting </h1>

- Filtering and sorting abilities of the website are configured on both the back and front-end, and are implemented by use of a query string which the back end processses and sends to MongoDB.  This returns a JSON object of the products that match the criteria selected.

https://recreational-equipment-shop.herokuapp.com/api/products/?pageNum=null&price=500&rating=&category=Boots/Climbing/Sportiva,&attrs=color-yellow,&sort=price_1

- For example, a category string could be '&category=Boots/Climbing/Sportiva'.
