import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import VerifyPhoneIcon from "~/assets/SVGIcons/VerifyPhoneIcon";
import Button from "~/components/common/Button";
import NothingFoundModal from "~/components/common/NothingFoundModal";
import Verification from "~/components/common/Verification";
import {
  AUTHENTICATION_FAILED,
  BOUND,
  CANCELLATION,
  CLOSED_WON,
  ENDORSEMENT,
  INVALID_OTP,
  INVALID_PHONE_OTP,
  NEW,
  OTP_EXPIRED,
  OTP_LIMIT_REACHED,
  PHONE_OTP_SENT,
  PHONE_OTP_VERIFICATION_SUCCESSFUL,
  QUOTED,
  RENEWAL,
  RESEND_OTP_SENT,
  RESEND_OTP_SUCCESSFUL,
  TOO_MANY_REQUESTS,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import {
  generatePhoneOTP,
  verifyAuthCode,
  verifyAuthToken,
  verifyPhoneOTP,
} from "~/services/authentication.server";
import { getActivePolicyOrQuote, getPolicyById } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { maskPhone } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const phoneNumber = session.get("deliveryPhone");
  if (
    !(
      (session.has("deliveryPhone") && session.has("authSession")) ||
      (session.has("accessToken") && (await verifyAuthToken(session)))
    )
  ) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  if (quoteId !== null || undefined) {
    const response = await getPolicyById(session, quoteId);
    return json(
      {
        response,
        phoneNumber,
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  }
  return json(
    {
      phoneNumber,
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

const VerifyPhoneNumber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contactDetails } = useAppContext();
  const loaderData: any = useLoaderData();
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));
  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [openNothingFoundModal, setopenNothingFoundModal] = useState(false);

  const submit = useSubmit();
  const { setToastProps } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const actionData: any = useActionData();
  const inputRefs: any = useRef([]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newCodeInputs = [...codeInputs];
    newCodeInputs[index] = value;
    setCodeInputs(newCodeInputs);

    if (value.length === 1 && index < codeInputs.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: any, e: any) => {
    if (e.key === "Enter") {
      const firstEmptyIndex = codeInputs.findIndex((input) => input === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex].focus();
      } else {
        handleSubmit();
      }
    } else if (e.key === "Backspace" && codeInputs[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData
      .getData("text")
      ?.replace(/^\s+|\s+$/g, "");
    if (pastedData.length === codeInputs.length) {
      const newCodeInputs = pastedData.split("").slice(0, codeInputs.length);
      setCodeInputs(newCodeInputs);
      newCodeInputs.forEach((char, i) => {
        inputRefs.current[i].value = char;
      });
      inputRefs.current[codeInputs.length - 1].focus();
      e.preventDefault();
    }
  };

  const resetCodeInputs = () => {
    setCodeInputs(Array(6).fill(""));
  };

  const resendCode = () => {
    setCountdown(30);
    setResendDisabled(true);
    setIsCodeExpired(false);
    setIsCodeWrong(false);
    resetCodeInputs();
  };

  useEffect(() => {
    //From action data
    if (actionData?.isNothingFound) {
      setopenNothingFoundModal(true);
    } else if (actionData?.isActivePolicyOrQuoteExists) {
      let foundQuote: any = null;
      let foundPolicy: any = null;

      if (actionData?.response?.data?.policies?.length > 0) {
        if (actionData?.response?.data?.policies?.length === 1) {
          foundQuote = actionData?.response?.data?.policies?.find(
            (policy: any) => {
              return (
                policy.policy_stage?.toLowerCase() === QUOTED &&
                policy.policy_type?.toLowerCase() === NEW
              );
            }
          );

          foundPolicy = actionData?.response?.data?.policies?.find(
            (policy: any) => {
              return (
                (policy.policy_stage?.toLowerCase() === BOUND ||
                  policy.policy_stage?.toLowerCase() === CLOSED_WON) &&
                (policy.policy_type?.toLowerCase() === NEW ||
                  policy.policy_type?.toLowerCase() === ENDORSEMENT ||
                  policy.policy_type?.toLowerCase() === RENEWAL)
              );
            }
          );
        } else {
          foundQuote = actionData?.response?.data?.policies?.find(
            (policy: any) => {
              return (
                policy.policy_stage?.toLowerCase() === QUOTED &&
                policy.policy_type?.toLowerCase() === RENEWAL
              );
            }
          );

          foundPolicy = actionData?.response?.data?.policies?.find(
            (policy: any) => {
              return (
                (policy.policy_stage?.toLowerCase() === BOUND ||
                  policy.policy_stage?.toLowerCase() === CLOSED_WON) &&
                (policy.policy_type?.toLowerCase() === NEW ||
                  policy.policy_type?.toLowerCase() === ENDORSEMENT ||
                  policy.policy_type?.toLowerCase() === RENEWAL)
              );
            }
          );
        }
      }

      if (!foundQuote && !foundPolicy) {
        setopenNothingFoundModal(true);
      } else {
        if (actionData?.isActiveCustomer) {
          if (foundQuote) {
            navigate(`/active-quote-found?quoteId=${foundQuote.policy_id}`);
          } else if (foundPolicy) {
            navigate(`/active-policy-found?policyId=${foundPolicy.policy_id}`);
          }
        }
      }
    } else if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description
    ) {
      if (
        actionData?.response?.status?.description
          ?.toLowerCase()
          ?.includes("invalid authentication code")
      ) {
        setIsCodeWrong(true);
      } else {
        setToastProps({
          message:
            actionData?.response?.status?.message +
            "-" +
            (actionData?.response?.status?.description?.message ??
              actionData?.response?.status?.description),
          variant: "error",
        });
      }
    } else if (
      actionData?.response?.status?.statusCode == 200 &&
      actionData?.response?.status?.description == RESEND_OTP_SENT
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.message +
          "-" +
          (actionData?.response?.status?.description?.message ??
            actionData?.response?.status?.description),
        variant: "success",
      });
    }
  }, [actionData]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("code_inputs", codeInputs);
    formData.append("quoteId", quoteId);
    submit(formData, { method: "post" });
  };

  //Resend otp functionality
  const handleResendOtp = () => {
    setCountdown(30);
    setResendDisabled(true);
    setIsCodeWrong(false);
    resetCodeInputs();

    const formData = new FormData();
    formData.append("isResendOtp", true);
    submit(formData, { method: "post" });
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col space-y-10 py-[120px] sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
            <div>
              <Verification
                icon={<VerifyPhoneIcon />}
                resendDisabled={resendDisabled}
                setResendDisabled={setResendDisabled}
                setCountdown={setCountdown}
              >
                <div className="flex flex-col space-y-10 text-primaryBg md:space-y-16">
                  <div className="flex flex-col  space-y-10 md:space-y-12">
                    <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                      Verify phone number
                    </h1>
                    <div className="font-bold text-center md:text-2xl">
                      <p>
                        Enter the one-time password that was sent to{" "}
                        <span className="text-primaryBg">
                          {contactDetails?.insured_contact_phone
                            ? maskPhone(contactDetails?.insured_contact_phone)
                            : loaderData?.phoneNumber
                            ? loaderData?.phoneNumber
                            : null}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col  space-y-6 md:space-y-10">
                    <Form method="post">
                      <div className="flex justify-center gap-2 md:gap-5">
                        {codeInputs.map((value, index) => (
                          <input
                            ref={(el) => (inputRefs.current[index] = el)}
                            key={index}
                            type="text"
                            maxLength={1}
                            className={`w-10 h-11 text-center border outline-none rounded md:w-11 ${
                              isCodeWrong || isCodeExpired
                                ? "border-[#CC0000]"
                                : "border-primaryBg"
                            }`}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            placeholder="0"
                            required
                            value={value}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => index === 0 && handlePaste(e)}
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>
                      {isCodeWrong && (
                        <p className="text-[#CC0000] text-center mt-4">
                          Wrong code entered.
                        </p>
                      )}
                    </Form>

                    <div className="text-center text-sm md:text-base">
                      {countdown > 0 ? (
                        <div className="flex flex-col md:flex-row md:justify-center">
                          <span>Didn't receive it? </span>
                          <p>
                            &nbsp; Resend code in{" "}
                            <span className="text-primaryBg">
                              {countdown} secs.
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p>
                          {isCodeExpired ? (
                            <span className="text-[#CC0000]">
                              Code has expired.
                            </span>
                          ) : (
                            "You can also"
                          )}{" "}
                          <span
                            className="cursor-pointer text-primaryBg underline"
                            onClick={handleResendOtp}
                          >
                            Request a new code.
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Verification>
            </div>

            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between ">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() => navigate(-1)}
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={handleSubmit}
                  label="Next"
                  variant="filled"
                  disabled={codeInputs?.join("")?.length !== 6}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If no active quote or  policy found */}
      <NothingFoundModal
        setOpenModal={setopenNothingFoundModal}
        openModal={openNothingFoundModal}
      />
    </div>
  );
};

export default VerifyPhoneNumber;

export async function action({ request }: ActionFunctionArgs) {
  try {
    const session = await getSession(request.headers.get("cookie"));

    const isExistingUser = session.get("isExistingUser");

    const formData = await request.formData();
    const code_inputs: any = formData.get("code_inputs");
    const verificationCode = code_inputs?.split(",")?.join("");
    const quoteId = formData.get("quoteId");
    const isResendOtp = formData.get("isResendOtp") === "true";

    if (session.has("accessToken")) {
      if (!(await verifyAuthToken(session))) {
        return redirect("/login", {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        });
      }
      if (isResendOtp) {
        const generatePhoneOTPResponse = await generatePhoneOTP(session);
        if (generatePhoneOTPResponse == OTP_LIMIT_REACHED) {
          return json({
            response: {
              status: {
                statusCode: 400,
                message: "Error",
                description:
                  " OTP limit reached. Please try again after some time.",
              },
            },
          });
        } else if (generatePhoneOTPResponse == TOO_MANY_REQUESTS) {
          return json({
            response: {
              status: {
                statusCode: 400,
                message: "Error",
                description:
                  " Too many requests for OTP. Please try again after some time.",
              },
            },
          });
        } else if (generatePhoneOTPResponse != PHONE_OTP_SENT) {
          return json({
            response: {
              status: {
                statusCode: 400,
                message: "Error",
                description: " OTP generation failed",
              },
            },
          });
        } else if (generatePhoneOTPResponse == PHONE_OTP_SENT) {
          return json({
            response: {
              status: {
                statusCode: 200,
                message: "Success",
                description: RESEND_OTP_SENT,
              },
            },
          });
        }
      }

      const verifyPhoneOTPResponse = await verifyPhoneOTP(
        session,
        verificationCode
      );

      if (verifyPhoneOTPResponse === INVALID_PHONE_OTP) {
        return json({
          response: {
            status: {
              message: "Error",
              statusCode: 400,
              description: "Invalid authentication code",
            },
          },
        });
      } else if (verifyPhoneOTPResponse == OTP_EXPIRED) {
        return json({
          response: {
            status: {
              message: "Error",
              statusCode: 400,
              description: "OTP expired. Please try again.",
            },
          },
        });
      } else if (verifyPhoneOTPResponse == OTP_LIMIT_REACHED) {
        return json({
          response: {
            status: {
              message: "Error",
              statusCode: 400,
              description:
                "OTP limit reached. Please try again after some time.",
            },
          },
        });
      } else if (verifyPhoneOTPResponse == TOO_MANY_REQUESTS) {
        return json({
          response: {
            status: {
              message: "Error",
              statusCode: 400,
              description:
                "Too many requests. Please try again after some time.",
            },
          },
        });
      } else if (verifyPhoneOTPResponse != PHONE_OTP_VERIFICATION_SUCCESSFUL) {
        return json({
          response: {
            status: {
              message: "Error",
              statusCode: 400,
              description: "Phone verification failed",
            },
          },
        });
      }

      return redirect("/final-questions?quoteId=" + quoteId, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } else {
      const authCodeValidationResult = await verifyAuthCode(
        session,
        verificationCode,
        isResendOtp,
        "PHONE"
      );

      if (authCodeValidationResult === INVALID_OTP) {
        return json(
          {
            response: {
              status: {
                statusCode: 400,
                message: "Error",
                description: "Invalid authentication code",
              },
            },
          },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      } else if (authCodeValidationResult === RESEND_OTP_SUCCESSFUL) {
        return json(
          {
            response: {
              status: {
                statusCode: 200,
                message: "Success",
                description: "OTP sent successfully.",
              },
            },
          },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      } else if (authCodeValidationResult === AUTHENTICATION_FAILED) {
        session.flash(
          "error",
          "You have consumed all OTP attempts, try logging in again."
        );
        return redirect("/login", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else if (authCodeValidationResult === PHONE_OTP_SENT) {
        return redirect("/verify-phone-number", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }

      const resData = await getActivePolicyOrQuote(session);
      if (resData?.status?.statusCode === 200) {
        if (resData?.data?.policies?.length === 0) {
          if (isExistingUser) {
            return json(
              { isNothingFound: true },
              {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              }
            );
          } else {
            return redirect("/quote-processing?quote=new-quote", {
              headers: {
                "Set-Cookie": await commitSession(session),
              },
            });
          }
        } else {
          return json(
            {
              response: resData,
              isActivePolicyOrQuoteExists: true,
              isActiveCustomer: true,
            },
            { headers: { "Set-Cookie": await commitSession(session) } }
          );
        }
      } else {
        return redirect("/technical-error", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    return {
      response: {
        status: {
          statusCode: 500,
          message: "Error",
          description: "Internal Server Error",
        },
        data: {
          policies: [],
        },
      },
    };
  }
}
