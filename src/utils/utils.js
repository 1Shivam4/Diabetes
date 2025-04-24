import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = () => {
  const token = localStorage.getItem("userToken");
  const adminData = localStorage.getItem("userData");

  if (token && adminData) {
    return true;
  }
  return false;
};

export const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};
