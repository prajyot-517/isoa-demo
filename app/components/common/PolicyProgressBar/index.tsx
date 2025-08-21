import { useEffect, useRef, useState } from "react";
import PolicyProgressBarIcon from "~/components/common/PolicyProgressBar/PolicyProgressBarIcons";

interface PolicyProgressBarProps {
  currentStep: number;
  subStep: number;
}

const PolicyProgressBar: React.FC<PolicyProgressBarProps> = ({
  currentStep,
  subStep,
}) => {
  const currentStepRef = useRef(null);

  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [screenWidthPercentage, setScreenWidthPercentage] = useState(0);
  const [elementWidth, setElementWidth] = useState(0);
  const [elementOffset, setElementOffset] = useState(0);

  const steps = [
    {
      name: "Question Details",
      liStyle: `${
        currentStep === 1 ? "flex" : "hidden"
      } relative cursor-default md:flex`,
      divStyle:
        "flex justify-center items-center space-x-2 my-1 py-3 flex-1 whitespace-nowrap text-lg font-bold sm:pr-6 md:border-r md:border-gray-300 md:border-l md:pl-6",
      nameStyle: "",
    },
    {
      name: "Policy Holder Contact Details",
      liStyle: `${
        currentStep === 2
          ? "flex"
          : currentStep + 1 === 2
          ? "hidden sm:flex"
          : "hidden"
      } relative cursor-default md:flex`,
      divStyle: ` flex justify-center items-center space-x-2  my-1 py-3  flex-1 whitespace-nowrap text-lg font-bold ${
        currentStep === 2
          ? "sm:pr-6 md:pl-6 md:border-r sm:border-gray-300"
          : "sm:border-l md:border-l-0 md:border-r sm:border-gray-300 sm:px-6"
      }`,
      nameStyle: "",
    },
    {
      name: "Your Quote",
      liStyle: `${
        currentStep === 3
          ? "flex"
          : currentStep + 1 === 3
          ? "hidden sm:flex md:px-0"
          : "hidden"
      } relative cursor-default md:flex`,
      divStyle: ` flex justify-center items-center space-x-2  my-1  py-3  flex-1 whitespace-nowrap text-lg font-bold ${
        currentStep === 3
          ? "sm:pr-6 md:pl-6 md:border-r sm:border-gray-300"
          : "sm:border-l md:border-l-0 md:border-r sm:border-gray-300 sm:px-6"
      }`,
      nameStyle: "",
    },
    {
      name: "Final Questions",
      liStyle: `${
        currentStep === 4
          ? "flex"
          : currentStep + 1 === 4
          ? "hidden sm:flex md:px-0"
          : "hidden"
      } relative cursor-default md:flex`,
      divStyle: `flex justify-center items-center space-x-2 my-1 py-3 flex-1 whitespace-nowrap text-lg font-bold ${
        currentStep === 4
          ? "sm:pr-6 md:pl-6 md:border-r sm:border-gray-300"
          : "sm:border-l md:border-l-0 md:border-r sm:border-gray-300 sm:px-6"
      }`,
      nameStyle: `${
        currentStep === 4 || currentStep + 1 === 4
          ? "sm:flex md:hidden"
          : "hidden"
      } lg:flex`,
    },
    {
      name: "Summary",
      liStyle: `${
        currentStep === 5
          ? "flex"
          : currentStep + 1 === 5
          ? "hidden sm:flex  md:px-0"
          : "hidden"
      } relative cursor-default md:flex`,
      divStyle: ` flex justify-center items-center space-x-2  my-1 py-3 flex-1 whitespace-nowrap text-lg font-bold ${
        currentStep === 5
          ? "pr-6 md:px-6 sm:border-r"
          : "sm:border-l md:border-l-0 md:border-r sm:border-gray-300 sm:px-6"
      }`,
      nameStyle: `${
        currentStep === 5 || currentStep + 1 === 5
          ? "sm:flex md:hidden"
          : "hidden"
      } xl:flex`,
    },
    {
      name: "Buy Policy",
      liStyle: `${
        currentStep === 6
          ? "flex"
          : currentStep + 1 === 6
          ? "hidden sm:flex  sm:px-6 md:px-0"
          : "hidden"
      } relative cursor-default md:flex`,
      divStyle:
        "md:border-r flex justify-center items-center space-x-2 md:border-gray-300 my-1 py-3 md:px-6 flex-1 whitespace-nowrap text-lg font-bold",
      nameStyle: `${
        currentStep === 6 || currentStep + 1 === 6
          ? "sm:flex md:hidden"
          : "hidden"
      } 2xl:flex`,
    },
  ];

  useEffect(() => {
    const updateWidthPercentage = () => {
      if (currentStepRef.current) {
        const element = currentStepRef.current;
        const elementWidth = element?.offsetWidth;
        const elementLeftOffset = element?.offsetLeft;

        setElementWidth(elementWidth);
        setElementOffset(elementLeftOffset);

        const screenWidth = window.innerWidth;
        const widthPercentage =
          ((elementLeftOffset + elementWidth) / screenWidth) * 100;

        setScreenWidthPercentage(widthPercentage);
      }
    };

    updateWidthPercentage();

    window?.addEventListener("resize", updateWidthPercentage);

    return () => {
      window?.removeEventListener("resize", updateWidthPercentage);
    };
  }, [currentStep]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 640);
    };

    handleResize();

    window?.addEventListener("resize", handleResize);

    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mx-auto relative w-full">
      <div className="grid grid-cols-8 gap-8 mx-auto bg-white">
        <div className="col-span-full  flex justify-between items-center px-6">
          <ul className="text-primaryBg font-bold  border-b-0  p-0 flex list-none justify-center md:mx-auto max-w-[1216px]">
            {steps?.map((step, index) => {
              const isActive = index + 1 === currentStep;

              return (
                <li
                  className={`${step?.liStyle} ${
                    currentStep === index + 1
                      ? "text-secondaryBg"
                      : index + 1 < currentStep
                      ? "text-[#B1B1B1]"
                      : ""
                  }`}
                  ref={isActive ? currentStepRef : null}
                  key={index}
                >
                  <div className={step?.divStyle}>
                    <span>
                      <PolicyProgressBarIcon
                        index={index}
                        currentStep={currentStep}
                      />
                    </span>
                    <span className={step?.nameStyle}>{step?.name}</span>
                  </div>
                </li>
              );
            })}

            {currentStep > 6 && (
              <li className="flex text-[#B1B1B1] md:hidden">
                <div className="md:border-r flex justify-center items-center space-x-2 md:border-gray-300 my-1 py-3 md:px-6 flex-1 whitespace-nowrap text-lg font-bold">
                  <span>
                    <PolicyProgressBarIcon index={5} currentStep={7} />
                  </span>
                  <span className="flex">Buy policy</span>
                </div>
              </li>
            )}
          </ul>
          <div className="text-secondaryBg font-bold md:hidden">
            {currentStep > 6 ? 6 : currentStep}/6
          </div>
        </div>
      </div>

      <div className="bg-gray-100 w-full h-2 p-0 m-0 ">
        <div
          style={{
            width: `${
              currentStep < 7 && isLargeScreen
                ? `calc(${screenWidthPercentage}%)`
                : "100%"
            } `,
          }}
          className="relative h-full "
        >
          <div
            className={`gap-1.5 flex max-w-full h-full absolute inset-0 transition-width ease-in duration-200 `}
          >
            <div
              className={`flex-initial  ${
                currentStep === 1 ? `w-1/3 bg-[#b1b1b1]` : "w-full"
              }`}
              style={{ width: elementOffset }}
            ></div>
            {/* <div
              className={`flex-grow  ${
                currentStep === 1 ? "flex bg-[#b1b1b1]" : "hidden"
              }`}
            ></div>
            <div
              className={`flex-grow  ${
                currentStep === 1 ? "flex bg-[#b1b1b1]" : "hidden"
              }`}
            ></div>
            <div
              className={`flex-grow ${
                currentStep === 1 ? "bg-[#b1b1b1]" : ""
              } flex`}
            ></div> */}
          </div>
          <div
            className={`${
              currentStep === 1 ? "w-2/12" : "w-2/3"
            } bg-secondaryBg max-w-full h-full absolute inset-0 transition-width ease-in duration-200`}
            style={{
              width:
                currentStep > 6
                  ? "100%"
                  : currentStep === 1
                  ? isLargeScreen
                    ? elementOffset +
                      ((subStep + (subStep - 1)) * elementWidth) / 6
                    : `calc(${25 * subStep}%)`
                  : isLargeScreen
                  ? elementOffset + elementWidth / 2
                  : `calc(50%)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PolicyProgressBar;
