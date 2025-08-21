import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import NothingFoundIcon from "~/assets/SVGIcons/NothingFoundIcon";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import {
  BUSINESS_DETAILS,
  CLOSED_LOST,
  DATA_COMPLIANCE,
  INFO_SECURITY_MEASURES,
  LOSS_HISTORY,
  NEW,
  OPTIONAL_EXTENSIONS,
  PRE_QUOTE,
  QUOTED,
  RENEWAL,
  REVENUE_DETAILS,
  SUCCESS,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  createPolicy,
  createQuote,
  getActivePolicyOrQuote,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { processPhoneNumber, removeCommas } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  // if (!(await verifyAuthToken(session))) {
  //   return redirect("/", {
  //     headers: {
  //       "Set-Cookie": await destroySession(session),
  //     },
  //   });
  // }

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

const QuoteProcessing = () => {
  const actionData: any = useActionData();
  const { setToastProps } = useToast();
  const navigate = useNavigate();
  const submit = useSubmit();
  const {
    businessDetails,
    businessDetails2,
    businessDetails3,
    createPolicyData,
    contactDetails,
    countryCodeForPhoneInitialStep,
  } = useAppContext();
  const [openPolicyDeclinedModal, setOpenPolicyDeclinedModal] = useState(false);
  const [declinedReasons, setDeclinedReasons] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");

  //For backend errors
  useEffect(() => {
    if (
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
      setToastProps({
        message:
          actionData?.response?.status?.message +
          "-" +
          (actionData?.response?.status?.description?.message ??
            actionData?.response?.status?.description),
        variant: "error",
      });
      navigate("/technical-error");
    }
  }, [actionData]);

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

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    const formData = new FormData();

    formData.append("has_claim_issue", businessDetails2?.has_claim_issue);
    formData.append("has_loss_factors", businessDetails2?.has_loss_factors);
    formData.append(
      "	has_loss_factors_details",
      businessDetails2?.has_loss_factors_details
    );
    formData.append("num_customers", businessDetails2?.num_customers);
    formData.append("sensitive_data", businessDetails2?.sensitive_data);

    formData.append(
      "sensitive_data_none_details",
      businessDetails2?.sensitive_data_none_details
    );
    formData.append(
      "has_malware_protection",
      businessDetails2?.has_malware_protection
    );
    formData.append(
      "has_regular_backups",
      businessDetails2?.has_regular_backups
    );
    formData.append(
      "has_software_patches",
      businessDetails2?.has_software_patches
    );
    formData.append(
      "has_computer_crime_cover",
      businessDetails2?.has_computer_crime_cover
    );
    formData.append(
      "has_segregated_duties_payments",
      businessDetails2?.has_segregated_duties_payments
    );
    formData.append(
      "has_segregated_duties_expense",
      businessDetails2?.has_segregated_duties_expense
    );
    formData.append(
      "has_segregated_duties_fund_txns",
      businessDetails2?.has_segregated_duties_fund_txns
    );
    formData.append("has_auth_limits_1K", businessDetails2?.has_auth_limits_1K);
    formData.append(
      "has_social_engg_fraud_ext",
      businessDetails2?.has_social_engg_fraud_ext
    );
    formData.append(
      "has_approved_vendors",
      businessDetails2?.has_approved_vendors
    );
    formData.append(
      "has_verified_destination_bank",
      businessDetails2?.has_verified_destination_bank
    );
    formData.append(
      "insured_company_url",
      businessDetails2?.insured_company_url
    );
    formData.append(
      "insured_company_url_blacklisted",
      businessDetails2?.insured_company_url_blacklisted
    );
    formData.append(
      "confirm_basic_cover_blacklisted_url",
      businessDetails2?.confirm_basic_cover_blacklisted_url
    );
    formData.append(
      "confirm_basic_cover_nourl",
      businessDetails2?.confirm_basic_cover_nourl
    );
    formData.append("insured_industry", businessDetails?.insured_industry);
    formData.append("num_employees", businessDetails?.num_employees);

    formData.append(
      "total_annual_revenue",
      removeCommas(businessDetails?.total_annual_revenue)
    );
    formData.append("has_online_revenue", businessDetails?.has_online_revenue);
    formData.append(
      "total_revenue_online",
      removeCommas(businessDetails?.total_revenue_online)
    );
    formData.append(
      "has_50PCT_overseas_revenue",
      businessDetails?.has_50PCT_overseas_revenue
    );
    formData.append(
      "insured_contact_name",
      contactDetails?.insured_contact_name
    );
    formData.append(
      "insured_contact_phone",
      `${countryCodeForPhoneInitialStep}${processPhoneNumber(
        contactDetails?.insured_contact_phone
      )}`
    );

    formData.append(
      "insured_contact_email",
      businessDetails3?.insured_contact_email
    );

    formData.append(
      "has_existing_business",
      businessDetails3?.has_existing_business
    );

    formData.append(
      "existing_policy_number",
      businessDetails3?.existing_policy_number
    );

    formData.append("referral_code", businessDetails3?.referral_code);

    formData.append("contact_consent", businessDetails3?.contact_consent);

    formData.append(
      "createPolicyData",
      JSON.stringify(createPolicyData, null, 2)
    );
    formData.append("isCreate", "true");

    formData.append("isSaveAndNext", "true");
    submit(formData, { method: "post" });
  };

  const handleCreateQuote = () => {
    const formData = new FormData();

    formData.append("createQuote", "true");
    formData.append(
      "createQuotePayload",
      JSON.stringify({ policy_id: quoteId })
    );
    submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (
      quoteId?.toLowerCase() === "new-quote" ||
      quoteId == null ||
      quoteId == undefined
    ) {
      handleSaveAndNextButton();
    } else {
      handleCreateQuote();
    }
  }, []);

  return (
    <>
      <div className="flex min-h-screen justify-center items-center py-28 px-6 my-3 text-primaryBg">
        <div className="flex flex-col space-y-4 items-center">
          <div className="flex gap-2">
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader" />
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-200" />
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-400" />
          </div>

          <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
            <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
              Processing your quote
            </h1>
            <p className="font-bold text-center md:text-lg">
              Your quote may take up to 5 minutes to generate.
              <br />
              Wait in this page or login again{" "}
              <span
                className="text-secondary underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                {" "}
                here
              </span>{" "}
              to see your quote later.
              <br />
              <br />
              <span>
                Please do not close or refresh this window, or click the Back
                button on your browser.
              </span>
              <br />
              <br />
              If you have any questions,{" "}
              <span
                className="underline cursor-pointer text-secondary"
                onClick={() => navigate("/contact-us")}
              >
                contact us
              </span>{" "}
              or give us a call on
              <br />
              <span className="text-secondary"> 1300 555 123</span> (Mon-Fri
              9am-5pm)
            </p>
          </div>
        </div>
      </div>

      {/* If policy creation is declined */}
      <Modal
        isOpen={openPolicyDeclinedModal}
        onClose={() => navigate("/business-details-1?quoteId=new-quote")}
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
    </>
  );
};

export default QuoteProcessing;

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  // if (!(await verifyAuthToken(session))) {
  //   return redirect("/login", {
  //     headers: {
  //       "Set-Cookie": await destroySession(session),
  //     },
  //   });
  // }

  const resData = await getActivePolicyOrQuote(session);
  if (resData?.data?.policies?.length > 0) {
    const activeQuote = resData?.data?.policies?.find((policy: any) => {
      return (
        policy.policy_stage?.toLowerCase() === QUOTED &&
        (policy.policy_type?.toLowerCase() === NEW ||
          policy.policy_type?.toLowerCase() === RENEWAL)
      );
    });
    if (activeQuote) {
      return redirect(`/quote?quoteId=${activeQuote?.policy_id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  try {
    const formData = await request.formData();

    const createQuotePayload: any = formData.get("createQuotePayload");
    const isCreateQuote = formData.get("createQuote") === "true";

    const has_claim_issue = formData.get("has_claim_issue");
    const has_loss_factors: any = formData.get("has_loss_factors");
    const has_loss_factors_details = formData.get("	has_loss_factors_details");
    const num_customers = formData.get("num_customers");
    const sensitive_data: any = formData.get("sensitive_data");
    const sensitive_data_none_details = formData.get(
      "sensitive_data_none_details"
    );
    const has_malware_protection = formData.get("has_malware_protection");

    const has_regular_backups = formData.get("has_regular_backups");
    const has_software_patches = formData.get("has_software_patches");
    const has_computer_crime_cover: any = formData.get(
      "has_computer_crime_cover"
    );
    const has_segregated_duties_payments = formData.get(
      "has_segregated_duties_payments"
    );
    const has_segregated_duties_expense = formData.get(
      "has_segregated_duties_expense"
    );
    const has_segregated_duties_fund_txns = formData.get(
      "has_segregated_duties_fund_txns"
    );
    const has_auth_limits_1K = formData.get("has_auth_limits_1K");
    const has_social_engg_fraud_ext: any = formData.get(
      "has_social_engg_fraud_ext"
    );
    const has_verified_destination_bank = formData.get(
      "has_verified_destination_bank"
    );
    const has_approved_vendors = formData.get("has_approved_vendors");
    const insured_company_url = formData.get("insured_company_url");
    const insured_company_url_blacklisted = formData.get(
      "insured_company_url_blacklisted"
    );
    const confirm_basic_cover_blacklisted_url = formData.get(
      "confirm_basic_cover_blacklisted_url"
    );
    const confirm_basic_cover_nourl = formData.get("confirm_basic_cover_nourl");
    const num_employees = formData.get("num_employees");
    const insured_industry = formData.get("insured_industry");
    const has_50PCT_overseas_revenue = formData.get(
      "has_50PCT_overseas_revenue"
    );
    const total_annual_revenue = formData.get("total_annual_revenue");
    const insured_contact_email = formData.get("insured_contact_email");

    const has_online_revenue = formData.get("has_online_revenue");
    const total_revenue_online = formData.get("total_revenue_online");
    const insured_contact_name = formData.get("insured_contact_name");
    const insured_contact_phone = formData.get("insured_contact_phone");
    const has_existing_business = formData.get("has_existing_business");
    const existing_policy_number = formData.get("existing_policy_number");
    const referral_code = formData.get("referral_code");
    const contact_consent = formData.get("contact_consent") == "true";

    let resData: any = {};

    // create new policy function
    const createNewPolicy = async () => {
      let response: any = {};
      const responseData: any = formData.get("createPolicyData");
      response = JSON?.parse(responseData);

      const insuredRevenueData: any = {
        has_50PCT_overseas_revenue,
        total_annual_revenue,
        has_online_revenue,
        total_revenue_online,
      };

      const infoSecurityData: any = {
        num_employees,
        has_malware_protection,
        has_regular_backups,
        has_software_patches,
      };

      let lossHistoryData: any = {
        has_claim_issue,
        has_loss_factors,
        has_loss_factors_details,
      };
      if (has_loss_factors?.toLowerCase() == "no") {
        lossHistoryData = {
          ...lossHistoryData,
          has_loss_factors_details: "",
        };
      }

      let dataComplianceData: any = {
        num_customers,
        sensitive_data,
        sensitive_data_none_details,
      };

      if (!sensitive_data?.includes("None of the above")) {
        dataComplianceData = {
          num_customers,
          sensitive_data,
          sensitive_data_none_details: "",
        };
      }

      let optionalExtensionsData: any = {
        has_computer_crime_cover,
        has_segregated_duties_payments,
        has_segregated_duties_expense,
        has_segregated_duties_fund_txns,
        has_auth_limits_1K,
        has_social_engg_fraud_ext,
        has_verified_destination_bank,
        has_approved_vendors,
      };

      if (has_computer_crime_cover?.toLowerCase() === "no") {
        optionalExtensionsData = {
          ...optionalExtensionsData,
          has_segregated_duties_payments: "",
          has_segregated_duties_expense: "",
          has_segregated_duties_fund_txns: "",
          has_auth_limits_1K: "",
        };
      }
      if (has_social_engg_fraud_ext?.toLowerCase() == "no") {
        optionalExtensionsData = {
          ...optionalExtensionsData,
          has_verified_destination_bank: "",
          has_approved_vendors: "",
        };
      }

      const businessDetails: any = {
        insured_industry,
        insured_company_url,
        insured_contact_email,
        insured_company_url_blacklisted,
        confirm_basic_cover_blacklisted_url,
        confirm_basic_cover_nourl,
        product_code: "NZ001",
        contact_consent,
        referral_code,
      };

      const contactDetails: any = {
        insured_contact_name,
        insured_contact_phone,
      };

      const existingBusinessDetails: any = {
        has_existing_business,
        existing_policy_number,
      };
      response = {
        ...response,
        ...businessDetails,
        ...contactDetails,
      };

      let section = response?.sections?.find(
        (section: any) => section.section_code == REVENUE_DETAILS
      );

      let section2 = response?.sections?.find(
        (section: any) => section.section_code == INFO_SECURITY_MEASURES
      );

      let section3 = response?.sections?.find(
        (section: any) => section.section_code == LOSS_HISTORY
      );

      let section4 = response?.sections?.find(
        (section: any) => section.section_code == DATA_COMPLIANCE
      );

      let section5 = response?.sections?.find(
        (section: any) => section.section_code == OPTIONAL_EXTENSIONS
      );

      let section6 = response?.sections?.find(
        (section: any) => section.section_code == BUSINESS_DETAILS
      );

      section?.section_details?.map((section: any) => {
        if (
          insuredRevenueData[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            insuredRevenueData[section?.section_detail_code];
        }
      });

      section2?.section_details?.map((section: any) => {
        if (
          infoSecurityData[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            infoSecurityData[section?.section_detail_code];
        }
      });

      section3?.section_details?.map((section: any) => {
        if (
          lossHistoryData[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            lossHistoryData[section?.section_detail_code];
        }
      });

      section4?.section_details?.map((section: any) => {
        if (
          dataComplianceData[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            dataComplianceData[section?.section_detail_code];
        }
      });

      section5?.section_details?.map((section: any) => {
        if (
          optionalExtensionsData[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            optionalExtensionsData[section?.section_detail_code];
        }
      });

      section6?.section_details?.map((section: any) => {
        if (
          existingBusinessDetails[section?.section_detail_code] !== undefined ||
          null
        ) {
          section.attribute_value =
            existingBusinessDetails[section?.section_detail_code];
        }
      });
      resData = await createPolicy(session, response);

      if (resData?.status?.message === SUCCESS) {
        const policy_id = resData?.data?.policies[0]?.policy_id;

        if (
          resData?.data?.policies[0]?.policy_stage?.toLowerCase() == PRE_QUOTE
        ) {
          const data = {
            policy_id,
          };
          const createQuoteResponse = await createQuote(session, data);
          if (
            createQuoteResponse?.data?.policies[0]?.policy_stage?.toLowerCase() ==
            QUOTED
          ) {
            return redirect("/quote?quoteId=" + policy_id, {
              headers: {
                "Set-Cookie": await commitSession(session),
              },
            });
          } else {
            return json(
              {
                response: createQuoteResponse,
              },
              {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              }
            );
          }
        }
      } else {
        return json(
          { response: resData },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      }
    };

    if (isCreateQuote) {
      const data = JSON.parse(createQuotePayload);

      const createQuoteResponse = await createQuote(session, data);
      if (
        createQuoteResponse?.data?.policies[0]?.policy_stage?.toLowerCase() ==
        QUOTED
      ) {
        return redirect("/quote?quoteId=" + data?.policy_id, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        return json(
          {
            response: createQuoteResponse,
          },
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
        );
      }
    } else {
      return createNewPolicy();
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
