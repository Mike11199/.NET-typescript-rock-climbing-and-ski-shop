import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "../pages/user/UserChatComponent"

import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";


interface AxiosGetTokenResponse {
    token?: any;
    isAdmin?: boolean;
}

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState<any>();

  // express
  useEffect(() => {
     axios.get<AxiosGetTokenResponse>("/api/get-token").then(function (data) {
         if (data?.data?.token) {
             setIsAuth(data?.data?.token);
         }
         return isAuth;
     })
  }, [isAuth])

  //dotnet
  // useEffect(() => {
  //   axios.get<AxiosGetTokenResponse>("/apiv2/get-token").then(function (response) {
  //     if (response.data.token) {
  //       setIsAuth(response.data.token);
  //     }
  //   }).catch(function (error) {
  //     console.error('Error fetching token:', error);
  //     console.log('Error fetching token:', error);
  //   });
  // }, [isAuth]);

  // if you are not authorized all then you have to log in.  return log in page.
  if (isAuth === undefined) return <LoginPage />;

  // if you are authorized, but not an admin, and trying to access an admin page, go back to login page
  return isAuth && admin && isAuth !== "admin" ? (
       <Navigate to="/login" />

  // else if admin and authorized return admin routes
  ) : isAuth && admin ? (
      <Outlet />

  // else if not admin and authorized return user routes
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

