import { toast } from "react-toastify";

export const success = (msg) => {
  toast.success(msg, { position: "top-center" });
};

export const errors = (msg) => {
  toast.error(msg, { position: "top-center" });
};
