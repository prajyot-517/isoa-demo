import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import NothingFoundIcon from "~/assets/SVGIcons/NothingFoundIcon";
import VerifyEmailIcon from "~/components/BusinessDetailsForms/SVGIcons/VerifyEmailIcon";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import NothingFoundModal from "~/components/common/NothingFoundModal";
import Verification from "~/components/common/Verification";
import {
  AUTHENTICATION_FAILED,
  BOUND,
  CANCELLATION,
  CLOSED_LOST,
  CLOSED_WON,
  ENDORSEMENT,
  INVALID_OTP,
  NEW,
  PHONE_OTP_SENT,
  QUOTED,
  RENEWAL,
  RESEND_OTP_SENT,
  RESEND_OTP_SUCCESSFUL,
  SF_UUID,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import {
  // getCognitoUserDetails,
  verifyAuthCode,
} from "~/services/authentication.server";
import { getActivePolicyOrQuote } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { createSFUserHandler } from "~/services/sf-user.api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(session.has("username") || session.has("accessToken"))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const quoteId = searchParams.get("quoteId");
  const email = session.get("username");
  let response: any = {};

  if ((quoteId == null || quoteId == undefined) && email?.length > 0) {
    response = {
      existingCustomer: true,
      email: email,
    };
  }

  if (quoteId == "new-quote") {
    response = {
      newQuote: true,
    };
  }

  return json(response, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { businessDetails3 } = useAppContext();
  const { setToastProps } = useToast();
  const submit = useSubmit();
  const location = useLocation();

  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));
  const [isCodeWrong, setIsCodeWrong] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [openPolicyDeclinedModal, setOpenPolicyDeclinedModal] = useState(false);
  const [declinedReasons, setDeclinedReasons] = useState([]);
  const [openNothingFoundModal, setopenNothingFoundModal] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const actionData: any = useActionData();
  const response: any = useLoaderData();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const inputRefs: any = useRef([]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  //For backend errors
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
      actionData?.response?.status?.statusCode === 200 &&
      actionData?.response?.data?.policies[0]?.policy_stage?.toLowerCase() ===
        CLOSED_LOST
    ) {
      setOpenPolicyDeclinedModal(true);
      if (
        actionData?.response?.data?.policies[0]?.decline_reasons?.length > 0
      ) {
        setDeclinedReasons(
          actionData?.response?.data?.policies[0]?.decline_reasons
        );
      } else {
        setDeclinedReasons([]);
      }
    } else if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description
    ) {
      if (
        JSON.stringify(actionData?.response?.status?.description)?.includes(
          "Invalid authentication code"
        )
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
    }

    //From loader data
    if (response?.status?.statusCode !== 200 && response?.status?.description) {
      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ??
            (response?.status?.description?.name ||
              response?.status?.description)),
        variant: "error",
      });
    }
    //For otp resend
    if (
      actionData?.response?.status?.statusCode == 200 &&
      actionData?.response?.status?.description == RESEND_OTP_SENT
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.description?.message ??
          actionData?.response?.status?.description,
        variant: "success",
      });
    }
  }, [actionData, response]);

  //For refresh message
  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your changes may not be saved.";
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //To check if the quote is in quoted stage
  useEffect(() => {
    if (response?.data?.policies?.length > 0) {
      const policyStage = response?.data?.policies[0]?.policy_stage;
      if (policyStage?.toLowerCase() == QUOTED) {
        navigate("/quote?quoteId=" + quoteId);
      }
    }
  }, [response]);

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
        handleSaveAndNextButton();
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
    const formData = new FormData();
    formData.append("resendCode", true);
    submit(formData, { method: "post" });
  };

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    setIsCodeWrong(false);
    const formData = new FormData();
    formData.append("code_inputs", codeInputs);

    submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (
      (businessDetails3?.insured_contact_email === "" ||
        !businessDetails3?.insured_contact_email) &&
      !response?.email
    ) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col w-full space-y-10 py-[120px]  sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
            <div>
              <Verification
                icon={<VerifyEmailIcon />}
                resendDisabled={resendDisabled}
                setResendDisabled={setResendDisabled}
                setCountdown={setCountdown}
              >
                <div className="flex flex-col space-y-10 text-primaryBg md:space-y-16">
                  <div className="flex flex-col  space-y-10 md:space-y-12">
                    <h1 className="font-black text-2xl text-center md:text-4xl">
                      Verify Email
                    </h1>
                    <div className="font-bold text-center md:text-2xl">
                      <p>
                        We've sent a one-time password to{" "}
                        <span className="text-primaryBg">
                          {businessDetails3?.insured_contact_email
                            ? businessDetails3?.insured_contact_email
                            : response?.email
                            ? response?.email
                            : null}
                        </span>
                      </p>
                      <p className="mt-3">
                        Enter the code below to verify it’s your email.{" "}
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
                      Didn't receive it? Please check your 'Spam' or 'Junk'
                      email folder.
                      <br />
                      {countdown > 0 ? (
                        <p>
                          We can resend another code in{" "}
                          <span className="text-primaryBg">
                            {countdown} secs.
                          </span>
                        </p>
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
                            onClick={resendCode}
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
                  onClick={() => handleSaveAndNextButton()}
                  label="Next"
                  variant="filled"
                  disabled={
                    codeInputs?.join("")?.length !== 6 ||
                    ((businessDetails3?.insured_contact_email === null ||
                      businessDetails3?.insured_contact_email === "") &&
                      !response?.email)
                  }
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* If policy creation is declined */}
      <Modal
        isOpen={openPolicyDeclinedModal}
        onClose={() => setOpenPolicyDeclinedModal(false)}
        icon={<NothingFoundIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-10 items-center">
            <h1 className="font-bold text-2xl md:text-[2.5rem] md:leading-[3rem]">
              Sorry, we're unable to proceed due to the following reason(s)
            </h1>
            <ul className="list-disc md:text-xl font-bold flex flex-col space-y-4 ">
              {declinedReasons?.map((reason: any, index) => (
                <li className="w-fit" key={index}>
                  {reason?.reason}
                </li>
              ))}
            </ul>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => navigate("/")}
                label="Back to home"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />

      {/* If no active quote or  policy found */}
      <NothingFoundModal
        setOpenModal={setopenNothingFoundModal}
        openModal={openNothingFoundModal}
      />
    </div>
  );
};

export default VerifyEmail;

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(session.has("username") || session.has("accessToken"))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const isExistingUser = session.get("isExistingUser");

  try {
    const formData = await request.formData();
    const code_inputs: any = formData.get("code_inputs");
    const resendCode = formData.get("resendCode") === "true" ? true : false;

    let resData: any = {};

    const verificationCode = code_inputs?.split(",")?.join("");

    if (!session.has("authSession") && !resendCode) {
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
    }

    const authCodeValidationResult = await verifyAuthCode(
      session,
      verificationCode,
      resendCode
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
      if (session.get("isExistingUser")) {
        session.unset("isExistingUser");
        return redirect("/login", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        return redirect("/business-details-3?quoteId=new-quote", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }
    } else if (authCodeValidationResult === PHONE_OTP_SENT) {
      return redirect("/verify-phone-number", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    // const userDetails: any = await getCognitoUserDetails(session);
    // if (!userDetails[SF_UUID]) {
    //   const res = await createSFUserHandler(session, userDetails);
    //   if (res?.status?.statusCode) {
    //     // TODO: Delete user from cognito

    //     return json(
    //       { response: res },
    //       {
    //         headers: {
    //           "Set-Cookie": await commitSession(session),
    //         },
    //       }
    //     );
    //   } else {
    //     return redirect("/quote-processing?quoteId=new-quote", {
    //       headers: {
    //         "Set-Cookie": await commitSession(session),
    //       },
    //     });
    //   }
    // } else {
    //   resData = await getActivePolicyOrQuote(session);

    //   if (resData?.status?.statusCode === 200) {
    //     if (resData?.data?.policies?.length === 0) {
    //       if (isExistingUser) {
    //         return json(
    //           { isNothingFound: true },
    //           {
    //             headers: {
    //               "Set-Cookie": await commitSession(session),
    //             },
    //           }
    //         );
    //       } else {
    //         return redirect("/quote-processing?quoteId=new-quote", {
    //           headers: {
    //             "Set-Cookie": await commitSession(session),
    //           },
    //         });
    //       }
    //     } else {
    //       return json(
    //         {
    //           response: resData,
    //           isActivePolicyOrQuoteExists: true,
    //           isActiveCustomer: true,
    //         },
    //         {
    //           headers: {
    //             "Set-Cookie": await commitSession(session),
    //           },
    //         }
    //       );
    //     }
    //   } else {
    //     return json(
    //       { response: resData },
    //       { headers: { "Set-Cookie": await commitSession(session) } }
    //     );
    //   }
    // }
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
