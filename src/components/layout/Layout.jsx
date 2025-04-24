import React, { Fragment } from "react";
import { Toaster } from "../ui/sooner";

export default function Layout({ children }) {
  return (
    <Fragment>
      <header></header>
      <main>{children}</main>

      <Toaster richColors theme='light' />
    </Fragment>
  );
}