import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  json,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Button from "~/components/common/Button";
import InformationCard from "~/components/common/InformationCard";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { getPolicyById, updatePolicy } from "~/services/quote.api";
import businessDetails2 from "./business-details-2";
import {
  OTP_LIMIT_REACHED,
  PHONE_OTP_SENT,
  PHONE_UPDATED,
  SUCCESS,
  TOO_MANY_REQUESTS,
} from "~/constants/string";
import {
  formatNewzealandNumber,
  normalizeMobileNumber,
  processPhoneNumber,
  validatePhoneNumber,
} from "~/utils";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import {
  generatePhoneOTP,
  getVerifiedPhoneNumber,
  isPhoneVerified,
  updateUserAttributes,
  verifyAuthToken,
} from "~/services/authentication.server";

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
  const isPhoneNumberVerified = await isPhoneVerified(session);
  let verifiedPhoneNumber = null;

  if (isPhoneNumberVerified) {
    verifiedPhoneNumber = await getVerifiedPhoneNumber(session);
  }
  const response = await getPolicyById(session, quoteId);
  return json(
    {
      response,
      isPhoneNumberVerified,
      verifiedPhoneNumber,
      env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

const ContactDetails = () => {
  const navigate = useNavigate();
  const { stepState, contactDetails, setContactDetails, productDetails } =
    useAppContext();
  const loaderData = useLoaderData<typeof loader>();
  const response: any = loaderData?.response;
  const isPhoneNumberVerified: any = loaderData?.isPhoneNumberVerified;
  const verifiedPhoneNumber: any = loaderData?.verifiedPhoneNumber;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const submit = useSubmit();
  const [isValid, setIsValid] = useState(false);
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const alphabetRegex = /^[a-zA-Z\s]+$/;
  const [isValidName, setValidName] = useState(false);
  const actionData: any = useActionData();
  const { setToastProps } = useToast();
  const [countryCodeForPhone, setCountryCodeForPhone] = useState("+91");//Todo

  //If fields already exist in backend
  useEffect(() => {
    if (response && !response.newQuote && response.data) {
      const data = response.data.policies[0];

      let phoneNumber: number = 0;

      if (data?.insured_contact_phone?.includes("+61")) {
        setCountryCodeForPhone("+61");
        phoneNumber = data?.insured_contact_phone?.slice(
          data?.insured_contact_phone?.indexOf("+61") + 3
        );
      } else if (data?.insured_contact_phone?.includes("+64")) {
        setCountryCodeForPhone("+64");
        phoneNumber = data?.insured_contact_phone?.slice(
          data?.insured_contact_phone?.indexOf("+64") + 3
        );
      } else if (data?.insured_contact_phone?.includes("+91")) {
        setCountryCodeForPhone("+91");
        phoneNumber = data?.insured_contact_phone?.slice(
          data?.insured_contact_phone?.indexOf("+91") + 3
        );
      }

      const newData = {
        insured_contact_name:
          data?.insured_contact_name || contactDetails?.insured_contact_name,
        insured_contact_phone:
          phoneNumber || contactDetails?.insured_contact_phone,
      };

      setIsValid(
        validatePhoneNumber(processPhoneNumber(newData?.insured_contact_phone))
      );
      setValidName(alphabetRegex.test(newData?.insured_contact_name));

      // Check if the new data is different from the current state
      if (JSON.stringify(newData) !== JSON.stringify(businessDetails2)) {
        setContactDetails(newData);
      }
    }
  }, [response]);

  useEffect(() => {
    if (!(isValid && isValidName)) setNextButtonDisabled(true);
    else setNextButtonDisabled(false);
  }, [contactDetails, response]);

  //For backend errors
  useEffect(() => {
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

    //For backend errors
    if (response?.status?.statusCode !== 200 && response?.status?.description) {
      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ??
            response?.status?.description),
        variant: "error",
      });
    }
  }, [actionData, response]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    let valueToBeStored = value;
    const validateName = (value: string) => {
      return alphabetRegex.test(value);
    };

    if (name === "insured_contact_name") {
      const valid = validateName(valueToBeStored?.trim());
      setValidName(valid);
    }
    if (name === "insured_contact_phone") {
      valueToBeStored = valueToBeStored?.replace(/[^0-9]/g, "");
      const valid = validatePhoneNumber(
        processPhoneNumber(normalizeMobileNumber(valueToBeStored))
      );
      setIsValid(valid);
    }
    setContactDetails((data) => {
      return {
        ...data,
        [name]:
          name === "insured_contact_phone"
            ? normalizeMobileNumber(valueToBeStored)
            : valueToBeStored,
      };
    });
  };

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    const formData = new FormData();
    formData.append(
      "insured_contact_name",
      contactDetails?.insured_contact_name?.trim()
    );
    formData.append(
      "insured_contact_phone",
      `${countryCodeForPhone}${processPhoneNumber(
        contactDetails?.insured_contact_phone
      )}`
    );

    formData.append("isPhoneNumberVerified", isPhoneNumberVerified);

    if (response && !response.newQuote && response?.data?.policies[0]) {
      const data = response?.data?.policies[0];
      formData.append("isUpdate", "true");
      formData.append("response", JSON.stringify(data, null, 2));
    }
    formData.append("isSaveAndNext", "true");
    submit(formData, { method: "post" });
  };

  // To check if the quote option selected is empty
  useEffect(() => {
    if (Object?.keys(productDetails?.quoteOptionSelected)?.length == 0) {
      navigate("/quote?quoteId=" + quoteId);
    }
  }, [productDetails]);

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

  useEffect(() => {
    if (isPhoneNumberVerified) {
      setIsValid(true);
      setContactDetails((data) => {
        return {
          ...data,
          insured_contact_phone: normalizeMobileNumber(
            verifiedPhoneNumber?.substring(3)
          ),
        };
      });
      setCountryCodeForPhone(verifiedPhoneNumber?.substring(0, 3));
    }
  }, [isPhoneNumberVerified]);

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
          <div className="sm:px-10 md:px-28 lg:px-40">
            <div className="flex flex-col space-y-6 px-4 pt-16 pb-10 text-primaryBg sm:px-0 md:pt-20 md:pb-16">
              <h1 className="font-black text-3xl">
                Policy holder contact details
              </h1>
              <h3 className="font-bold text-xl">
                We need some details about yourself.
              </h3>
            </div>

            {/* Contact details form */}
            <div className="pb-10 md:pb-16">
              <div className="bg-white rounded-md border-0 shadow-custom">
                <div className="px-6 py-10 rounded-md xl:px-16 xl:py-20 3xl:px-28">
                  <form className="flex flex-col space-y-10 text-primaryBg">
                    <div className="flex flex-col space-y-4">
                      <div className="font-bold text-[1.25rem]">
                        Name of contact person
                      </div>
                      <div>
                        <input
                          type="text"
                          name="insured_contact_name"
                          value={contactDetails?.insured_contact_name}
                          onChange={handleChange}
                          className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-grayCustom`}
                          placeholder="Full name"
                          maxLength={255}
                        />
                        {!isValidName &&
                          contactDetails?.insured_contact_name?.length > 0 && (
                            <p className="text-red-500 text-xs mt-2">
                              Please enter a valid name.
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-4">
                        <div className="font-bold text-[1.25rem]">
                          Phone number
                        </div>
                        <p>
                          We’ll send a one-time password to this mobile number.
                        </p>

                        <div className="flex flex-col justify-center ">
                          <div
                            className={`flex border border-grayCustom rounded-lg w-full ${
                              isPhoneNumberVerified
                                ? "bg-gray-200 cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          >
                            <span
                              className="pl-4 
                         py-[10px]
                          pr-2 
                          "
                            >
                              {/* {loaderData?.env?.REMOVE_PHONE_PREFIXES ===
                              "false" ? (
                                <select
                                  className={`  border-0 outline-none ${
                                    isPhoneNumberVerified
                                      ? "bg-gray-200 cursor-not-allowed opacity-60"
                                      : ""
                                  }`}
                                  name="countryCodeForPhone"
                                  disabled={isPhoneNumberVerified}
                                  value={countryCodeForPhone}
                                  onChange={(e) => {
                                    e.target.style.color = "#3B3B3B";
                                    setCountryCodeForPhone(e.target.value);
                                  }}
                                >
                                  <option value="+64">+64</option>
                                  <option value="+61">+61</option>
                                  <option value="+91">+91</option>
                                </select>
                              ) : (
                                <span className="text-primaryBg">+61</span>
                              )} */}
                              <span className="text-primaryBg">+91</span>
                            </span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              name="insured_contact_phone"
                              value={formatNewzealandNumber(
                                contactDetails?.insured_contact_phone
                              )}
                              onChange={handleChange}
                              placeholder="xxx xxx"
                              className={`outline-none py-[10px] rounded-r-lg w-full`}
                              aria-label="Phone number"
                              disabled={isPhoneNumberVerified}
                            />
                          </div>
                          {!isValid &&
                            contactDetails?.insured_contact_phone?.length >
                              0 && (
                              <p className="text-red-500 text-xs mt-2">
                                Please enter a valid Australia phone number.
                              </p>
                            )}
                        </div>
                      </div>
                      <p className="text-sm">
                        We only cover businesses in Australia.
                      </p>
                    </div>
                  </form>

                  {/* Information card */}
                  <div className="pt-10 md:pt-14">
                    <InformationCard
                      title={
                        isPhoneNumberVerified
                          ? "Your Phone number has already been verified."
                          : "Why do I need to verify my phone number?"
                      }
                      body={
                        isPhoneNumberVerified
                          ? "Your security and privacy are important to us. We have verified your phone number so that accessing your policy online in the future will be quick and simple by entering your email and phone number."
                          : "Your security and privacy are important to us. We are verifying your phone number so that accessing your policy online in the future will be quick and simple by entering your email and phone number."
                      }
                      iconColor="#5841BF"
                      backgroundColor="#FAEFFC"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() => navigate(`/quote?quoteId=${quoteId}`)}
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
                    handleSaveAndNextButton();
                  }}
                  label="Next"
                  variant="filled"
                  disabled={isNextButtonDisabled}
                  showTooltip={isNextButtonDisabled}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;

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
  const insured_contact_name = formData.get("insured_contact_name");
  const insured_contact_phone = formData.get("insured_contact_phone");
  const isUpdate = formData.get("isUpdate") == "true";
  const isPhoneNumberVerified = formData.get("isPhoneNumberVerified") == "true";

  let response;
  const data = {
    insured_contact_name,
    insured_contact_phone,
  };
  let resData;

  if (isPhoneNumberVerified) {
    const responseData: any = formData.get("response");
    response = JSON.parse(responseData);
    response = { ...response, ...data };
    //update policy
    resData = await updatePolicy(session, response);

    if (resData?.status?.message === SUCCESS) {
      const policyId = resData?.data?.policies[0]?.policy_id;
      return redirect("/final-questions?quoteId=" + policyId, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } else {
      return json(
        {
          response: resData,
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    }
  }
  const updatePhoneResponse = await updateUserAttributes(session, [
    {
      Name: "phone_number",
      Value: insured_contact_phone,
    },
  ]);
  if (updatePhoneResponse != PHONE_UPDATED) {
    return json(
      {
        response: {
          status: {
            statusCode: 400,
            message: "Error",
            description: " Phone update failed",
          },
        },
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  } else if (updatePhoneResponse == PHONE_UPDATED) {
    const generatePhoneOTPResponse = await generatePhoneOTP(session);
    if (generatePhoneOTPResponse == OTP_LIMIT_REACHED) {
      return json(
        {
          response: {
            status: {
              statusCode: 400,
              message: "Error",
              description:
                " OTP limit reached. Please try again after some time.",
            },
          },
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    } else if (generatePhoneOTPResponse == TOO_MANY_REQUESTS) {
      return json(
        {
          response: {
            status: {
              statusCode: 400,
              message: "Error",
              description:
                " Too many requests for OTP. Please try again after some time.",
            },
          },
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    } else if (generatePhoneOTPResponse != PHONE_OTP_SENT) {
      return json(
        {
          response: {
            status: {
              statusCode: 400,
              message: "Error",
              description: " OTP generation failed",
            },
          },
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    }
  }

  if (isUpdate && updatePhoneResponse == PHONE_UPDATED) {
    const responseData: any = formData.get("response");
    response = JSON.parse(responseData);
    response = { ...response, ...data };
    //update policy
    resData = await updatePolicy(session, response);

    if (resData?.status?.message === SUCCESS) {
      const policyId = resData?.data?.policies[0]?.policy_id;
      return redirect("/verify-phone-number?quoteId=" + policyId, {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    } else {
      return json(
        {
          response: resData,
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    }
  }
  return json(
    {
      response: resData,
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}
