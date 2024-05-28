import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export const toastError = (text: string) => {
  toast.dismiss();

  toast.error(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },

    duration: 3000,
  });
};

export const toastSuccess = (text: string) => {
  toast.dismiss();

  toast.success(text, {
    style: { borderRadius: "10px", background: "#333", color: "#fff" },
    duration: 3000,
  });
};

export const toastAddedToCart = (text, navigate) => {
  const toastId = uuidv4();
  toast.dismiss();

  const CustomToast = ({ text, closeToast }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{text}</span>
      <button onClick={closeToast} className="toast-button">
        Close
      </button>
      <button
        className="toast-button"
        onClick={() => {
          closeToast();
          navigate("/cart");
        }}
      >
        Go to Cart
      </button>
    </div>
  );

  toast.remove(toastId);
  toast.success(
    <CustomToast text={text} closeToast={() => toast.remove(toastId)} />,
    {
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
      duration: Infinity,
      id: toastId,
    }
  );
};
