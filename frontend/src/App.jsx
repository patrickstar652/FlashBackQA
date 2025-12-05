import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom" ;
import Home from "./UI/page/Home";
import Chat from "./UI/page/Chat";

// 建立路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
