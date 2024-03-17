import { Outlet, useNavigate } from "react-router-dom";
import UserChatComponent from "../pages/user/UserChatComponent"

import axios from "axios";
import React, { useState, useEffect } from "react"
import apiURL from "../../src/utils/ToggleAPI";



interface AxiosGetTokenResponse {
    token?: any;
    isAdmin?: boolean;
}

const ProtectedRoutesComponent = ({ admin }) => {

  const [isAuth, setIsAuth] = useState<any>();
  const [isAdmin, setIsAdmin] = useState<any>();
  const navigate = useNavigate()

useEffect(() => {
  axios.get<AxiosGetTokenResponse>(`${apiURL}/get-token`).then(function (response) {
    if (response.data.isAdmin) {
      setIsAuth(response.data.token);
      setIsAdmin(response.data.isAdmin);
    }
    console.log(response.data.isAdmin)
    console.log(response.data.token)
  }).catch(function (error) {
    console.error('Error fetching token:', error);
    console.log('Error fetching token:', error);
  });
}, [isAuth, isAdmin])



  // if you are not authorized all then you have to log in.  return log in page.
 

  console.log(isAuth && admin && !isAdmin)
  console.log(isAuth )
  console.log(admin)
  console.log(isAdmin)

  // if you are authorized, but not an admin, and trying to access an admin page, go back to login page
  return isAuth && admin && isAdmin ? (
      <Outlet />
  ) : (
      <>
      <UserChatComponent />
      <Outlet />
      </>
  )
};

export default ProtectedRoutesComponent;

