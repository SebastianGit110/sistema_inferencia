import { Navigate, RouteObject } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import Search from "../inference/Search";
import { Admin } from "../inference/Admin";

export const MainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      // { path: "", element: <Navigate to={"login"} /> },
      { path: "login", element: <Login /> },
      { path: "search", element: <Search /> },
      { path: "admin", element: <Admin /> },
    ],
  },
];
