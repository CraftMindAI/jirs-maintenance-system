import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  icon: false,
};

const blueClass = "!bg-blue-600 !text-white !rounded-xl !shadow-lg";
const orangeClass = "!bg-orange-300 !text-orange-950 !rounded-xl !shadow-lg";
const whiteProgress = "!bg-white";
const orangeProgress = "!bg-orange-950/60";

export const showToast = {
  success: (msg: string, options?: ToastOptions) =>
    toast.success(msg, { ...defaultOptions, className: blueClass, progressClassName: whiteProgress, ...options }),
  warning: (msg: string, options?: ToastOptions) =>
    toast.warning(msg, { ...defaultOptions, className: orangeClass, progressClassName: orangeProgress, ...options }),
  error: (msg: string, options?: ToastOptions) =>
    toast.error(msg, { ...defaultOptions, className: blueClass, progressClassName: whiteProgress, ...options }),
  info: (msg: string, options?: ToastOptions) =>
    toast.info(msg, { ...defaultOptions, className: blueClass, progressClassName: whiteProgress, ...options }),
};

export { toast };
