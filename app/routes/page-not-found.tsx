import { useNavigate } from "@remix-run/react";
import TechnicalErrorIcon from "~/assets/SVGIcons/TechnicalErrorIcon";
import Button from "~/components/common/Button";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <TechnicalErrorIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Page not found
          </h1>
          <p className="font-bold text-center md:text-lg">
            Sorry, the page you're looking for doesn’t exist or has been moved.
          </p>
        </div>

        <div className="w-60">
          <Button
            onClick={() => {
              navigate("/");
            }}
            label="Back to home"
            variant="filled"
            disabled={false}
            showTooltip={false}
            tooltipContent=""
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
