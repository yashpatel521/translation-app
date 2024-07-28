import React from "react";
import "./App.css";
import { Route, Router } from "react-router-dom";
import Tanslate from "./page/Tanslate";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Compare from "./page/Compare";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Tanslate />,
  },
  {
    path: "/compareAi",
    element: <Compare />,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
