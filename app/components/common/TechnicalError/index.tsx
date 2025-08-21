import TechnicalErrorIcon from "~/assets/SVGIcons/TechnicalErrorIcon";
import Button from "../Button";
import { useNavigate } from "@remix-run/react";

const TechnicalErrorComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <TechnicalErrorIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Looks like something went wrong
          </h1>
          <p className="font-bold text-center md:text-lg">
            Try again later. You can{" "}
            <span
              className="underline cursor-pointer text-secondary"
              onClick={() => navigate("/contact-us")}
            >
              contact us
            </span>{" "}
            or give us a call on
            <br />
            <span className="cursor-pointer text-secondary">
              {" "}
              (800) 244-1180
            </span>{" "}
            (Mon-Fri 9am-5pm) and we’ll get you sorted.
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

export default TechnicalErrorComponent;
