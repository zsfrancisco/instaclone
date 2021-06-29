import React from "react";
import { Container } from "semantic-ui-react";

export default function LayoutBasic(props) {
  const { children } = props;

  return (
    <>
      <h1>HEADER</h1>
      <Container className="layout-basic">{props.children}</Container>
    </>
  );
}
