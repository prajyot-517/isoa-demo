import { useNavigate } from "@remix-run/react";
import PaymentFailedIcon from "~/assets/SVGIcons/PaymentFailedIcon";
import Button from "~/components/common/Button";

const PolicyGenerationFailed = (props: any) => {
  const navigate = useNavigate();

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <PaymentFailedIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Policy generation failed
          </h1>
          <p className="font-bold text-center md:text-lg">
            Your payment has been received, but there appears to be an issue
            generating your policy.
            <br />
            You should receive your policy documents over email in the next few
            hours.
            <br />
            If you do not receive your policy documents, <br /> please reach out
            to a BIC using the contact us form below or call us on{" "}
            <span className="text-secondary"> (800) 244-1180</span> (Mon-Fri
            9am-5pm).
            <br />
            <br />
            Reference:- Quote number:{" "}
            <span className="text-primaryBg"> {props?.quoteNumber}</span>
          </p>
        </div>

        <div className="w-60">
          <Button
            onClick={() => navigate("/contact-us")}
            label="Contact us"
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

export default PolicyGenerationFailed;
