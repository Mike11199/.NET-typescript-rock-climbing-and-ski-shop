import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "../pages/user/UserChatComponent"
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";
import apiURL from "../../src/utils/ToggleAPI";

interface AxiosGetTokenResponse {
    token?: any;
    isAdmin?: boolean;
}

const ProtectedRoutesComponent = ({ admin }) => {

  //TODO:  rework this page as broken for .NET API
  return admin ? (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  ) : (
      <Outlet />
  )
};

export default ProtectedRoutesComponent;

