import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import Button from "~/components/common/Button";
import { useEffect, useRef, useState } from "react";
import Modal from "~/components/common/Modal";
import ContactUsIcon from "~/assets/SVGIcons/ContactUsIcon";
import ThankYouModalIcon from "~/assets/SVGIcons/ThankYouModalIcon";
import { TYPES_OF_ENQUIRY } from "~/constants";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { contactUs, getActivePolicyOrQuote } from "~/services/quote.api";
import { useAppContext } from "~/context/ContextProvider";
import {
  formatNewzealandNumber,
  normalizeMobileNumber,
  validateEmail,
  validatePhoneNumber,
} from "~/utils";
import Reaptcha from "reaptcha";
import {
  BOUND,
  CLOSED_WON,
  ENDORSEMENT,
  NEW,
  QUOTED,
  RENEWAL,
} from "~/constants/string";
import { commitSession, getSession } from "~/services/session.server";
import { verifyAuthToken } from "~/services/authentication.server";

// remix server side rendering
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  // if (await verifyAuthToken(session)) {
  //   const response = await getActivePolicyOrQuote(session);
  //   return json(
  //     {
  //       env: {
  //         RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY,
  //       },
  //       response,
  //     },
  //     {
  //       headers: { "Set-Cookie": await commitSession(session) },
  //     }
  //   );
  // } else {
  //   return json({
  //     env: {
  //       RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY,
  //     },
  //     response: {},
  //   });
  // }
}

const initialDataForContactUs = {
  name: "",
  email: "",
  phone: "",
  typeOfEnquiry: "",
  enquiryDetails: "",
  companyName: "",
  quoteNumber: "",
};

const ContactUs = () => {
  const navigate = useNavigate();
  const { setToastProps } = useAppContext();
  const [openModal, setModalOpen] = useState(false);
  const submit = useSubmit();
  const actionData: any = useActionData();
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [contactUsData, setContactUsData] = useState(initialDataForContactUs);
  const [isValidPhone, setValidPhone] = useState(true);
  const [isValidEmail, setValidEmail] = useState(true);
  const loaderData: any = useLoaderData();
  const [captchaToken, setCaptchaToken] = useState<any>(null);
  const captchaRef: any = useRef(null);
  const [activePolicyORQuote, setActivePolicyOrQuote] = useState({
    quoteId: "",
    policyId: "",
  });

  useEffect(() => {
    if (loaderData?.response) {
      let foundQuote: any = null;
      let foundPolicy: any = null;
      let policies = loaderData?.response?.data?.policies;
      if (policies?.length > 0) {
        if (policies?.length === 1) {
          foundQuote = policies?.find((policy: any) => {
            return (
              policy.policy_stage?.toLowerCase() === QUOTED &&
              policy.policy_type?.toLowerCase() === NEW
            );
          });

          foundPolicy = policies?.find((policy: any) => {
            return (
              (policy.policy_stage?.toLowerCase() === BOUND ||
                policy.policy_stage?.toLowerCase() === CLOSED_WON) &&
              (policy.policy_type?.toLowerCase() === NEW ||
                policy.policy_type?.toLowerCase() === ENDORSEMENT ||
                policy.policy_type?.toLowerCase() === RENEWAL)
            );
          });
        } else {
          foundQuote = policies?.find((policy: any) => {
            return (
              policy.policy_stage?.toLowerCase() === QUOTED &&
              policy.policy_type?.toLowerCase() === RENEWAL
            );
          });

          foundPolicy = policies?.find((policy: any) => {
            return (
              (policy.policy_stage?.toLowerCase() === BOUND ||
                policy.policy_stage?.toLowerCase() === CLOSED_WON) &&
              (policy.policy_type?.toLowerCase() === NEW ||
                policy.policy_type?.toLowerCase() === ENDORSEMENT ||
                policy.policy_type?.toLowerCase() === RENEWAL)
            );
          });
        }
      }
      setActivePolicyOrQuote({
        quoteId: foundQuote ? foundQuote.policy_id : "",
        policyId: foundPolicy ? foundPolicy.policy_id : "",
      });
    }
  }, []);

  // Disable submit
  useEffect(() => {
    if (
      isValidPhone &&
      contactUsData?.name?.trim()?.length > 0 &&
      contactUsData?.email?.length > 0 &&
      contactUsData?.typeOfEnquiry?.length > 0 &&
      contactUsData?.phone?.length > 0 &&
      contactUsData?.enquiryDetails?.trim()?.length > 0 &&
      captchaToken?.length > 0
    ) {
      if (
        contactUsData?.typeOfEnquiry?.toLowerCase() == "quote related" &&
        contactUsData?.companyName?.trim()?.length > 0 &&
        contactUsData?.quoteNumber?.trim()?.length > 0
      ) {
        setSubmitDisabled(false);
      } else if (
        contactUsData?.typeOfEnquiry?.toLowerCase() != "quote related"
      ) {
        setSubmitDisabled(false);
      } else {
        setSubmitDisabled(true);
      }
    } else setSubmitDisabled(true);
  }, [contactUsData, captchaToken]);

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
          JSON.stringify(
            actionData?.response?.status?.description?.message ??
              actionData?.response?.status?.description
          ),
        variant: "error",
      });
    } else if (actionData?.response?.status?.statusCode == 200) {
      setContactUsData(initialDataForContactUs);
      setModalOpen(true);
    }
  }, [actionData]);

  const verify = () => {
    captchaRef.current.getResponse().then((res: any) => {
      setCaptchaToken(res);
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let valueToBeStored = value;

    if (name === "phone") {
      valueToBeStored = valueToBeStored?.replace(/[^0-9]/g, "");
      const valid = validatePhoneNumber(normalizeMobileNumber(valueToBeStored));
      setValidPhone(valid);
    }

    if (name === "email") {
      const valid = validateEmail(value);
      setValidEmail(valid);
    }

    setContactUsData((data) => {
      return {
        ...data,
        [name]:
          name === "phone"
            ? normalizeMobileNumber(value?.replace(/[^0-9]/g, ""))
            : value,
      };
    });
  };

  const handleSelect = (e: any) => {
    const { name, value } = e.target;
    setContactUsData((data) => {
      return { ...data, [name]: value };
    });
  };

  const handleKeyDown = (e: any) => {
    if (e?.key === " ") {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", contactUsData?.name?.trim());
    formData.append("phone", contactUsData?.phone);
    formData.append("email", contactUsData?.email);
    formData.append("type_of_enquiry", contactUsData?.typeOfEnquiry);
    formData.append("message", contactUsData?.enquiryDetails);
    if (contactUsData?.typeOfEnquiry?.toLowerCase() === "quote related") {
      formData.append("company_name", contactUsData?.companyName);
      formData.append("quote_number", contactUsData?.quoteNumber);
    }
    submit(formData, { method: "post" });
  };

  const handleHomeButton = () => {
    if (
      activePolicyORQuote?.policyId?.length > 0 &&
      activePolicyORQuote?.quoteId == ""
    ) {
      navigate("/my-policy?policyId=" + activePolicyORQuote?.policyId);
    } else if (
      activePolicyORQuote?.policyId == "" &&
      activePolicyORQuote?.quoteId?.length > 0
    ) {
      navigate("/quote?quoteId=" + activePolicyORQuote?.quoteId);
    } else if (
      activePolicyORQuote?.policyId?.length > 0 &&
      activePolicyORQuote?.quoteId?.length > 0
    ) {
      navigate("/quote?quoteId=" + activePolicyORQuote?.quoteId);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col space-y-10 py-[7.5rem] sm:px-10 md:space-y-16 lg:px-40 lg:py-[8.75rem] text-primaryBg">
            <div className="flex justify-center">
              <div className="relative px-9 pt-[7.5rem] pb-10 w-full flex bg-white rounded-md border-0  shadow-custom md:pt-[7.5rem] md:pb-20 md:px-16">
                {/* Logo icon */}
                <div className="absolute top-0 left-1/2 md:left-[7.75rem] transform -translate-x-1/2 -translate-y-1/2">
                  <ContactUsIcon />
                </div>

                <div className="flex flex-col w-full space-y-10 md:flex-row md:space-y-0 md:space-x-6">
                  <div className="md:w-2/5 flex flex-col space-y-6 md:space-y-10 md:pr-[6.625rem]">
                    <div className="flex flex-col space-y-6 md:space-y-8">
                      <div className="flex flex-col space-y-6">
                        <h1 className="text-center font-black text-4xl md:text-[2.5rem] md:text-start">
                          Contact Us
                        </h1>
                        <p className="font-black text-lg md:text-2xl">
                          Here's how you can reach out to us.
                        </p>
                      </div>
                      <div>
                        <p>
                          Fill out the Contact Us form and we'll get back to you
                          within 1-3 business days.
                        </p>
                        <br className="sm:hidden" />
                        <br className="hidden md:block" />
                        <p>
                          Alternatively, you can call{" "}
                          <span className="text-secondary">(800) 244-1180</span>,
                          (Mon-Fri, 9am-5pm)
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#B1B1B1] h-[1px]" />

                    <div className="flex flex-col space-y-6">
                      <h1 className="font-black md:text-2xl">Claims</h1>
                      <p>
                        We're here to support you 24/7, if you need claim just
                        give us call on our cyber claims hotline{" "}
                        <span className="text-secondary">((800) 244-1180)</span>.
                        Remember to have your policy number handy, so our Cyber
                        Insurance Specialists can get up to speed quickly.
                      </p>
                    </div>
                  </div>

                  <div className="md:w-3/5 flex flex-col space-y-10">
                    <div className="flex flex-col space-y-8">
                      <form className="flex flex-col space-y-8">
                        <div className="flex flex-col space-y-6">
                          <div className="font-bold text-[1.25rem] text-primaryBg">
                            Name
                          </div>
                          <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={contactUsData?.name}
                            className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-primaryBg`}
                            placeholder="Full name"
                            maxLength={80}
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex flex-col space-y-6">
                            <div className="font-bold text-[1.25rem] text-primaryBg">
                              Email address
                            </div>
                            <input
                              type="email"
                              name="email"
                              onChange={handleChange}
                              value={contactUsData?.email}
                              className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-primaryBg`}
                              placeholder="email@address.com"
                              onKeyDown={(e) => handleKeyDown(e)}
                            />
                          </div>
                          {!isValidEmail &&
                            contactUsData?.email?.length > 0 && (
                              <p className="text-red-500 text-xs mt-[-10px]">
                                Please enter a valid email.
                              </p>
                            )}
                        </div>

                        <div className="flex flex-col space-y-6">
                          <div className="font-bold text-[1.25rem] text-primaryBg">
                            Phone number
                          </div>

                          <div className="flex flex-col justify-center ">
                            <div className="flex border border-primaryBg rounded-lg w-full">
                              <span className="pl-4 py-[10px] pr-2 text-primaryBg">
                                +91
                              </span>
                              <input
                                type="tel"
                                name="phone"
                                value={formatNewzealandNumber(
                                  contactUsData?.phone
                                )}
                                onChange={handleChange}
                                placeholder="xxx xxx"
                                className="outline-none py-[10px] rounded-r-lg w-full"
                                aria-label="Phone number"
                              />
                            </div>
                            {!isValidPhone &&
                              contactUsData?.phone?.length > 0 && (
                                <p className="text-red-500 text-xs mt-2">
                                  Please enter a valid Australia phone number.
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-6">
                          <div className="font-bold text-[1.25rem] text-primaryBg">
                            Type of enquiry
                          </div>
                          <div className="relative">
                            <select
                              className="appearance-none px-4 py-[10px] w-full rounded-lg border border-primaryBg focus:outline-none "
                              style={{
                                color: `${
                                  contactUsData?.typeOfEnquiry === ""
                                    ? "#B1B1B1"
                                    : "#3B3B3B"
                                }`,
                              }}
                              name="typeOfEnquiry"
                              value={contactUsData?.typeOfEnquiry || ""}
                              onChange={(e) => {
                                e.target.style.color = "#3B3B3B";
                                handleSelect(e);
                              }}
                            >
                              <option value="" disabled hidden>
                                Select enquiry type
                              </option>
                              {TYPES_OF_ENQUIRY?.map((enquiry, index) => (
                                <option
                                  className="text-primaryBg"
                                  value={
                                    enquiry === "Policy related"
                                      ? "Policy-related"
                                      : enquiry
                                  }
                                  key={index}
                                >
                                  {enquiry}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.8533 5.35807L12.6267 4.13141C12.5289 4.04252 12.4133 3.99807 12.28 3.99807C12.1467 3.99807 12.0356 4.04252 11.9467 4.13141L8 8.09141L4.05333 4.13141C3.95556 4.04252 3.84445 3.99807 3.72 3.99807C3.59555 3.99807 3.48444 4.04252 3.38667 4.13141L2.14667 5.35807C2.04889 5.45585 2 5.57141 2 5.70474C2 5.83807 2.04889 5.94918 2.14667 6.03807L7.66667 11.5581C7.76445 11.647 7.87556 11.6914 8 11.6914C8.12445 11.6914 8.23556 11.647 8.33333 11.5581L13.8533 6.03807C13.9511 5.9403 14 5.82919 14 5.70474C14 5.5803 13.9511 5.46474 13.8533 5.35807Z"
                                  fill="#272727"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {contactUsData?.typeOfEnquiry
                          ?.toLowerCase()
                          ?.includes("quote related") && (
                          <>
                            <div className="flex flex-col space-y-6">
                              <div className="font-bold text-[1.25rem] text-primaryBg">
                                Company name
                              </div>
                              <input
                                type="text"
                                name="companyName"
                                onChange={handleChange}
                                value={contactUsData?.companyName}
                                className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-primaryBg`}
                                placeholder="Company name"
                                maxLength={255}
                              />
                            </div>

                            <div className="flex flex-col space-y-6">
                              <div className="font-bold text-[1.25rem] text-primaryBg">
                                Quote number
                              </div>
                              <input
                                type="text"
                                name="quoteNumber"
                                onChange={handleChange}
                                value={contactUsData?.quoteNumber}
                                className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-primaryBg`}
                                placeholder="xxxxxx-xx"
                              />
                            </div>
                          </>
                        )}

                        <div className="flex flex-col space-y-6">
                          <div className="font-bold text-[1.25rem] text-primaryBg">
                            Enter the details of your enquiry
                          </div>
                          <textarea
                            name="enquiryDetails"
                            onChange={handleChange}
                            value={contactUsData?.enquiryDetails}
                            rows={6}
                            className="px-4 py-[10px] w-full rounded-lg border border-primaryBg"
                            placeholder="Please tell us as much details as possible so that we can better assist you."
                            maxLength={1000}
                          />
                        </div>
                      </form>
                    </div>

                    <div className="flex justify-end">
                      <div className="w-fit">
                        <Reaptcha
                          sitekey={loaderData.env.RECAPTCHA_SITEKEY}
                          ref={captchaRef}
                          onExpire={() => {
                            setCaptchaToken(null);
                          }}
                          onVerify={verify}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="w-[17rem]">
                        <Button
                          onClick={() => handleSubmit()}
                          label="Submit"
                          variant="filled"
                          disabled={isSubmitDisabled}
                          showTooltip={isSubmitDisabled}
                          tooltipContent={
                            "Oops! Looks like some questions are incomplete. Please fill out all questions."
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setModalOpen(false)}
        icon={<ThankYouModalIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl md:text-[2.5rem]">
              Thank you for reaching out to us!
            </h1>
            <p>
              One of our Cyber Insurance Specialists will get back <br /> to you
              within 1-3 business days.
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={handleHomeButton}
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
    </>
  );
};

export default ContactUs;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = "+91" + formData.get("phone"); //Todo
  const type_of_enquiry: any = formData.get("type_of_enquiry");
  const message = formData.get("message");
  const company_name: any = formData.get("company_name");
  const quote_number = formData.get("quote_number");

  let data: any = {
    name,
    email,
    phone,
    type_of_enquiry,
    message,
  };

  if (type_of_enquiry?.toLowerCase() === "quote related") {
    data = { ...data, company_name, quote_number };
  }

  const resData = await contactUs(data);
  return json({
    response: resData,
  });
}
