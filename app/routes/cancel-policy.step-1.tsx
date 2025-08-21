import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLocation, useNavigate } from "@remix-run/react";
import Button from "~/components/common/Button";
import { verifyAuthToken } from "~/services/authentication.server";
import { getPolicyById } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(await verifyAuthToken(session))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  const { searchParams } = new URL(request.url);
  const policyId: any = searchParams.get("policyId");
  const response = await getPolicyById(session, policyId);
  return json(response, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const CancelPolicyStep1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const policyId = searchParams.get("policyId");

  const handleCancelPolicy = () => {
    navigate("/cancel-policy/step-2?policyId=" + policyId);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[1536px] w-full">
        <div className="flex flex-col space-y-10 py-[120px] sm:px-10 lg:px-28 md:space-y-16 lg:pl-[9.875rem] lg:pr-[9.375rem] lg:py-[174px]">
          <div className="flex justify-center">
            <div className="relative px-8 pt-[7.5rem] pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[6.5rem] md:pb-20 md:px-36">
              {/* Logo icon */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="60.9375"
                    cy="59.0625"
                    r="59.0625"
                    fill="#C496FF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M50.6935 28.4087L52.0336 68.5579C51.9066 70.1052 52.5116 71.6265 53.6878 72.717C54.8639 73.8076 56.4918 74.3569 58.1385 74.2187H62.6055C64.2765 74.4015 65.9468 73.8721 67.1578 72.7759C68.3688 71.6798 68.9931 70.1321 68.8593 68.5579L70.1994 28.4087C70.4696 26.8253 69.931 25.2148 68.7452 24.0605C67.5594 22.9061 65.8644 22.3423 64.1689 22.5383H56.7239C55.0284 22.3423 53.3335 22.9061 52.1477 24.0605C50.9619 25.2148 50.4233 26.8253 50.6935 28.4087ZM53.2541 83.0867C52.0504 84.2166 51.4754 85.808 51.6986 87.3921V91.6901C51.4754 93.2742 52.0504 94.8656 53.2541 95.9955C54.4578 97.1254 56.1531 97.6651 57.8407 97.4556H63.2011C64.8887 97.6651 66.584 97.1254 67.7877 95.9955C68.9914 94.8656 69.5663 93.2742 69.3432 91.6901V87.3921C69.5663 85.808 68.9914 84.2166 67.7877 83.0867C66.584 81.9568 64.8887 81.4171 63.2011 81.6265H57.8407C56.1531 81.4171 54.4578 81.9568 53.2541 83.0867Z"
                    fill="white"
                  />
                  <path
                    d="M52.0336 68.5579L53.0302 68.6397L53.0349 68.5822L53.033 68.5246L52.0336 68.5579ZM50.6935 28.4087L51.6929 28.3753L51.6907 28.3074L51.6792 28.2404L50.6935 28.4087ZM53.6878 72.717L53.0078 73.4503L53.0078 73.4503L53.6878 72.717ZM58.1385 74.2187V73.2187H58.0966L58.0549 73.2222L58.1385 74.2187ZM62.6055 74.2187L62.7142 73.2246L62.66 73.2187H62.6055V74.2187ZM67.1578 72.7759L66.4868 72.0345H66.4868L67.1578 72.7759ZM68.8593 68.5579L67.8598 68.5246L67.8579 68.5837L67.8629 68.6427L68.8593 68.5579ZM70.1994 28.4087L69.2136 28.2404L69.2022 28.3074L69.1999 28.3753L70.1994 28.4087ZM68.7452 24.0605L69.4427 23.3439L69.4427 23.3439L68.7452 24.0605ZM64.1689 22.5383V23.5383H64.2265L64.2837 23.5317L64.1689 22.5383ZM56.7239 22.5383L56.6091 23.5317L56.6663 23.5383H56.7239V22.5383ZM52.1477 24.0605L51.4501 23.3439L52.1477 24.0605ZM51.6986 87.3921H52.6986V87.322L52.6888 87.2526L51.6986 87.3921ZM53.2541 83.0867L52.5697 82.3576H52.5697L53.2541 83.0867ZM51.6986 91.6901L52.6888 91.8295L52.6986 91.7602V91.6901H51.6986ZM53.2541 95.9955L53.9385 95.2664L53.2541 95.9955ZM57.8407 97.4556V96.4556H57.7789L57.7175 96.4632L57.8407 97.4556ZM63.2011 97.4556L63.3242 96.4632L63.2629 96.4556H63.2011V97.4556ZM69.3432 91.6901H68.3432V91.7602L68.353 91.8295L69.3432 91.6901ZM69.3432 87.3921L68.353 87.2526L68.3432 87.322V87.3921H69.3432ZM67.7877 83.0867L68.4721 82.3576H68.4721L67.7877 83.0867ZM63.2011 81.6265V82.6265H63.2629L63.3242 82.6189L63.2011 81.6265ZM57.8407 81.6265L57.7175 82.6189L57.7789 82.6265H57.8407V81.6265ZM53.033 68.5246L51.6929 28.3753L49.694 28.442L51.0341 68.5913L53.033 68.5246ZM54.3677 71.9838C53.4079 71.0938 52.9293 69.8695 53.0302 68.6397L51.0369 68.4761C50.8839 70.3409 51.6153 72.1591 53.0078 73.4503L54.3677 71.9838ZM58.0549 73.2222C56.6788 73.3377 55.3307 72.8767 54.3677 71.9838L53.0078 73.4503C54.3971 74.7385 56.3049 75.3761 58.2221 75.2152L58.0549 73.2222ZM62.6055 73.2187H58.1385V75.2187H62.6055V73.2187ZM66.4868 72.0345C65.4946 72.9326 64.1105 73.3773 62.7142 73.2246L62.4967 75.2127C64.4424 75.4256 66.3991 74.8116 67.8289 73.5173L66.4868 72.0345ZM67.8629 68.6427C67.9693 69.8936 67.4755 71.1396 66.4868 72.0345L67.8289 73.5173C69.2622 72.22 70.017 70.3706 69.8557 68.4732L67.8629 68.6427ZM69.1999 28.3753L67.8598 68.5246L69.8587 68.5913L71.1988 28.442L69.1999 28.3753ZM68.0477 24.777C69.0062 25.7101 69.4265 26.993 69.2136 28.2404L71.1851 28.5769C71.5127 26.6576 70.8558 24.7195 69.4427 23.3439L68.0477 24.777ZM64.2837 23.5317C65.6914 23.369 67.085 23.8399 68.0477 24.777L69.4427 23.3439C68.0338 21.9724 66.0374 21.3157 64.0541 21.5449L64.2837 23.5317ZM56.7239 23.5383H64.1689V21.5383H56.7239V23.5383ZM52.8452 24.777C53.8079 23.8399 55.2014 23.369 56.6091 23.5317L56.8387 21.5449C54.8554 21.3157 52.859 21.9724 51.4501 23.3439L52.8452 24.777ZM51.6792 28.2404C51.4663 26.993 51.8867 25.7101 52.8452 24.777L51.4501 23.3439C50.0371 24.7195 49.3802 26.6576 49.7077 28.5769L51.6792 28.2404ZM52.6888 87.2526C52.5127 86.0026 52.9629 84.7316 53.9385 83.8158L52.5697 82.3576C51.1379 83.7016 50.4381 85.6134 50.7083 87.5316L52.6888 87.2526ZM52.6986 91.6901V87.3921H50.6986V91.6901H52.6986ZM53.9385 95.2664C52.9629 94.3506 52.5127 93.0796 52.6888 91.8295L50.7083 91.5506C50.4381 93.4688 51.1379 95.3806 52.5697 96.7246L53.9385 95.2664ZM57.7175 96.4632C56.3146 96.6374 54.9181 96.1859 53.9385 95.2664L52.5697 96.7246C53.9975 98.0648 55.9915 98.6928 57.9638 98.448L57.7175 96.4632ZM63.2011 96.4556H57.8407V98.4556H63.2011V96.4556ZM67.1033 95.2664C66.1237 96.1859 64.7271 96.6374 63.3242 96.4632L63.0779 98.448C65.0502 98.6928 67.0443 98.0648 68.4721 96.7246L67.1033 95.2664ZM68.353 91.8295C68.5291 93.0796 68.0789 94.3506 67.1033 95.2664L68.4721 96.7246C69.9039 95.3806 70.6036 93.4688 70.3334 91.5506L68.353 91.8295ZM68.3432 87.3921V91.6901H70.3432V87.3921H68.3432ZM67.1033 83.8158C68.0789 84.7316 68.5291 86.0026 68.353 87.2526L70.3334 87.5316C70.6036 85.6134 69.9039 83.7016 68.4721 82.3576L67.1033 83.8158ZM63.3242 82.6189C64.7271 82.4448 66.1237 82.8963 67.1033 83.8158L68.4721 82.3576C67.0443 81.0173 65.0502 80.3894 63.0779 80.6342L63.3242 82.6189ZM57.8407 82.6265H63.2011V80.6265H57.8407V82.6265ZM53.9385 83.8158C54.9181 82.8963 56.3146 82.4448 57.7175 82.6189L57.9638 80.6342C55.9915 80.3894 53.9975 81.0173 52.5697 82.3576L53.9385 83.8158Z"
                    fill="#3B3B3B"
                  />
                </svg>
              </div>

              <div className="flex flex-col space-y-10 text-primaryBg md:space-y-14">
                <div className="flex flex-col items-center space-y-10 md:space-y-8">
                  <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                    Are you sure you want to cancel your cyber policy?
                  </h1>
                  <div className="text-center md:text-lg text-primaryBg">
                    <p>
                      At 4 PM on your chosen cancellation date, your cover will
                      end. We’ll send you a confirmation of cancellation.
                    </p>
                    <br />
                    <p>
                      You’ll be refunded your remaining premium within 5-10
                      business days through the credit card that you used to
                      sign up with us. Once the refund has been processed, we'll
                      email you a credit note with the details of your refund
                      alongside the confirmation of your cancellation.
                    </p>
                    <br />
                    <p>
                      If you have any questions, please{" "}
                      <span
                        className="text-secondary underline cursor-pointer"
                        onClick={() => navigate("/contact-us")}
                      >
                        contact us
                      </span>{" "}
                      or give us a call at{" "}
                      <span className="text-secondary"> (800) 244-1180 </span>
                      (Mon-Fri 9am-5pm).
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse items-center w-full sm:flex-row sm:justify-between">
                  <div className="w-60 mt-3 sm:mt-0">
                    <Button
                      onClick={() => {
                        navigate("/my-policy?policyId=" + policyId);
                      }}
                      label="No, go back"
                      variant=""
                      disabled={false}
                      showTooltip={false}
                      tooltipContent=""
                    />
                  </div>
                  <div className="w-60">
                    <Button
                      onClick={() => handleCancelPolicy()}
                      label="Yes, continue"
                      variant="filled"
                      disabled={false}
                      showTooltip={false}
                      tooltipContent=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPolicyStep1;
