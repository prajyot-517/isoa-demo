import React from "react";

interface props {
  variant: string;
  message: string;
}

const PromoCodeValidationMessage: React.FC<props> = ({ variant, message }) => {
  return (
    <div
    
      id={`${
        variant?.toLowerCase() === "success"
          ? "toast-success"
          : variant?.toLowerCase() === "error"
          ? "toast-danger"
          : "toast-warning"
      }`}
      className={`flex  py-1 mb-4 text-primaryBg  rounded-lg `}
      role="alert"
    >
      <div
        className={` w-5 h-5 mt-0.5 ${
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
              className="w-4 h-4"
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
              className="w-4 h-4"
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
              className="w-4 h-4"
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

      <div
        className={`font-bold flex text-sm  flex-1 ${
          variant?.toLowerCase() === "success"
            ? "text-[#69BE28]"
            : variant?.toLowerCase() === "error"
            ? "text-[#D14343]"
            : "text-[#FFA726]"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default PromoCodeValidationMessage;
