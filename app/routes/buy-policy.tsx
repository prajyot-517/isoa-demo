import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import CyberGoIcon from "~/components/Quote/Icons/CyberGoIcon";
import CyberPlusIcon from "~/components/Quote/Icons/CyberPlusIcon";
import Button from "~/components/common/Button";
import Checkbox from "~/components/common/Checkbox";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import { NEW, SUCCESS } from "~/constants/string";
import { useAppContext } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  createPaymentGatewaySession,
  getPolicyById,
  getQuoteById,
  storeWindcaveSession,
  updatePolicy,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { formatAmount, isDateInRangeOf60Days, isObjectInArray } from "~/utils";

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
  const quoteId: any = searchParams.get("quoteId");
  const response = await getPolicyById(session, quoteId);
  return json(
    { response, env: { PORTAL_URL: process.env.PORTAL_URL } },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
}

const BuyPolicy = () => {
  const navigate = useNavigate();
  const { stepState, setStepState, productDetails, setToastProps } =
    useAppContext();
  const loaderData = useLoaderData<typeof loader>();
  const response = loaderData?.response;
  const [isDeclarationAccepted, setIsDeclarationAccepted] =
    useState<any>(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId: any = searchParams.get("quoteId");
  const data = response?.data?.policies[0];
  const actionData: any = useActionData();
  const submit = useSubmit();
  const [isSubmit, setSubmit] = useState(false);
  let domain: any = loaderData?.env?.PORTAL_URL; //For payment gateway purpose

  function getTodaysDate() {
    const date = new Date();
    const options: any = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  //For backend errors
  useEffect(() => {
    if (actionData?.quoteUpdated) {
      setToastProps({
        variant: "warning",
        message:
          "Your quote has changed. Please review your quote once again before proceeding to payment.",
      });
      navigate("/quote?quoteId=" + quoteId);
    }
    if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.message +
          "-" +
          (actionData?.response?.status?.description?.message ??
            actionData?.response?.status?.description),
        variant: "error",
      });
    }
    if (actionData?.response?.status !== 200 && actionData?.response?.message) {
      setToastProps({
        message:
          actionData?.response?.status + "-" + actionData?.response?.message,
        variant: "error",
      });
    }
  }, [actionData]);

  //To check if the quote option selected is empty
  useEffect(() => {
    if (Object?.keys(productDetails?.quoteOptionSelected)?.length == 0) {
      navigate("/quote?quoteId=" + quoteId);
    }
  }, [productDetails]);

  useEffect(() => {
    if (!isSubmit) {
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to leave? Your changes may not be saved.";
      };

      window.addEventListener("beforeunload", beforeUnloadHandler);

      return () => {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      };
    }
  }, [isSubmit]);

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    if (
      response?.data?.policies[0]?.policy_type?.toLowerCase() === NEW &&
      !isDateInRangeOf60Days(response?.data?.policies[0]?.policy_inception_date)
    ) {
      setToastProps({
        variant: "warning",
        message:
          "Your quote is no longer valid since your inception date is in the past. Please correct the policy inception date to proceed.",
      });
      navigate("/final-questions?quoteId=" + quoteId);
      return;
    }

    const formData = new FormData();
    formData.append(
      "confirm_accepted_policy_declaration",
      isDeclarationAccepted
    );
    formData.append("quote_id", quoteId);
    formData.append(
      "quote_number",
      response?.data?.policies[0]?.quote?.quote_number
    );
    formData.append(
      "quote_option_id",
      productDetails?.quoteOptionSelected?.quote_option_id
    );
    formData.append(
      "total_payable",
      productDetails?.quoteOptionSelected?.total_payable
    );
    formData.append(
      "payment_success_url",
      `${domain}/buy-policy/payment-success`
    );
    formData.append(
      "payment_failed_url",
      `${domain}/buy-policy/payment-failed`
    );
    formData.append(
      "selectedQuote",
      JSON.stringify(productDetails?.quoteOptionSelected, null, 2)
    );

    if (response && !response.newQuote && response?.data?.policies[0]) {
      const data = response?.data?.policies[0];
      formData.append("isUpdate", "true");
      formData.append("response", JSON.stringify(data, null, 2));
    }
    submit(formData, { method: "post" });
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

      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="md:px-28 lg:px-40">
            <div className="flex flex-col space-y-4 px-9 sm:px-16 md:px-0 pt-20 pb-16 text-primaryBg">
              <h1 className="font-black text-3xl ">Buy policy</h1>
              <h3 className="font-bold text-xl">
                Before you continue, please read the important information
                below.
              </h3>
            </div>

            {/* Declaration form */}
            <div className="pb-10 md:pb-16">
              <div className="bg-white md:rounded-md border-0 shadow-custom">
                <div className="px-9 py-14 sm:px-16 rounded-md 3xl:px-28">
                  <div className="flex flex-col space-y-8 text-primaryBg">
                    <div className="flex flex-col space-y-8 justify-center sm:pl-7 sm:space-y-0 sm:justify-start sm:items-center sm:flex-row sm:space-x-8">
                      {productDetails?.quoteOptionSelected?.plan_display_name?.toLowerCase() ===
                      "cyberplus" ? (
                        <CyberPlusIcon />
                      ) : (
                        <CyberGoIcon />
                      )}
                      <div>
                        <h1 className="font-black text-4xl">
                          {
                            productDetails?.quoteOptionSelected
                              ?.plan_display_name
                          }
                        </h1>
                        <p className="text-primaryBg">
                          <span className="text-3xl font-black">
                            $
                            {formatAmount(
                              Number(
                                productDetails?.quoteOptionSelected
                                  ?.total_payable
                              )
                            )}
                          </span>{" "}
                          per year
                        </p>
                        <p>(Including GST)</p>
                        <p>
                          Your cover begins on{" "}
                          <span className="font-extrabold">
                            {data?.policy_inception_date}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="sm:px-16 py-6 sm:rounded-lg sm:bg-softBg text-primaryBg">
                      <h2 className="text-primaryBg font-bold text-lg">
                        Important information
                      </h2>

                      <br />

                      <p>
                        The information you give us must be accurate and
                        complete. This is so we can decide whether or not to
                        accept your application for insurance and what terms
                        should apply to it. If the information you give us isn't
                        accurate and complete, your application for insurance
                        may be declined, we may reduce your claim or we may void
                        your policy from the outset. If anything changes, you
                        must also tell us.
                      </p>

                      <br />

                      <p>
                        We collect, hold and use your personal information for
                        insurance-related and marketing purposes. We may
                        disclose it to others, including related companies of
                        MYOB (including IAG Australia Limited), our suppliers,
                        your financiers and the insurance industry, including
                        the Insurance Claims Register which holds information on
                        claims. If you give us information about someone else,
                        you confirm you’ve got their permission, and you need to
                        know that their information may be treated in the same
                        way as yours. You may request access to or correction of
                        the information we hold about you.{" "}
                      </p>

                      <br />
                      <p>
                      MYOB is a business division of IAG Australia Limited,
                        which has a financial strength rating of AA from
                        Standard & Poor’s (Australia) Pty Ltd.
                      </p>
                      <br />
                      <ul className="text-secondary ">
                        {/* <li>
                          <Link
                            to="https://www.ami.co.nz/about/financial-position"
                            target="_blank"
                            className="underline cursor-pointer"
                            rel="noreferrer"
                          >
                            MYOB's financial strength rating
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            to="https://www.myob.com/au/legal/privacy-policy"
                            target="_blank"
                            className="underline cursor-pointer"
                            rel="noreferrer"
                          >
                            MYOB privacy policy
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://www.myob.com/au/legal/website-terms-of-use"
                            target="_blank"
                            className="underline cursor-pointer"
                            rel="noreferrer"
                          >
                            MYOB terms of use
                          </Link>
                        </li>
                      </ul>
                      <br />
                      <p>
                        Clicking “Yes, I agree” means you have read all the
                        important information above, including Cylo’s privacy
                        policy and website terms of use and MYOB's financial
                        strength rating.
                      </p>

                      <div className="flex flex-col space-y-5 mt-8">
                        <div>
                          <Checkbox
                            label="Yes, I agree"
                            name="1"
                            checked={isDeclarationAccepted}
                            onChange={(e) =>
                              setIsDeclarationAccepted(e.target.checked)
                            }
                          />
                        </div>
                        <p>Date of declaration {getTodaysDate()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse items-center w-full pb-20 sm:px-9 sm:flex-row sm:justify-between md:pb-40 md:px-0">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() => {
                    navigate("/summary?quoteId=" + quoteId);
                    setStepState((prevState) => ({
                      ...prevState,
                      currentStep: 5,
                      subStep: 1,
                    }));
                  }}
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={() => {
                    setSubmit(true);
                    handleSaveAndNextButton();
                    setStepState((prevState) => ({
                      ...prevState,
                      currentStep: 7,
                      subStep: 1,
                    }));
                  }}
                  label="Continue to payment"
                  variant="filled"
                  disabled={!isDeclarationAccepted}
                  showTooltip={!isDeclarationAccepted}
                  tooltipContent="Oops! Please agree to the declaration to continue to payment."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPolicy;

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(await verifyAuthToken(session))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  const formData = await request.formData();
  const confirm_accepted_policy_declaration = formData.get(
    "confirm_accepted_policy_declaration"
  );
  const quote_id: any = formData.get("quote_id");
  const quote_number: any = formData.get("quote_number");
  const quote_option_id = formData.get("quote_option_id");
  const total_payable = formData.get("total_payable");
  const payment_success_url = formData.get("payment_success_url");
  const payment_failed_url = formData.get("payment_failed_url");
  const selectedQuote: any = formData.get("selectedQuote");

  let response;
  const data = {
    confirm_accepted_policy_declaration,
  };
  const responseData: any = formData.get("response");
  response = JSON.parse(responseData);
  response = { ...response, ...data };

  const quoteData = await getQuoteById(session, quote_id);

  if (quoteData?.status?.statusCode === 500) {
    return json(
      {
        response: quoteData,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  if (
    quoteData?.status?.statusCode !== 500 &&
    !isObjectInArray(
      quoteData?.data?.policies[0]?.quote?.quote_options,
      JSON.parse(selectedQuote)
    )
  ) {
    return json(
      {
        quoteUpdated: true,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  //update policy
  const resData = await updatePolicy(session, response);
  if (resData?.status?.message === SUCCESS) {
    const paymentCreateSessionPayload = {
      quote_id: quote_id,
      quote_number: quote_number,
      quote_option_id: quote_option_id,
      amount: total_payable,
      payment_success_url: payment_success_url,
      payment_failed_url: payment_failed_url,
    };

    const paymentCreateSessionResponse = await createPaymentGatewaySession(
      session,
      paymentCreateSessionPayload
    );

    //202 represents payment session is accepted by the payment gateway
    if (paymentCreateSessionResponse?.status === 202) {
      //Store windcave session at backend
      const storeWindcaveSessionResult = await storeWindcaveSession(session, {
        policy_id: quote_id,
        windcave_session_id: paymentCreateSessionResponse?.data?.id,
      });

      if (storeWindcaveSessionResult?.status?.statusCode !== 200) {
        return json(
          { response: storeWindcaveSessionResult },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      }

      let windcaveURLToRedirectUser: string = "";
      if (paymentCreateSessionResponse?.data?.links?.length > 0) {
        windcaveURLToRedirectUser =
          paymentCreateSessionResponse?.data?.links[1]?.href;
      }
      //redirect to url provided by the payment gateway session
      return redirect(windcaveURLToRedirectUser, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json(
        {
          response: paymentCreateSessionResponse,
        },
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
        response: resData,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}
