"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastClassName="!bg-blue-600 !text-white !rounded-xl !shadow-lg"
      progressClassName="!bg-white"
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          className="self-start mt-1 text-white/80 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    />
  );
}
