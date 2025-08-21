import { useNavigate } from "@remix-run/react";
import TechnicalErrorIcon from "~/assets/SVGIcons/TechnicalErrorIcon";
import Button from "~/components/common/Button";

const NothingFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <TechnicalErrorIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Nothing found
          </h1>
          <p className="font-bold text-center md:text-lg">
            Get a quote or if you already have an existing quote or policy,
            please login.
          </p>
        </div>

        <div className="flex flex-col-reverse items-center w-full sm:flex-row sm:justify-between">
          <div className="w-60 mt-3 sm:mt-0">
            <Button
              onClick={() => {
                navigate("/");
              }}
              label="Get a quote"
              variant=""
              disabled={false}
              showTooltip={false}
              tooltipContent=""
            />
          </div>
          <div className="w-60">
            <Button
              onClick={() => {
                navigate("/login");
              }}
              label="Login"
              variant=""
              disabled={false}
              showTooltip={false}
              tooltipContent=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NothingFound;
