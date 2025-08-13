import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Layout from './components/Layout';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Guidance from './pages/Guidance';
import Profile from './pages/Profile';
import { LanguageProvider } from './contexts/LanguageContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/questions",
        element: <Questions />,
      },
      {
        path: "/guidance",
        element: <Guidance />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>,
)
