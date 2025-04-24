import React from "react";

export default function Button({ bgcolor, children }) {
  return (
    <button className={`h-10 w-full sm:h-16 sm:w-80  ${bgcolor} rounded-md`}>
      {children}
    </button>
  );
}
