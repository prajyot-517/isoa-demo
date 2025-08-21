import { useNavigate } from "@remix-run/react";
import TooManyFailedAttemptsIcon from "~/assets/SVGIcons/TooManyFailedAttemptsIcon";
import Button from "~/components/common/Button";

const TooManyFailedAttempts = () => {
  const navigate = useNavigate();

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <TooManyFailedAttemptsIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Too many failed attempts
          </h1>
          <p className="font-bold text-center md:text-lg">
            Sorry, to safeguard our system and data, you've temporarily been
            blocked.
            <br />
            Try again in 10 mins.
          </p>
        </div>

        <div className="w-60">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            label="Try again"
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

export default TooManyFailedAttempts;
