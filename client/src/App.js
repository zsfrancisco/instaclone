import { Button } from "semantic-ui-react";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app">
        <Button primary>Primary</Button>
        <Button secondary>Secondary</Button>
      </div>
    </ApolloProvider>
  );
}
