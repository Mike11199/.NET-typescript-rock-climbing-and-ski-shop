import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "../pages/user/UserChatComponent"

import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
     axios.get("/api/get-token").then(function (data) {
         if (data.data.token) {
             setIsAuth(data.data.token);
         }
         return isAuth;
     }) 
  }, [isAuth])

  if (isAuth === undefined) return <LoginPage />;


  // if you are authorized, but not an admin, and trying to access an admin page, go back to login page
  return isAuth && admin && isAuth !== "admin" ? (
       <Navigate to="/login" />

  // else if admin and authorized return admin routes
  ) : isAuth && admin ? (
      <Outlet />

  // else if not admin and authorized return admin routes      
  ) : isAuth && !admin ? (
      <>
      <UserChatComponent />
      <Outlet />
      </>
  // else navigate to login page
  ) : (
       <Navigate to="/login" />
  )
};

export default ProtectedRoutesComponent;

