import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthProvider from './Main/AuthProvider/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignUp from './Main/Authentication/SignUp.jsx';
import Login from './Main/Authentication/Login.jsx';
import TaskBoardMain from './Main/Authentication/TaskBoardMain.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <TaskBoardMain></TaskBoardMain>,
    children: [
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'signUp',
        element: <SignUp></SignUp>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </AuthProvider>
  </StrictMode>,
)
