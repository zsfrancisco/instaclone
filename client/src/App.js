import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import Auth from "./pages/Auth";

export default function App() {
  const [auth, setAuth] = useState(undefined);

  return (
    <ApolloProvider client={client}>
      {!auth ? <Auth /> : <h1>Estas logueado</h1>}
    </ApolloProvider>
  );
}
