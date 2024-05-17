import toast from "react-hot-toast";

export const toastError = (text: string) => {
  toast.dismiss();
  toast.error(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
  });
};

export const toastSuccess = (text: string) => {
  toast.dismiss();
  toast.success(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
  });
};
