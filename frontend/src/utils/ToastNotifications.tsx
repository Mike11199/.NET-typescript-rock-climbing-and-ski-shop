import { useState } from "react";
import toast from "react-hot-toast";

export const toastError = (text: string) => {
  toast.dismiss(text);

  setTimeout(() => {
    toast.error(text, {
      id: text,
      duration: 2000,
      style: {
        borderRadius: "10px",
        background: "linear-gradient(#131212, #131212)",
        color: "#fff",
      },
    });
  }, 100);
};

export const toastSuccess = (text: string) => {
  toast.dismiss(text);

  setTimeout(() => {
    toast.success(text, {
      id: text,
      duration: 2000,
      style: {
        borderRadius: "10px",
        background: "linear-gradient(#131212, #131212)",
        color: "#fff",
      },
    });
  }, 100);
};

const ToastCloseButton = ({ closeToast }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => closeToast()}
      style={{
        backgroundColor: hovered ? "#bb2323" : "#a11e1e",
        color: "#c0bcbc",
        borderRadius: "2px",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "1px 1px 5px 0px #000000",
        outline: "none",
        border: "none",
        height: "100%",
        width: "2rem",
      }}
    >
      ✕
    </button>
  );
};

export const toastAddedToCart = (text, navigate, cartItems, cartSubtotal) => {
  toast.dismiss(text);

  setTimeout(() => {
    const CustomToast = ({ text, closeToast }) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span>{text}</span>
          <button
            className="toast-button"
            onClick={() => {
              closeToast();
              navigate("/cart");
            }}
          >
            Go to Cart
          </button>
          <ToastCloseButton closeToast={closeToast} />
        </div>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            Cart Total - ${cartSubtotal}
          </div>
        </div> */}
      </div>
    );

    toast.success(
      <CustomToast text={text} closeToast={() => toast.dismiss(text)} />,
      {
        id: text,
        duration: 4000,
        style: {
          background: "linear-gradient(#131212, #131212)",
          color: "#f0f0f0",
          borderRadius: "8px",
          boxShadow: "5px 5px 15px 0px #000000",
        },
      }
    );
  }, 100);
};

export const toastConfirm = (message, onConfirm) => {
  const toastId = message;

  const ConfirmToast = ({ closeToast }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        textAlign: "center",
        padding: "0.5rem",
        minWidth: "250px",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        ⚠️ {message}
      </span>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <button
          className="toast-button"
          style={{ width: "100%" }}
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
        >
          Yes
        </button>
        <button
          style={{ width: "100%" }}
          className="toast-button"
          onClick={() => {
            toast.dismiss(toastId);
          }}
        >
          No
        </button>
      </div>
    </div>
  );

  toast.dismiss(toastId);
  setTimeout(() => {
    toast(<ConfirmToast closeToast={() => toast.dismiss(toastId)} />, {
      id: toastId,
      duration: Infinity,
      style: {
        background: "linear-gradient(#131212, #131212)",
        color: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: "5px 5px 15px 0px #000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }, 100);
};
