import ViewLinkIcon from "~/components/Quote/Icons/ViewLinkIcon";
import Button from "../Button";
import { Link } from "@remix-run/react";

const AdditionalInsuranceCTA = () => {
  return (
    <div className="flex px-6 py-8 bg-white md:bg-custom-gradient sm:px-10 lg:px-[6.25rem] 3xl:px-40 md:py-[4.5rem]">
      <div className="flex justify-center w-full">
        <div className="w-full max-w-[1216px]  flex flex-col  space-y-3 md:flex-row md:space-x-6  md:space-y-0 sm:items-center justify-between">
          <p className="font-bold md:font-black text-xl md:text-[1.65rem] text-start text-primaryBg md:text-white md:text-4xl">
            Looking for other types of insurance to protect your business?
          </p>
          <div className="w-full sm:w-[8.5rem] hidden md:block">
            <Button
              onClick={() =>
                window.open("https://www.myob.com/au", "_blank")
              }
              label="View More"
              variant=""
              disabled={false}
              showTooltip={false}
              tooltipContent=""
              id="addtional_insurance_cta_view_more_btn"
            />
          </div>
          <p className="text-secondary cursor-pointer flex space-x-1 items-center md:hidden">
            <Link
              to="https://www.myob.com/au"
              target="_blank"
              className="underline"
            >
              {" "}
              View more
            </Link>{" "}
            <ViewLinkIcon />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInsuranceCTA;
