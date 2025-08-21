import { useState, useEffect, useRef } from "react";

interface QuestionTooltipProps {
  tooltipContent: any;
  containerRef?: any;
}

const QuestionTooltip: React.FC<QuestionTooltipProps> = ({
  tooltipContent,
  containerRef = null,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [arrowPosition, setArrowPosition] = useState("center");
  let windowInnerWidth = 0;

  // Utility function to check if code is running on the client (browser)
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    windowInnerWidth = window?.innerWidth;
  }

  useEffect(() => {
    if (hovering) {
      const timeoutId = setTimeout(() => {
        setIsTooltipVisible(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setIsTooltipVisible(false);
    }
  }, [hovering]);

  useEffect(() => {
    if (
      isTooltipVisible &&
      tooltipRef.current &&
      containerRef &&
      containerRef.current
    ) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Check if tooltip overflows to the right or left of the container
      const overflowsRight = tooltipRect.right > containerRect.right;
      const overflowsLeft = tooltipRect.left < containerRect.left;

      if (overflowsRight) {
        setArrowPosition("right");
        tooltipRef.current.style.left = "auto";
        tooltipRef.current.style.right = "0";
        tooltipRef.current.style.transform = "translateX(0)";
      } else if (overflowsLeft) {
        setArrowPosition("left");
        tooltipRef.current.style.left = "0";
        tooltipRef.current.style.right = "auto";
        tooltipRef.current.style.transform = "translateX(0)";
      } else {
        setArrowPosition("center");
        tooltipRef.current.style.left = "50%";
        tooltipRef.current.style.right = "auto";
        tooltipRef.current.style.transform = "translateX(-50%)";
      }
    } else if (isTooltipVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const overflowsRight = tooltipRect.right > windowInnerWidth;
      const overflowsLeft = tooltipRect.left < 0;

      if (overflowsRight) {
        tooltipRef.current.style.left = "auto";
        tooltipRef.current.style.right = "0";
        tooltipRef.current.style.transform = "translateX(0)";
        setArrowPosition("right");
      } else if (overflowsLeft) {
        tooltipRef.current.style.left = "0";
        tooltipRef.current.style.right = "auto";
        tooltipRef.current.style.transform = "translateX(0)";
        setArrowPosition("left");
      } else {
        tooltipRef.current.style.left = "50%";
        tooltipRef.current.style.right = "auto";
        tooltipRef.current.style.transform = "translateX(-50%)";
        tooltipRef.current.style.zIndex = "100";
        setArrowPosition("center");
      }
    }
  }, [isTooltipVisible]);

  return (
    <div
      className="relative inline-flex flex-col items-center w-fit"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <svg
        className="text-secondaryBg w-[18px] md:w-[24px] h-[18px] md:h-[24px] cursor-pointer"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        <path
          fillRule="evenodd"
          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.480-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z"
          clipRule="evenodd"
        />
      </svg>

      {isTooltipVisible && (
        <div
          id="tooltip"
          role="tooltip"
          ref={tooltipRef}
          className={`absolute z-50 bottom-full mb-1 px-3 py-1 bg-white text-primaryBg font-normal text-sm md:text-base rounded-lg shadow-xl max-w-[15rem] sm:max-w-xs ${
            arrowPosition === "center"
              ? ""
              : arrowPosition === "right"
              ? "-mr-4"
              : "-ml-3"
          }`}
          style={{ width: "max-content" }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {tooltipContent}
          <div
            className={`absolute h-0 w-0 border-[9px] border-transparent ${
              arrowPosition === "center"
                ? "left-1/2 transform -translate-x-1/2"
                : arrowPosition === "right"
                ? "right-4"
                : "left-4"
            } border-t-white`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default QuestionTooltip;
