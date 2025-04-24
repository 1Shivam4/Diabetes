import React, { Fragment } from "react";
import Sidebar from "../ui/Siderbar";

export default function UserLayout({ children }) {
  return (
    <Fragment>
      <section className="flex w-full">
        <header className="relative">
          <Sidebar />
        </header>
        <main className="ml-[80px] w-full">
          {children}
        </main>
      </section>
    </Fragment>
  );
}