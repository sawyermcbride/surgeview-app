import React, { Component } from "react";
import { Route, Navigate, useLocation} from "react-router-dom";

const PrivateRoute = ({ element: Element, ...rest }: any) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();
  
  return isAuthenticated ? (
    <Element {...rest} />
    ): (
      <Navigate to="/login" state={{from: location}} />
    )
};

export default PrivateRoute;
