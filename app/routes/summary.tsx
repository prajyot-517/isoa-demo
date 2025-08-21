import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import SummaryCard from "~/components/Summary/SummaryCard";
import SummaryDetails from "~/components/Summary/SummaryDetails";
import Button from "~/components/common/Button";
import GetInTouchCard from "~/components/common/GetInTouchCard";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import RestartQuoteModal from "~/components/common/RestartQuoteModal";
import {
  BUSINESS_DETAILS,
  DATA_COMPLIANCE,
  INFO_SECURITY_MEASURES,
  LOSS_HISTORY,
  OPTIONAL_EXTENSIONS,
  REVENUE_DETAILS,
  SUCCESS,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { getPolicyById, restartQuote } from "~/services/quote.api";
import { handleDownloadPolicyWording } from "~/utils";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { verifyAuthToken } from "~/services/authentication.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(await verifyAuthToken(session))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  session.set("goBackToSummary", true);
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  const response = await getPolicyById(session, quoteId);
  return json(
    {
      ...response,
      env: { POLICY_WORDING_URL: process.env.POLICY_WORDING_URL },
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
}

const Summary = () => {
  const { stepState, setStepState, resetState, productDetails } =
    useAppContext();

  const [isRestartQuoteClikced, setIsRestartQuoteClikced] = useState(false);
  const response = useLoaderData<typeof loader>();
  const actionData: any = useActionData();
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();
  const { setToastProps } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");

  const [businessDetails, setBusinessDetails] = useState({
    insured_contact_email: "",
    insured_industry: "",
    insured_company_name: "",
    insured_trading_name: "",
    insured_address_line1: "",
    insured_address_line2: "",
    insured_address_postcode: "",
    insured_address_state: "",
    num_employees: "",
    total_annual_revenue: "",
    total_revenue_online: "",
    has_online_revenue: "",
    has_50PCT_overseas_revenue: "",
    insured_company_url: "",
    insured_contact_name: "",
    insured_contact_phone: "",
    has_current_cyber_cover_details: "",
    policy_inception_date: "",
    policy_expiry_date: "",
    referral_code: "",
    contact_consent: "",
  });

  const [lossHistory, setLossHistory] = useState({
    has_claim_issue: "",
    has_loss_factors: "",
    has_loss_factors_details: "",
  });

  const [dataCompliance, setDataCompliance] = useState({
    num_customers: "",
    sensitive_data: [],
    sensitive_data_none_details: "",
  });

  const [optionalExtensions, setOptionalExtensions] = useState({
    has_computer_crime_cover: "",
    has_segregated_duties_payments: "",
    has_segregated_duties_expense: "",
    has_segregated_duties_fund_txns: "",
    has_auth_limits_1K: "",
    has_verified_destination_bank: "",
    has_approved_vendors: "",
    has_social_engg_fraud_ext: "",
  });

  const [insuranceHistory, setInsuranceHistory] = useState({
    has_current_cyber_cover: "",
    has_current_cyber_cover_details: "",
  });

  const [informationSecurityMeasures, setInformationSecurityMeasures] =
    useState({
      has_cyber_training: "",
      has_qualified_it_team: "",
      has_password_policy: "",
      has_two_factor_auth: "",
      has_malware_protection: "",
      has_regular_backups: "",
      has_software_patches: "",
    });

  const [existingBusinessDetails, setExistingBusinessDetails] = useState({
    has_existing_business: "",
    existing_policy_number: "",
  });
  const data = response?.data?.policies[0];

  //If fields already exist in backend
  useEffect(() => {
    if (response && response.data) {
      const insuredRevenue = data?.sections.find(
        (section: any) => section.section_code == REVENUE_DETAILS
      );

      const infoSecurity = data?.sections.find(
        (section: any) => section.section_code == INFO_SECURITY_MEASURES
      );

      const newBusinessDetails = {
        insured_contact_email: data?.insured_contact_email || "",
        insured_industry: data?.insured_industry || "",
        insured_company_name: data?.insured_company_name || "",
        insured_trading_name: data?.insured_trading_name || "",
        insured_address_line1: data?.insured_address_line1 || "",
        insured_address_line2: data?.insured_address_line2 || "",
        insured_address_postcode: data?.insured_address_postcode || "",
        insured_address_state: data?.insured_address_state || "",
        num_employees:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "num_employees"
          )?.attribute_value || "",
        total_annual_revenue:
          insuredRevenue?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "total_annual_revenue"
          )?.attribute_value || "",
        total_revenue_online:
          insuredRevenue?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "total_revenue_online"
          )?.attribute_value || "",
        has_50PCT_overseas_revenue:
          insuredRevenue?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_50PCT_overseas_revenue"
          )?.attribute_value || "",

        insured_company_url: data?.insured_company_url || "",
        insured_contact_name: data?.insured_contact_name || "",
        insured_contact_phone: data?.insured_contact_phone || "",
        has_current_cyber_cover_details: "",

        policy_inception_date: data?.policy_inception_date || "",
        policy_expiry_date: data?.policy_expiry_date || "",
        referral_code: data?.referral_code,
        contact_consent: data?.contact_consent,
      };
      setBusinessDetails(newBusinessDetails);

      const _lossHistory = data?.sections.find(
        (section: any) => section.section_code == LOSS_HISTORY
      );

      const newLossHistoryDetails = {
        has_claim_issue:
          _lossHistory?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_claim_issue"
          )?.attribute_value || "",
        has_loss_factors:
          _lossHistory?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_loss_factors"
          )?.attribute_value || "",
        has_loss_factors_details:
          _lossHistory?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_loss_factors_details"
          )?.attribute_value || "",
      };

      setLossHistory(newLossHistoryDetails);

      const dataComplianceData = data?.sections.find(
        (section: any) => section.section_code == DATA_COMPLIANCE
      );

      const newDataCompliance = {
        num_customers:
          dataComplianceData?.section_details.find(
            (detail: any) => detail.section_detail_code == "num_customers"
          )?.attribute_value || "",
        sensitive_data:
          dataComplianceData?.section_details
            .find(
              (detail: any) => detail.section_detail_code == "sensitive_data"
            )
            ?.attribute_value?.split(";") || [],
        sensitive_data_none_details:
          dataComplianceData?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "sensitive_data_none_details"
          )?.attribute_value || dataCompliance?.sensitive_data_none_details,
      };

      setDataCompliance(newDataCompliance);

      const optionalExtension = data?.sections.find(
        (section: any) => section.section_code == OPTIONAL_EXTENSIONS
      );

      const newDataOptionalExtension = {
        has_segregated_duties_expense:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_segregated_duties_expense"
          )?.attribute_value || "",
        has_segregated_duties_payments:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_segregated_duties_payments"
          )?.attribute_value || "",
        has_segregated_duties_fund_txns:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_segregated_duties_fund_txns"
          )?.attribute_value || "",

        has_auth_limits_1K:
          optionalExtension?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_auth_limits_1K"
          )?.attribute_value || optionalExtensions?.has_auth_limits_1K,

        has_verified_destination_bank:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_verified_destination_bank"
          )?.attribute_value || "",

        has_approved_vendors:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_approved_vendors"
          )?.attribute_value || "",

        has_computer_crime_cover:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_computer_crime_cover"
          )?.attribute_value || "",

        has_social_engg_fraud_ext:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_social_engg_fraud_ext"
          )?.attribute_value || "",
      };

      setOptionalExtensions(newDataOptionalExtension);

      const insuranceSection = data?.sections.find(
        (section: any) => section?.section_code == "insurance_history"
      );
      const newInsuranceHistoryData = {
        has_current_cyber_cover:
          insuranceSection?.section_details.find(
            (detail: any) =>
              detail?.section_detail_code == "has_current_cyber_cover"
          )?.attribute_value || "",
        has_current_cyber_cover_details:
          insuranceSection?.section_details.find(
            (detail: any) =>
              detail?.section_detail_code == "has_current_cyber_cover_details"
          )?.attribute_value || "",
      };
      setInsuranceHistory(newInsuranceHistoryData);

      const newDataInfoSecurity = {
        has_cyber_training:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_cyber_training"
          )?.attribute_value || "",
        has_qualified_it_team:
          infoSecurity?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_qualified_it_team"
          )?.attribute_value || "",

        has_password_policy:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_password_policy"
          )?.attribute_value || "",
        has_two_factor_auth:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_two_factor_auth"
          )?.attribute_value || "",
        has_malware_protection:
          infoSecurity?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_malware_protection"
          )?.attribute_value || "",
        has_regular_backups:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_regular_backups"
          )?.attribute_value || "",
        has_software_patches:
          infoSecurity?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_software_patches"
          )?.attribute_value || "",
      };

      setInformationSecurityMeasures(newDataInfoSecurity);

      const existingBusinessDetailsSection = data?.sections.find(
        (section: any) => section.section_code == BUSINESS_DETAILS
      );

      const newExistingBusinessDetails = {
        has_existing_business:
          existingBusinessDetailsSection?.section_details.find(
            (detail: any) =>
              detail?.section_detail_code == "has_existing_business"
          )?.attribute_value || "",
        existing_policy_number:
          existingBusinessDetailsSection?.section_details.find(
            (detail: any) =>
              detail?.section_detail_code == "existing_policy_number"
          )?.attribute_value || "",
      };
      setExistingBusinessDetails(newExistingBusinessDetails);
    }
  }, [response]);

  //To check if the quote option selected is empty
  useEffect(() => {
    if (
      Object?.keys(productDetails?.quoteOptionSelected)?.length == 0 &&
      !actionData?.response?.isQuoteRestarted
    ) {
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

  const downloadPolicy = async () => {
    try {
      await handleDownloadPolicyWording(response?.env?.POLICY_WORDING_URL);
    } catch (error: any) {
      console.error(error);
      setToastProps({ message: "Could not download file", variant: "error" });
    }
  };

  //For download
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (actionData?.response?.isDownload) {
        downloadPolicy();
      } else if (actionData?.response?.isQuoteRestarted) {
        resetState();
        navigate("/");
      }
    }
  }, [actionData]);

  const handleDownloadDocument = async () => {
    const formData = new FormData();
    formData.append("document_download_path", "");
    formData.append("isDownload", "true");
    submit(formData, { method: "post" });
  };

  // Bakend api call to restart quote: marks current policy as closed lost
  const handleRestartQuote = () => {
    const formData = new FormData();
    formData.append(
      "restartQuotePayload",
      JSON.stringify({ policy_id: quoteId })
    );
    formData.append("restartQuote", "true");
    submit(formData, { method: "POST" });
  };

  // Function to save data and go to the back
  const handleBackButton = () => {
    navigate("/final-questions?quoteId=" + quoteId);
  };

  const summaryData = {};
  return (
    <div>
      {/* Progress bar */}
      <div>
        <PolicyProgressBar
          currentStep={stepState?.currentStep}
          subStep={stepState?.subStep}
        />
      </div>

      <div className="flex justify-center bg-custom-gradient md:mb-3">
        <div className="max-w-[1536px] w-full">
          <div>
            <div className="pt-16 md:pt-20 md:pb-16 sm:px-10 md: lg:px-[10.375rem]">
              <div className="flex flex-col px-1 space-y-4 md:space-y-6 text-white">
                <h1 className="font-black text-[1.625rem] md:text-[2.5rem]">
                  Your summary
                </h1>
                <p className="font-bold text-base md:text-[1.25rem]">
                  Almost there, please review the details below.
                </p>
              </div>

              <div className="flex mt-10 md:space-x-10 md:justify-between  md:mt-12">
                <div className=" md:w-9/12 flex flex-col">
                  <div className="mb-6 md:mb-16">
                    <SummaryDetails
                      data={data}
                      summaryData={summaryData}
                      businessDetails={businessDetails}
                      lossHistory={lossHistory}
                      optionalExtensions={optionalExtensions}
                      dataCompliance={dataCompliance}
                      informationSecurityMeasures={informationSecurityMeasures}
                      insuranceHistory={insuranceHistory}
                      existingBusinessDetails={existingBusinessDetails}
                      quoteId={quoteId}
                      handleDownloadDocument={handleDownloadDocument}
                    />
                  </div>
                  <div className="hidden md:flex md:justify-between">
                    <div className="w-full md:w-[14.25rem]">
                      <Button
                        onClick={() => {
                          handleBackButton();
                          setStepState((prevState) => ({
                            ...prevState,
                            currentStep: 4,
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

                    <div className="w-full md:w-[14.25rem]">
                      <Button
                        onClick={() => {
                          navigate("/buy-policy?quoteId=" + quoteId);
                          setStepState((prevState) => ({
                            ...prevState,
                            currentStep: 6,
                            subStep: 1,
                          }));
                        }}
                        label="Buy policy"
                        variant="filled"
                        disabled={false}
                        showTooltip={false}
                        tooltipContent=""
                      />
                    </div>
                  </div>
                </div>
                <div className="hidden sticky top-0 mb-[107px] bg-white h-fit w-[32%] rounded-md md:flex">
                  <SummaryCard
                    quoteId={quoteId}
                    policyInceptionDate={data?.policy_inception_date}
                    handleDownloadDocument={handleDownloadDocument}
                  />
                </div>
              </div>
            </div>

            <div className="hidden bg-secondaryBg md:mx-10 lg:mx-[5.625rem] h-[1px] md:flex" />

            <div className="flex flex-col md:py-16 px-0 md:px-16 lg:px-[9.8125rem]">
              <div className="flex-flex-col space-y-16 text-white">
                <div className="flex flex-col space-y-5 pb-4 md:pb-12 px-9 md:px-0">
                  <h2 className="font-black text-[1.875rem] md:text-[2.5rem]">
                    Not quite ready?
                  </h2>
                  <div className="flex flex-col space-y-9">
                    <p>
                      Your quote is valid until{" "}
                      <span className="font-extrabold">
                        {data?.quote?.quote_expiration_date}
                      </span>
                      . If you have any questions, you can contact us below and
                      we’ll get in touch with you. Or call us on{" "}
                      <span className="text-secondary">1300 555 123</span>{" "}
                      (Mon-Fri 9am-5pm) with your quote number{" "}
                      <span className="font-extrabold">
                        {data?.quote?.quote_number}
                      </span>
                      .
                    </p>
                    <p className="font-bold text-[1.25rem]">
                      Need to change something that is non-editable ?{" "}
                      <button
                        className="text-secondary font-base font-medium underline cursor-pointer"
                        onClick={() => setIsRestartQuoteClikced(true)}
                      >
                        Restart quote
                      </button>
                    </p>
                  </div>
                </div>

                <GetInTouchCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RestartQuoteModal
        openModal={isRestartQuoteClikced}
        setOpenModal={setIsRestartQuoteClikced}
        handleRestartQuote={handleRestartQuote}
      />
    </div>
  );
};

export default Summary;

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
  const isDownload = formData.get("isDownload") === "true";
  const isRestartQuote = formData.get("restartQuote") === "true";

  const restartQuotePayload: any = formData.get("restartQuotePayload");

  let response;
  let resData;

  if (isDownload == true) {
    response = { isDownload: true };
    return json(
      {
        response: response,
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  } else if (isRestartQuote) {
    const data = JSON.parse(restartQuotePayload);

    resData = await restartQuote(session, data);

    if (resData?.status?.message === SUCCESS) {
      return json(
        {
          response: { isQuoteRestarted: true },
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    } else {
      return json(
        {
          response: resData,
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    }
  }
}
