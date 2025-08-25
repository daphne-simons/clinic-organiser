import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Auth0Provider } from '@auth0/auth0-react';
import App from "./App.tsx";
import "./styles/index.css";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools /> */}
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </StrictMode >
);
