import { useEffect, useState } from "react";

interface ToastProps {
  label: string;
  variant: string;
  onToastClose: () => void; // Callback to be called when the toast is closed
}

const Toast: React.FC<ToastProps> = ({ label, variant, onToastClose }) => {
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    setShowToast(true);

    const duration =
      variant?.toLowerCase() === "success"
        ? 6000
        : variant?.toLowerCase() === "warning"
        ? 10000
        : 30000;

    const timeoutId = setTimeout(() => {
      setShowToast(false);
      onToastClose();
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [label, variant, onToastClose]);

  const handleToastClose = () => {
    setShowToast(false);
    onToastClose();
  };

  return (
    showToast && (
      <div
        id={`${
          variant?.toLowerCase() === "success"
            ? "toast-success"
            : variant?.toLowerCase() === "error"
            ? "toast-danger"
            : "toast-warning"
        }`}
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 flex  space-x-2 items-center min-w-96  px-4 py-3 mb-4 text-primaryBg  rounded-lg ${
          variant?.toLowerCase() === "success"
            ? "bg-[#F0F9E9]"
            : variant?.toLowerCase() === "error"
            ? "bg-[#F9E9E9]"
            : "bg-[#FFF4E5]"
        }`}
        role="alert"
        style={{ zIndex: 1000 }}
      >
        <div
          className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
            variant?.toLowerCase() === "success"
              ? "text-[#69BE28]"
              : variant?.toLowerCase() === "error"
              ? "text-[#D14343]"
              : "text-[#FFA726]"
          } `}
        >
          {variant?.toLowerCase() === "success" ? (
            <>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="sr-only">Check icon</span>
            </>
          ) : variant?.toLowerCase() === "error" ? (
            <>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span className="sr-only">Error icon</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
              <span className="sr-only">Warning icon</span>
            </>
          )}
        </div>

        <div className="font-bold flex  flex-1">{label}</div>

        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5  text-primaryBg hover:text-gray-900 inline-flex h-8 w-8 items-center justify-center"
          data-dismiss-target="#toast-success"
          aria-label="Close"
          onClick={() => handleToastClose()}
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    )
  );
};

export default Toast;
