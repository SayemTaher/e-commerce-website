import * as React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import {
  RouterProvider,
 
} from "react-router-dom";
import AuthProvider from "./Provider/AuthProvider";

import { router } from "./Routes/Routes";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HelmetProvider><RouterProvider router={router} /></HelmetProvider>
    <Toaster/>
    
  </AuthProvider>
  
);
