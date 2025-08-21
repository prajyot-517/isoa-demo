import { useNavigate } from "@remix-run/react";
import PaymentPendingIcon from "~/assets/SVGIcons/PaymentPendingIcon";
import Button from "~/components/common/Button";

const PaymentPending = () => {
  const navigate = useNavigate();

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <PaymentPendingIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Payment pending
          </h1>
          <p className="font-bold text-center md:text-lg">
            Please complete your payment if you have the payment page open.
            <br />
            <br />
            Otherwise, you can{" "}
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

export default PaymentPending;
