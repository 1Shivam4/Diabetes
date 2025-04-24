import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainContainer from "../components/ui/MainContainer";
import { FlexDiv } from "../components/ui/CommonStyles";
import { LoginOrRegister } from "../utils/var";
import { useForm } from "react-hook-form";
import { isUserLoggedIn } from "../utils/utils";
import { toast, Toaster } from "sonner";
import { LoginUser, RegisterUser } from "../utils/user.services";

export function Submit({ isSubmitting }) {
  return (
    <button
      type="submit"
      className="p-2 bg-blue-500 font-semibold text-md text-white rounded-md"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const currentLocation = location.pathname.split("/")[1];
  const selectForm =
    currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);

  const [activeFormType, setFormType] = useState(selectForm);
  const [form, setForm] = useState(LoginOrRegister[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/user");
    }
  }, []);

  useEffect(() => {
    const selectedForm = LoginOrRegister.find((f) => f.type === activeFormType);

    if (selectedForm) {
      setForm(selectedForm);
    }
  }, [activeFormType]);

  function handleFormChange(formType) {
    setFormType(formType);
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let loginResponse = {};

    if (activeFormType === "Login") {
      loginResponse = await LoginUser(data);
    } else if (activeFormType === "Register") {
      loginResponse = await RegisterUser(data);
    }

    setIsSubmitting(false);
    if (loginResponse?.status === "error" || loginResponse?.status === "fail") {
      return toast.error("User Not Found");
    }

    if (loginResponse?.status === "success") {
      localStorage.setItem("userToken", loginResponse.token);
      localStorage.setItem("userData", JSON.stringify(loginResponse.data.user));
      navigate("/user");
    }

    toast.success(`${activeFormType} successful!!`);
  };

  const onError = () => {
    if (Object.values(errors).length === 0) return;
    Object.values(errors).forEach((value) => {
      const errorMessage = value?.message || "No error";
      toast.error(errorMessage);
    });
  };

  useEffect(onError, [errors]);

  return (
    <MainContainer>
      <div className="bg-white shadow-lg rounded-lg p-8 w-1/2 m-auto">
        <FlexDiv className="gap-4 mb-6" style={{ justifyContent: "start" }}>
          {["Login", "Register"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleFormChange(btn)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFormType === btn
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {btn}
            </button>
          ))}
        </FlexDiv>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {form.fields.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-medium">
                {field.label}
              </label>
              <input
                id={field.label}
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          ))}
          <Submit isSubmitting={isSubmitting} />
        </form>
      </div>
      <Toaster richColors position="top-right" />
    </MainContainer>
  );
}
