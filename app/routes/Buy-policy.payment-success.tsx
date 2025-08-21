import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import PolicyGenerationFailed from "~/components/PolicyGenerationFailed";
import AdditionalInsuranceCTA from "~/components/common/AdditionalInsuranceCTA";
import Button from "~/components/common/Button";
import FastLoader from "~/components/common/FastLoader";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import { BOUND, COMPLETE, SUCCESS } from "~/constants/string";
import { useAppContext } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  bindQuote,
  getPaymentGatewayResult,
  getPolicyById,
} from "~/services/quote.api";
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
  const sessionId: any = searchParams.get("sessionId");
  const response = await getPaymentGatewayResult(session, sessionId);

  if (response?.status == 200 && response?.data?.state == COMPLETE) {
    if (response?.data?.metaData?.length > 0) {
      const payload = {
        windcave_data: { session_id: sessionId },
      };
      const fetchPolicyById = await getPolicyById(
        session,
        response?.data?.metaData?.[0]
      );

      if (
        fetchPolicyById?.data?.policies[0]?.policy_stage?.toLowerCase() == BOUND
      ) {
        return json(fetchPolicyById, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }

      const resData = await bindQuote(session, payload);

      if (resData?.status?.message === SUCCESS) {
        return json(resData, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        return json(
          { ...resData, quoteNumber: response?.data?.metaData?.[1] },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      }
    } else {
      return json(
        {
          response: {
            status: 400,
            message: "Error-Payment gateway data not retrieved!",
          },
        },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    }
  } else {
    return json(response, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

const PaymentSuccess = () => {
  const { stepState, setToastProps, setStepState } = useAppContext();
  const response: any = useLoaderData<typeof loader>();
  const [policyId, setPolicyId] = useState<any>();
  const [isPolicyBindFailed, setIsPolicyBindFailed] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      response?.status?.statusCode == 200 &&
      response?.data?.policies?.length > 0
    )
      setPolicyId(response?.data?.policies[0]?.policy_id);
  }, [response]);

  //For backend errors
  useEffect(() => {
    if (response?.status !== 200 && response?.message) {
      setStepState((prevState) => ({
        ...prevState,
        currentStep: 6,
        subStep: 1,
      }));

      setIsPolicyBindFailed(true);

      setToastProps({
        message:
          response?.status +
          "-" +
          (response?.status?.description?.message ?? response?.message),
        variant: "error",
      });
    } else if (
      response?.status?.statusCode !== 200 &&
      response?.status?.description
    ) {
      setStepState((prevState) => ({
        ...prevState,
        currentStep: 6,
        subStep: 1,
      }));

      setIsPolicyBindFailed(true);

      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ??
            response?.status?.description),
        variant: "error",
      });
    } else {
      setStepState((prevState) => ({
        ...prevState,
        currentStep: 7,
        subStep: 1,
      }));

      setIsPolicyBindFailed(false);
    }
  }, [response]);

  const handleSubmit = () => {
    if (policyId?.length > 0) {
      navigate("/my-policy?policyId=" + policyId);
    } else {
      setToastProps({
        message: "Policy not yet generated",
        variant: "error",
      });
    }
  };

  return (
    <div>
      {/* Progress bar */}
      <div>
        <PolicyProgressBar
          currentStep={stepState?.currentStep}
          subStep={stepState?.subStep}
        />
      </div>

      {!isPolicyBindFailed ? (
        <>
          <div className="flex justify-center">
            <div className="max-w-[1536px] w-full">
              <div className="flex flex-col space-y-10 py-[120px] sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
                <div className="flex justify-center">
                  <div className="relative px-8 pt-28 pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-36 md:pb-20">
                    {/* Logo icon */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg
                        width="120"
                        height="120"
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
                          d="M51.3327 84.375C49.3684 84.376 47.4836 83.5825 46.0903 82.1679L31.6882 67.4542C29.4373 65.1545 29.4373 61.4259 31.6882 59.1262C33.9392 56.8265 37.5888 56.8265 39.8398 59.1262L51.2175 70.7206L83.9102 37.3498C86.1612 35.0501 89.8108 35.0501 92.0618 37.3498C94.3128 39.6495 94.3128 43.3781 92.0618 45.6778L56.4886 82.0208C55.142 83.4708 53.2883 84.3172 51.3327 84.375Z"
                          fill="white"
                          stroke="#3B3B3B"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col space-y-10 text-primaryBg md:space-y-16">
                      <div className="flex flex-col items-center space-y-10 md:space-y-12">
                        <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                          Thank you for your payment
                        </h1>
                        {!policyId ? (
                          <div className="font-bold text-center md:text-lg flex flex-col items-center">
                            <p>We are generating your policy.</p>
                            <div className="flex gap-2 mt-12">
                              <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader" />
                              <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-200" />
                              <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-400" />
                            </div>
                          </div>
                        ) : (
                          <>
                            {" "}
                            <div className="font-bold text-center md:text-lg">
                              <p>Your business is now covered.</p>
                              <p>
                                We'll send you an email with your policy
                                documents and tax receipt.
                              </p>
                            </div>
                            <div className="w-60">
                              <Button
                                onClick={() => {
                                  handleSubmit();
                                }}
                                label="View policy"
                                variant="filled"
                                disabled={false}
                                showTooltip={false}
                                tooltipContent=""
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <AdditionalInsuranceCTA />
          </div>
        </>
      ) : (
        <PolicyGenerationFailed quoteNumber={response?.quoteNumber} />
      )}
    </div>
  );
};

export default PaymentSuccess;
