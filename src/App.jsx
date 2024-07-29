// src/App.js
import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tanslate from "./page/Tanslate";
import Compare from "./page/Compare";
import ImageDetails from "./page/ImageDetails";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Tanslate />,
      },
      {
        path: "/compareAi",
        element: <Compare />,
      },
      {
        path: "/imgDetails",
        element: <ImageDetails />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
