import * as React from "react";
import Header from "./components/Header.js";
import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Register from "./components/Register.js"
import Dashboard from "./components/Dashboard.js"
import 'bootstrap/dist/css/bootstrap.min.css';
import {isUserLoggedIn,getCurrentUser} from "./auth.js"
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  useRoutes,
} from "react-router-dom";
import { AuthProvider } from "./context/authContext/index.js";

export default function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
    
  );
}


function Layout() {
  return (
    <div>
     
      {/* <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>
      <AuthStatus /> */}
      <Outlet />
    </div>
  );
}





/* function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
} */

/* function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
console.log("auth",auth)
  if (!auth.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
} */

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}