import { useState } from "react";

interface ButtonProps {
  onClick: () => void;
  label: string;
  variant: string;
  disabled: boolean;
  showTooltip: boolean;
  tooltipContent: string;
  id?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  variant = "filled",
  disabled = false,
  showTooltip = false,
  tooltipContent = "",
  id = "",
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onFocus={() => setIsTooltipVisible(true)}
      onBlur={() => setIsTooltipVisible(false)}
    >
      <button
        onClick={onClick}
        className={`w-full font-bold py-2 text-center rounded-3xl ${
          variant?.toLowerCase() === "filled" && !disabled
            ? "bg-primaryBg border text-white border-primaryBg  focus:ring-2 dark:hover:bg-purple-900 dark:focus:ring-purple-900 transition-all duration-300 hover:bg-opacity-80 hover:scale-105 hover:shadow-lg"
            : disabled
            ? "bg-[#D8D8D8] text-grayCustom cursor-not-allowed border-2 border-transparent"
            : "text-primaryBg border-2 border-primaryBg bg-white hover:bg-primaryBg hover:text-white"
        } `}
        disabled={disabled}
        id={id}
      >
        {label}
      </button>

      {showTooltip && isTooltipVisible && (
        <div
          id="tooltip"
          role="tooltip"
          className="absolute custom-shadow bottom-full mb-[6px] px-3 py-1 bg-white text-primaryBg font-medium text-base rounded-lg shadow-md before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-l-transparent before:border-r-transparent before:border-b-transparent before:border-t-white before:border-[9px] before:-mt-1 "
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default Button;
