
<h1>Live Website</h1>

- Main Site - AWS ECS - CI/CD Pipeline and EC2 Load Balancer on Custom Domain
  - https://alpine-peak-climbing-ski-gear.com/
  - Three docker containers hosted on AWS ECS and reverse proxied by Nginx.
  - CI/CD pipeline rebuilds and deploys docker images to AWS ECS whenever a new commit is pushed to the `docker-aws-ecs` branch on GitHub.
  - An EC2 Application Load Balancer reroutes traffic to the ECS cluster even when the IP address of it changes due to the CI/CD pipeline.
  - EC2 Load balancer automatically redirects HTTP port 80 to HTTPS port 443 which has an AWS SSL Certificate.

- Backup Link (Older Version) - Heroku (CI/CD with Main Branch)
  - https://recreational-equipment-shop.herokuapp.com/

<br/>

![image](https://github.com/user-attachments/assets/a6b70927-c525-4473-a70a-0d99c97bbe3f)

<br/>

![image](https://github.com/user-attachments/assets/073702d1-e077-4620-8ba2-4f82ee743b03)

<br/>

![image](https://github.com/user-attachments/assets/dcc27d85-676c-46fd-b498-a24670f40a69)

<br/>

![image](https://github.com/user-attachments/assets/0b20fd62-6942-462f-9623-6a2e21a5ce84)

<br/>

- Use the following user and password to test the fake PayPal sandbox account to pay for an order (fake account with bank/credit cards):
  - Username: sb-fh43v4330869755@personal.example.com
  - Password: testtest

<h1>Summary</h1>

- A full stack e-commerce web application built with TypeScript, a .NET API running on C#, and a PostgreSQL database in an AWS RDS instance accessed with Entity Framework Core.

- Leveraged .NET's built in JSON Web Token (JWT) capabilities to set authorization on routes and resource based acccess control for routes.

- Created Repositories and IRepository interfaces to set up an abstraction layer between the API's controllers and database context, and to better organize code in the application.

- This was originally a MERN app, and was completely re-written.  The original backend still runs in a Docker container for Socket.io user chats.  Some admin routes/controllers are still being transitioned to the .NET API.
  
- Hosted on Amazon Elastic Container Service (ECS) in three separate docker containers.  Added a custom domain name and load balancer for HTTPS.
  
- Added a GitHub actions pipeline that automatically redeploys containers on push.  Added Lambdas to detect when containers crash - emailing me via an SNS topic - and to shut the site down at night to save money.

- Added the PayPal SDK and sandbox accounts to simulate live payment of an order and front/back end response of a submitted order.

- Added an admin dashboard that only is displayed if a user is an admin, so that an entire new area of the site is rendered.  This Admin area includes components to add new products, edit products, mark orders as delivered, and other tasks (such as deleting products or responding to user chats), without having to directly access the database.

- Implemented Socket.IO to allow for bi-directional client and server communication, to enable real-time messaging between an admin and multiple users.  This might be later transitioned to .NET's SignalR.

- Used the Cloudinary service to allow an Admin to upload and delete images of a product.  Links to Cloudinary are stored in the PostgreSQL database and fetched as needed.

- Used Cloudinary AI Background Removal to dynamically remove background of images when redux dark mode state variable is set (later removed due to rate limit).

- Used Redux store/actions/reducers to manage global state as opposed to context in past projects (job tracker).
  
- Added Google OAuth2.0 Log In, decoding JWT credentials from Google, and locating the user by email in the PostgreSQL database to verify the user. 


<br/>

<h1> .NET C# - API Version 2 Conversion </h1>

- Added order/product M:N intersection table and a create order controller.

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop/assets/91037796/b498233f-a5d0-4429-aef1-3d5ec33814a0)

- Added authorization.  .AddJwtBearer() is called in program.cs, then I leverage the built in [Authorize] and User object to implement resource based access control so that users can only create orders for themselves - aka not spoof their user id somehow.

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop/assets/91037796/6862129f-8fd6-4f4a-9fa4-87e1bb933390)


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

- Admin dashboard where an admin can edit/create new products, manage users, see real-time chart data with Socket.IO on sales, and response to various user chats (this is currently broken by API v2 conversion to .NET and being recreated).

<br/>
<br/>


<h1> PayPal Payment Integration </h1>

- Used the Paypal SDK to simulate live payment of an order from the store.
- Referenced PayPal documentation to pass order details such as the order total and products to PayPal.
  - https://developer.paypal.com/sdk/js/reference/#createorder

- Created business/personal PayPal sandbox accounts with fake credit/debit cards, and account balances to simulate a real order.
- On a successful response from the PayPal API, the order is marked as paid in the PostgreSQL database.  An admin must later mark the product as delivered manually.

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
- Stored URL of images in the PostgreSQL database as an array.  The front-end simply populates the image source with this URL to retrieve the resource from Cloudinary.

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



<h1> AWS Deployment to Elastic Container Service </h1>


- http://alpine-peak-climbing-ski-gear.com/
- http://react-ski-shop-1109515336.us-west-1.elb.amazonaws.com/
- http://52.53.153.100/

- Dockerized the front-end and back-end into separate containers using Dockerfiles and docker-compose.yml files.

<br/>
  
![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/fc4256c1-e102-409e-843d-9bbb102d51e6)

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/0b5481cc-b042-478a-8c7d-8258093c6807)

<br/>

- Set up NGINX configuration file for a reverse proxy to serve front-end on AWS:

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/210f45fa-933a-4d25-99a6-c07b19a8bd28)

<br/>

- Uploaded docker images to AWS ECR (Elastic Container Registry) using the AWS CLI

  <br/>


![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/8c56c31a-c3b1-4e4a-863c-878f72839741)

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/4cfcb852-c33b-4b89-a35f-66ff47603297)
  

  <br/>

- Set up task definition for both docker images to expose ports needed - so they can communicate within the same VPN:

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/27294433-8a25-493b-9e9e-6017af2e6a06)

<br/>

- Created a service within an Elastic Container Service (ECS) cluster to run the above task, so that the front end and back end docker images are deployed to a public IP.

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/19e45ec4-9587-4e16-9ddd-5b2cfadcd05a)

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/060f2073-175e-4a4f-a960-74de029ffcd6)


<br/>
<br/>

<br/>

- EC2 Application Load Balancer to reroute traffic even when the ECS IP Address changes.

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/c06b8234-1d9d-458e-a5b2-68802a1e6fde)


<br/>
<br/>

- Added a custom domain name to the Load Balancer with AWS Route 53 and an SSL Certificate with AWS Certificate Manager backed by RSA 2048 bit encryption.  Edited the load balancer to automatically redirect HTTP requests on port 80 to port 443 for HTTPS for the domain name https://alpine-peak-climbing-ski-gear.com/.

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/9fa0514f-bf16-4c40-86c3-79e38ef7668f)

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/059acd02-d144-4c83-99f2-cb128bd29220)

<br/>

![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/e595d3dd-8abd-4533-ab08-3db7460eb799)

<br/>


<h1> Lambda via EventBridge and SNS to Detect Outages </h1>

- Added lambda to send an email to an SNS topic if any of the site containers crash.  This is done with an EventBridge rule that detects container state changes.

 <br/>

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/5755d3ac-c20d-48a2-9f33-778fc6a50c3b)

 <br/>

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/765ca48d-fd5c-48ef-88b9-5b44d4c4aefd)

  <br/>

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/aace5763-c553-4b7e-9be6-d73bd2e33b33)

  <br/>

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/f6a044de-47c5-4a73-8aa9-e5fe58d28524)

<br/>

<h1> CI/CD Deployment via GitHub Actions </h1>

- Added a Github workflow that on repo push redeploys the docker containers.  This required setting up various secrets and task definitions to run correctly.

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/908a5ba2-3745-4977-9fd3-4f9d06c6e14b)


 <br/>

 <h1> Lambda Cron to Periodically Shut Down Site at Night </h1>

- Added a lambda to shut down the site between 1am and 6am to save money.

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/752f752e-070f-4085-b174-f1a3f849f0e7)

  <br/>

 ![image](https://github.com/Mike11199/rock-climbing-and-ski-shop-mern-stack/assets/91037796/c318c4fd-4f65-4562-9546-d9cbc6c169a0)



 
