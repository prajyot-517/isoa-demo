import { Link, useNavigate } from "@remix-run/react";
import Button from "../Button";

const GetInTouchCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="relative px-9 pt-[4.5rem] pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-md sm:p-14 sm:pt-24">
        {/* Logo icon */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            width="92"
            height="92"
            viewBox="0 0 92 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="46.7188" cy="45.2812" r="45.2812" fill="#A97155" />
            <circle
              cx="47.4375"
              cy="47.4375"
              r="28.75"
              fill="white"
              stroke="#3B3B3B"
              strokeWidth="2"
            />
            <path
              d="M37.8535 52.5977C39.0194 56.9468 42.9489 59.9695 47.4368 59.9695C51.9248 59.9695 55.8542 56.9468 57.0202 52.5977"
              stroke="#3B3B3B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="58.2188"
              cy="39.5312"
              r="3.59375"
              fill="#3B3B3B"
              stroke="white"
            />
            <circle
              cx="36.6562"
              cy="39.5312"
              r="3.59375"
              fill="#3B3B3B"
              stroke="white"
            />
          </svg>
        </div>

        <div className="flex flex-col space-y-10 items-center text-primaryBg">
          <div className="flex flex-col space-y-6 items-center">
            <div>
              <h1 className="text-center leading-9 font-bold text-[1.90rem] sm:text-[2.5rem]">
                How to get in touch with us
              </h1>
            </div>
            <div>
              <p className="text-center">
                Have questions about Health Insurance or your quote?
              </p>
              <p className="text-center">
                Send us a message and one of our Health Insurance Specialists
                will get back to you within 1-3 business days.
                <span className="hidden md:inline-block">&nbsp;</span>
                <br className="md:block hidden" /> 
                {/* Or, you can visit our{" "}
                <Link
                  to="https://www.ami.co.nz/business/cyber-faqs"
                  target=""
                  className="text-secondary underline cursor-pointer"
                  rel="noreferrer"
                >
                  Frequently Asked Questions
                </Link>{" "}
                page to find quick answers to questions you may have. */}
              </p>
            </div>
          </div>
          {/* <div className="w-60 mt-3 sm:mt-0">
            <Button
              onClick={() => {
                navigate("/contact-us");
              }}
              label="Contact us"
              variant=""
              disabled={false}
              showTooltip={false}
              tooltipContent=""
              id="get_in_touch_contact_us"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default GetInTouchCard;
