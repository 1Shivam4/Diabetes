import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FlexDiv } from "../components/ui/CommonStyles";
import { HealthForm } from "../utils/var";
import { PopUpContainer } from "./UserReport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { Submit } from "./Login";
import { CreateTest } from "../utils/user.services";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopUpOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestSuccessfull, setIsTestSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const res = await CreateTest(data);

    if (res?.status === "error" || res?.status === "fail") {
      return toast.error("Something went wrong");
    }

    if (res.status === "success") {
      setIsTestSuccessful(true);
      toast.success(
        "Test successful!!. Redirecting to report page to see results"
      );
    }
    setIsSubmitting(false);
  };

  const onError = () => {
    if (Object.values(errors).length === 0) return;
    Object.values(errors).forEach((value) => {
      const errorMessage = value?.message || "No error";
      toast.error(errorMessage);
    });
  };

  useEffect(() => {
    let timer = null;
    if (isTestSuccessfull) {
      timer = setTimeout(() => navigate("/user"));
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTestSuccessfull]);

  useEffect(onError, [errors]);

  function handlePopUp() {
    setIsPopUpOpen(true);
  }
  function handlePopUpClose() {
    setIsPopUpOpen(false);
  }
  return (
    <div className="min-h-screen bg-gray-100 flex p-8">
      <main className="w-full p-2 relative">
        {isPopupOpen && <PopUpContainer handlePopUpClose={handlePopUpClose} />}

        <div className="flex justify-between align-middle  border-b-2 border-b-slate-300">
          <h2 className="w-full p-1 text-2xl font-bold">
            Make a Diabetes Report
          </h2>
          <button
            onClick={handlePopUp}
            className="h-7 w-7 text-center rounded-full bg-slate-500 text-white info"
          >
            <FontAwesomeIcon icon={faInfo} /> <p className="toolTip">Info</p>
          </button>
        </div>

        <form
          className="mt-10 w-10/12 m-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FlexDiv className="flex-wrap">
            {HealthForm.map((hlth, i) => (
              <div
                key={i}
                className="w-full p-5 flex flex-col md:w-[410px] my-5 border-2"
              >
                <label
                  htmlFor={hlth.name}
                  className="text-lg font-semibold text-slate-600 my-2"
                >
                  {hlth.label}
                </label>
                <input
                  className="text-md p-2 outline-none border-2 rounded-md"
                  {...register(hlth.name, {
                    required: `${hlth.label} is required`,
                  })}
                  id={hlth.name}
                  type={hlth.type}
                  placeholder={hlth.placeholder}
                  name={hlth.name}
                  required
                />
              </div>
            ))}
          </FlexDiv>
          <Submit isSubmitting={isSubmitting} />
        </form>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
