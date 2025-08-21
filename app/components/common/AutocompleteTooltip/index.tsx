import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface QuestionTooltipProps {
  tooltipContent: any;
  containerRef?: any;
}

const AutocompleteTooltip: React.FC<QuestionTooltipProps> = ({
  tooltipContent,
  containerRef = null,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [arrowPosition, setArrowPosition] = useState("center");
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const isBrowser = typeof window !== "undefined";

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

  const updateTooltipPosition = () => {
    if (isTooltipVisible && tooltipRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let top = triggerRect.top + window.scrollY - tooltipRect.height - 6;
      let left =
        triggerRect.left +
        window.scrollX +
        triggerRect.width / 2 -
        tooltipRect.width / 2;

      if (left < 8) {
        left = triggerRect.left - window.scrollX - 16;
        setArrowPosition("left");
      } else if (left + tooltipRect.width > viewportWidth - 20) {
        left =
          triggerRect.left +
          window.scrollX -
          tooltipRect.width +
          triggerRect.width +
          16;
        setArrowPosition("right");
      } else {
        setArrowPosition("center");
      }

      setTooltipPosition({
        top: Math.max(8, top),
        left: Math.max(
          8,
          Math.min(left, viewportWidth - tooltipRect.width - 8)
        ),
      });
    }
  };

  useEffect(() => {
    updateTooltipPosition();

    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [isTooltipVisible]);

  const renderTooltip = () => (
    <div
      ref={tooltipRef}
      className="absolute z-50 px-3 py-1 bg-white text-primaryBg font-normal text-sm rounded-lg shadow-xl max-w-[15rem] sm:max-w-xs"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        position: "absolute",
        width: "max-content",
        zIndex: 1000,
      }}
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
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex flex-col items-center w-fit"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <svg
        className="text-secondaryBg w-[18px] h-[18px] cursor-pointer"
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

      {isTooltipVisible &&
        isBrowser &&
        createPortal(renderTooltip(), document.body)}
    </div>
  );
};

export default AutocompleteTooltip;
