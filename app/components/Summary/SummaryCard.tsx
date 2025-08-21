import { useNavigate } from "@remix-run/react";
import CyberGoIcon from "../Quote/Icons/CyberGoIcon";
import CyberPlusIcon from "../Quote/Icons/CyberPlusIcon";
import ViewLinkIcon from "../Quote/Icons/ViewLinkIcon";
import Button from "../common/Button";
import { useAppContext } from "~/context/ContextProvider";

const SummaryCard = ({
  policyInceptionDate,
  quoteId,
  handleDownloadDocument,
}) => {
  const product = "CyberPlus";

  const navigate = useNavigate();
  const { stepState, setStepState, productDetails } = useAppContext();
  return (
    <div>
      <div className="h-3 bg-secondaryBg rounded-t-md"></div>
      <div className="px-6 py-10 rounded-md text-primaryBg">
        <div className="flex-flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <p className="text-primaryBg">YOU'RE GETTING</p>
            {productDetails?.quoteOptionSelected?.plan_display_name?.toLowerCase() ===
            "cyberplus" ? (
              <CyberPlusIcon />
            ) : (
              <CyberGoIcon />
            )}
          </div>

          <div>
            <h1 className="font-black text-4xl">
              {productDetails?.quoteOptionSelected?.plan_display_name}
            </h1>
            <p className="text-primaryBg">
              <span className="text-3xl font-black">
                ${Number(productDetails?.quoteOptionSelected?.total_payable)}
              </span>{" "}
              per year
            </p>
            <p>(Including GST)</p>
            <p>
              Your cover begins on{" "}
              <span className="font-extrabold">{policyInceptionDate}</span>
            </p>
          </div>
          <div className="flex flex-col space-y-5">
            <Button
              onClick={() => {
                navigate("/buy-policy?quoteId=" + quoteId);
                setStepState((prevState) => ({
                  ...prevState,
                  currentStep: 6,
                  subStep: 1,
                }));
              }}
              label="Buy policy"
              variant="filled"
              disabled={false}
              showTooltip={false}
              tooltipContent=""
            />

            <div className="flex  text-grayCustom">
              <div className="flex space-x-2">
                <div className="-mt-[2px]">
                  <svg
                    width="17"
                    height="24"
                    viewBox="0 0 17 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.421 16.0093C16.1297 14.791 16.484 13.4546 16.484 12C16.5586 10.5454 16.2043 9.20902 15.421 7.99068C14.6378 6.77233 13.6681 5.80265 12.5119 5.08159C11.3558 4.36052 10.0193 4 8.50262 4C6.98591 4 5.64327 4.36052 4.47465 5.08159C3.30604 5.80265 2.34256 6.77233 1.58421 7.99068C0.825851 9.20902 0.465326 10.5454 0.502622 12C0.539919 13.4546 0.900443 14.791 1.58421 16.0093C2.26797 17.2277 3.23144 18.1974 4.47465 18.9184C5.71786 19.6395 7.0605 20 8.50262 20C9.94474 20 11.2812 19.6395 12.5119 18.9184C13.7427 18.1974 14.7124 17.2277 15.421 16.0093ZM9.82663 7.67366V6.01399C9.82663 5.91453 9.79555 5.83372 9.73339 5.77156C9.67123 5.7094 9.59042 5.67832 9.49097 5.67832H7.49563C7.39617 5.67832 7.31537 5.7094 7.25321 5.77156C7.19104 5.83372 7.15997 5.91453 7.15997 6.01399V7.67366C7.15997 7.77312 7.19104 7.85392 7.25321 7.91608C7.31537 7.97824 7.39617 8.00932 7.49563 8.00932H9.49097C9.59042 8.00932 9.67123 7.97824 9.73339 7.91608C9.79555 7.85392 9.82663 7.77312 9.82663 7.67366ZM11.1506 16.9977V15.338C11.1506 15.2385 11.1196 15.1577 11.0574 15.0956C10.9952 15.0334 10.9206 15.0023 10.8336 15.0023H9.82663V9.669C9.82663 9.56954 9.79555 9.48873 9.73339 9.42657C9.67123 9.36441 9.59042 9.33333 9.49097 9.33333H6.17162C6.07216 9.33333 5.99136 9.36441 5.9292 9.42657C5.86704 9.48873 5.83596 9.56954 5.83596 9.669V11.3287C5.83596 11.4281 5.86704 11.5089 5.9292 11.5711C5.99136 11.6333 6.07216 11.6643 6.17162 11.6643H7.15997V15.0023H6.17162C6.07216 15.0023 5.99136 15.0334 5.9292 15.0956C5.86704 15.1577 5.83596 15.2385 5.83596 15.338V16.9977C5.83596 17.0971 5.86704 17.1779 5.9292 17.2401C5.99136 17.3023 6.07216 17.3333 6.17162 17.3333H10.8336C10.9206 17.3333 10.9952 17.3023 11.0574 17.2401C11.1196 17.1779 11.1506 17.0971 11.1506 16.9977Z"
                      fill="#5841BF"
                    />
                  </svg>
                </div>
                <p className="ml-7 font-medium text-primaryBg">
                ISOA Health Insurance can only be paid annually via credit card.
                </p>
              </div>
            </div>
          </div>

          <button className="flex space-x-[0.125rem] items-center cursor-pointer text-primaryBg" onClick={() => handleDownloadDocument()}>
            <span className="underline text-secondaryBg"> View policy wording</span> &nbsp;{" "}
            <ViewLinkIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
