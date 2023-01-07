
<h1>Summary</h1>

- A full stack e-commerce web application using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
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

<h1> Cloudinary Image Upload </h1>

- Used the Cloudinary service to allow an Admin to directly upload image files when creating a product to the Cloudinary REST API.
- Referenced Cloudinary documentation for code:
  - //https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_unsigned
- Stored URL of images in the MongoDB database as an array.  The front-end simply populates the image source with this URL to retrieve the resource from Cloudinary.

<br/>
<br/>

```js

const uploadImagesCloudinaryApiRequest = (images) => {
   
    //https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_unsigned

    const url = "https://api.cloudinary.com/v1_1/dwgvi9vwb/image/upload"  //dwgvi9vwb is env cloud name from cloudinary settings
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


<br/>



