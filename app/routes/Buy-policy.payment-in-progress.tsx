import PaymentPendingIcon from "~/assets/SVGIcons/PaymentPendingIcon";

const PaymentInProgress = () => {
  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <PaymentPendingIcon />
        </div>

        <div className="flex flex-col items-center space-y-2 md:space-y-2 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Payment in progress
          </h1>
          <p className="font-bold text-center md:text-lg">
            <br />
            <br />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-secondaryBg rounded-full animate-loader" />
              <div className="h-8 w-8 bg-secondaryBg rounded-full animate-loader animation-delay-200" />
              <div className="h-8 w-8 bg-secondaryBg rounded-full animate-loader animation-delay-400" />
            </div>
          </p>
        </div>

        {/* <div className="w-60">
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
				</div> */}
      </div>
    </div>
  );
};

export default PaymentInProgress;
