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
import EmailIcon from "~/components/Quote/Icons/EmailIcon";
import NotQuiteReadyIcon from "~/components/Quote/Icons/NotQuiteReadyIcon";
import ViewLinkIcon from "~/components/Quote/Icons/ViewLinkIcon";
import ProductDetails from "~/components/Quote/ProductDetails";
import UpgardCyberRiskProfile from "~/components/Quote/UpgardCyberRiskProfile";
import YourQuoteCard from "~/components/Quote/YourQuoteCard";
import AdditionalInsuranceCTA from "~/components/common/AdditionalInsuranceCTA";
import Button from "~/components/common/Button";
import GetInTouchCard from "~/components/common/GetInTouchCard";
import NothingFound from "~/components/common/NothingFound";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import RestartQuoteModal from "~/components/common/RestartQuoteModal";
import { SUCCESS } from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  editCoverageAndExcess,
  getQuoteById,
  updatePolicy,
  restartQuote,
  emailQuote,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { handleDownloadPolicyWording } from "~/utils";
import RefreshIcon from "~/assets/SVGIcons/RefreshIcon";

type SectionDetail = {
  section_id: string;
  section_detail_index: number;
  section_detail_id: string;
  section_detail_code: string;
  attribute_value: string | null;
  attribute_type: string;
  attribute_name: string;
};

type Section = {
  section_name: string;
  section_index: number;
  section_id: string;
  section_details: SectionDetail[];
  section_code: string;
  policy_id: string;
};

type Data = Section[];

type AttributeValue = boolean | null;

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  // if (!(await verifyAuthToken(session))) {
  //   return redirect("/login", {
  //     headers: {
  //       "Set-Cookie": await destroySession(session),
  //     },
  //   });
  // }

  session.unset("username");
  session.unset("isExistingUser");

  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  const response = await getQuoteById(session, quoteId);
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

const Quote = () => {
  const { stepState, setProductDetails, resetState } = useAppContext();
  const { setToastProps } = useToast();
  const response = useLoaderData<typeof loader>();
  const [quoteData, setQuoteData] = useState<any>({});
  const [quoteCardData, setQuoteCardData] = useState<any>({});
  const [sortedQuoteOptionsData, setSortedQuoteOptionsData] = useState<any>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const submit = useSubmit();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [quoteIdForEmailQuote, setQuoteIdForEmailQuote] = useState("");
  const [isRestartQuoteClikced, setIsRestartQuoteClikced] = useState(false);
  let nothingFound =
    response?.status?.statusCode === 400 ||
      response?.status?.statusCode === 500 ||
      response?.status?.statusCode === 401
      ? true
      : false;

  const actionData: any = useActionData();

  const [maxTries, setMaxTries] = useState(0);
  const [abortRequest, setAbortRequest] = useState(false);
  const [isDocsGenerated, setIsDocsGenerated] = useState(false);
  const [isFetchingDocsData, setIsFetchingDocsData] = useState(false);

  const [isOptionalExtensionForQuote1, setOptionalExtensionForQuote1] =
    useState({
      isEnabled: null,
      checked: null,
      section_detail_code: "has_computer_crime_cover",
    });

  const [isOptionalExtensionForQuote2, setOptionalExtensionForQuote2] =
    useState({
      isEnabled: null,
      checked: null,
      section_detail_code: "has_social_engg_fraud_ext",
    });

  const optionalExtensions = {
    has_computer_crime_cover: [
      "has_segregated_duties_payments",
      "has_segregated_duties_expense",
      "has_segregated_duties_fund_txns",
      "has_auth_limits_1K",
    ],
    has_social_engg_fraud_ext: [
      "has_verified_destination_bank",
      "has_approved_vendors",
    ],
  };

  const [quoteDataForRecalculate, setQuoteDataForRecalculate] = useState({
    policy_id: "",
    policy_stage: "",
    quote: {
      quote_id: "",
      quote_options: [
        {
          standard_excess: 0,
          standard_coverage: 0,
          quote_option_id: "",
        },
      ],
    },
  });

  // Get attribute value of a particular section_details_code of a section_code from sections
  function getAttributeValueBySectionAndCode(
    data: Data,
    sectionCode: string,
    sectionDetailCode: string
  ): AttributeValue {
    const section = data.find((item) => item.section_code === sectionCode);

    if (
      section &&
      section.section_details &&
      Array.isArray(section.section_details)
    ) {
      const sectionDetail = section.section_details.find(
        (item) => item.section_detail_code === sectionDetailCode
      );
      if (sectionDetail) {
        if (sectionDetail.attribute_value?.toLowerCase() === "yes") {
          return true;
        } else {
          return false;
        }
      }
    }
    return null;
  }

  function getUpdatedSectionsForOptionalExtensions(
    array: Data,
    sectionCode: string,
    sectionDetailCode: string,
    checkedValue: boolean | null
  ): Data {
    return array.map((section) => {
      if (section.section_code === sectionCode) {
        const updatedDetails = section.section_details.map((detail) => {
          if (detail.section_detail_code === sectionDetailCode) {
            detail.attribute_value = checkedValue ? "yes" : "no";
          }
          return detail;
        });
        section.section_details = updatedDetails;
      }
      return section;
    });
  }

  function findIsEditableForOptionalExtension(coverages: any) {
    // Filter the coverages array to find the object with limit_name including "Optional Extension"
    const optionalExtensionCoverage = coverages.find((coverage: any) =>
      coverage.limit_name.includes("Optional Extension")
    );

    // If optionalExtensionCoverage is found, return its is_editable value, otherwise return null
    return optionalExtensionCoverage
      ? optionalExtensionCoverage.is_editable
      : null;
  }

  useEffect(() => {
    //For backend validations
    if (response && response?.data) {
      if (response?.status?.statusCode != 200) {
        setErrors(response?.status?.description);
      } else {
        //Setting data into state of response from loader
        const data = response?.data?.policies[0];
        setQuoteData(data);
        setQuoteIdForEmailQuote(data?.quote?.quote_id);
        setIsDocsGenerated(data?.quote?.quote_documents?.length > 0)

        if (!actionData?.refreshQuote) {
          setSortedQuoteOptionsData(
            [...data?.quote?.quote_options || []].sort((a, b) => a.index - b.index)
          );
        }
        setQuoteCardData({
          quote_expiration_date: data?.quote?.quote_expiration_date,
          insured_contact_email: data?.insured_contact_email,
          quote_number: data?.quote?.quote_number,
        });

        setOptionalExtensionForQuote1((prevData: any) => {
          let flag = optionalExtensions.has_computer_crime_cover.every(
            (attribute) =>
              getAttributeValueBySectionAndCode(
                data?.sections,
                "optional_extensions",
                attribute
              )
          );
          return {
            ...prevData,
            isEnabled: flag,
            checked:
              getAttributeValueBySectionAndCode(
                data?.sections,
                "optional_extensions",
                "has_computer_crime_cover"
              ) && flag,
          };
        });

        setOptionalExtensionForQuote2((prevData: any) => {
          let flag = optionalExtensions.has_social_engg_fraud_ext.every(
            (attribute) =>
              getAttributeValueBySectionAndCode(
                data?.sections,
                "optional_extensions",
                attribute
              )
          );
          return {
            ...prevData,
            isEnabled: flag,
            checked:
              getAttributeValueBySectionAndCode(
                data?.sections,
                "optional_extensions",
                "has_social_engg_fraud_ext"
              ) && flag,
          };
        });

        setQuoteDataForRecalculate((prevData) => {
          return {
            ...prevData,
            policy_id: response?.data?.policies[0]?.policy_id,
            policy_stage: response?.data?.policies[0]?.policy_stage,
            quote: {
              ...prevData.quote,
              quote_id: response?.data?.policies[0]?.quote?.quote_id,
            },
          };
        });
      }
    }
  }, [response]);

  /** Handle refresh for Email Quote */
  const handleRefresh = (isPollingCall = false) => {
    const formData = new FormData();
    formData.append("refresh_quote", "true");

    if (isPollingCall) {

      if (isFetchingDocsData) {
        setAbortRequest(true);
        return;
      }
      setAbortRequest(false);
      setMaxTries(prev => prev + 1);
      formData.append("isPollingCall", "true");
    }

    setIsFetchingDocsData(true);
    submit(formData, { method: "POST" });
  };

  /** Polling function to periodically check the document generation */
  useEffect(() => {
    let timer;

    const pollDocuments = () => {
      timer = setTimeout(() => {
        handleRefresh(true);
      }, 70000);

      return () => clearTimeout(timer);
    };

    //Max 4 automated API tries to fetch 'Documents Generation'
    if (!isDocsGenerated && !isFetchingDocsData && !abortRequest && maxTries < 4) {
      pollDocuments();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isDocsGenerated, isFetchingDocsData, abortRequest, maxTries, actionData]);

  const downloadPolicy = async () => {
    try {
      await handleDownloadPolicyWording(response?.env?.POLICY_WORDING_URL);
    } catch (error: any) {
      console.error(error);
      setToastProps({ message: "Could not download file", variant: "error" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (actionData?.response?.isDownload) {
        downloadPolicy();
      } else if (actionData?.response?.isQuoteRestarted) {
        resetState();
        navigate("/");
      } else if (
        actionData?.response?.isCoverageUpdated ||
        actionData?.response?.isOptionalExtensionsUpdated
      ) {
        setToastProps({
          message: "Your quote has been updated.",
          variant: "success",
        });
      } else if (actionData?.response?.isQuoteEmailed) {
        setToastProps({
          message: "We have emailed you the quote.",
          variant: "success",
        });
      } else if (actionData?.refreshQuote) {
        setAbortRequest(false);
        setIsFetchingDocsData(false);

        if (
          actionData?.response &&
          actionData?.response?.data?.policies &&
          actionData?.response?.status?.statusCode == 200
        ) {
          const data = actionData?.response?.data?.policies[0];

          /** Update quote documents */
          const isRefresh = actionData?.refreshQuote && (data?.quote?.quote_documents?.length > 0);
          if (isRefresh) {
            setIsDocsGenerated(data?.quote?.quote_documents?.length > 0)
            setQuoteData((prevState) => {  // update state only if docs are generated
              return {
                ...prevState,
                quote: {
                  ...prevState.quote,
                  quote_documents: data?.quote?.quote_documents,
                },
              };
            });
          }
        }
      }
    }
  }, [actionData]);

  //For backend errors
  useEffect(() => {
    //For document generation warning msg
    if (
      actionData?.response?.status?.statusCode == 204 &&
      actionData?.isEmailQuote
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.description?.message ??
          actionData?.response?.status?.description,
        variant: "warning",
      });
    }

    if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description &&
      !actionData?.isEmailQuote &&
      !actionData?.isPollingCall
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

    //For backend errors from loader
    if (
      response?.status?.statusCode !== 400 &&
      response?.status?.statusCode !== 200 &&
      response?.status?.description
    ) {
      setToastProps({
        message:
          response?.status?.description?.message ??
          response?.status?.description,
        variant: "error",
      });
    }
  }, [actionData, response]);

  const handleDownloadDocument = async () => {
    const formData = new FormData();
    formData.append("document_download_path", "");
    formData.append("isDownload", "true");
    submit(formData, { method: "post" });
  };

  const handleQuoteOptionSelect = (quoteOption: any) => {
    setProductDetails((data) => {
      return { ...data, quoteOptionSelected: quoteOption };
    });

    navigate(`/contact-details?quoteId=${quoteId}`);
  };

  const handleToggleOptionalExtension = (index: any, checked: any) => {
    let updatedSections: Section[] = [];

    if (isOptionalExtensionForQuote1?.isEnabled && index === 0) {
      updatedSections = getUpdatedSectionsForOptionalExtensions(
        response?.data?.policies[0]?.sections,
        "optional_extensions",
        isOptionalExtensionForQuote1?.section_detail_code,
        checked
      );
    }

    if (isOptionalExtensionForQuote2?.isEnabled && index === 1) {
      updatedSections = getUpdatedSectionsForOptionalExtensions(
        response?.data?.policies[0]?.sections,
        "optional_extensions",
        isOptionalExtensionForQuote2?.section_detail_code,
        checked
      );
    }

    let updateOptionalExtensionsPayload = {
      policy_id: response?.data?.policies[0]?.policy_id,
      policy_stage: response?.data?.policies[0]?.policy_stage,
      confirm_basic_cover_nourl: true,
      sections: updatedSections,
    };

    const formData = new FormData();
    formData.append("response", JSON.stringify(response?.data?.policies[0]));
    formData.append(
      "optionalExtensionsSectionsData",
      JSON.stringify(updateOptionalExtensionsPayload)
    );
    formData.append("updateOptionalExtensions", "true");
    submit(formData, { method: "POST" });
  };

  const handleRecalculateButton = () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(quoteDataForRecalculate));
    formData.append("recalculate", "true");
    submit(formData, { method: "POST" });
  };

  const handleRestartQuote = () => {
    const formData = new FormData();
    formData.append(
      "restartQuotePayload",
      JSON.stringify({ policy_id: quoteId })
    );
    formData.append("restartQuote", "true");
    submit(formData, { method: "POST" });
  };

  const handleEmailQuote = () => {
    const formData = new FormData();
    formData.append(
      "emailQuotePayload",
      JSON.stringify({ policy_id: quoteId, quote_id: quoteIdForEmailQuote })
    );
    formData.append("emailQuote", "true");
    submit(formData, { method: "POST" });
  };

  return (
    <>
      {nothingFound ? (
        <NothingFound />
      ) : (
        <div>
          {/* Progress bar */}
          <div>
            <PolicyProgressBar
              currentStep={stepState?.currentStep}
              subStep={stepState?.subStep}
            />
          </div>

          {response?.data?.policies[0]?.parent_policy && (
            <div className="flex justify-center space-x-2 text-primaryBg px-4 py-3 bg-[#F0F9E9]">
              <p>
                You also have an{" "}
                <span
                  className="text-secondary underline cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/my-policy?policyId=${response?.data?.policies[0]?.parent_policy?.policy_id}`
                    )
                  }
                >
                  existing Cyber Insurance policy
                </span>{" "}
                with us.
              </p>
            </div>
          )}

          <div className="flex justify-center bg-[#B6E2FD]">
            <div className="max-w-[1536px] w-full">
              <div className=" sm:px-10 md:px-[2.25rem] lg:px-[2.5rem] xl:px-[4rem] 2xl:px-[6.25rem] 3xl:px-40">
                <div className="flex py-20">
                  <YourQuoteCard quoteCardData={quoteCardData} />
                </div>

                <div className="flex flex-col  mb-[47px] space-y-16 bg-white">
                  {response?.data?.policies[0]?.insured_company_url !== null &&
                    response?.data?.policies[0]?.insured_company_url !== "" && (
                      <div>
                        <UpgardCyberRiskProfile
                          generationDate={
                            quoteData?.upguard_score_generation_date
                          }
                          upguardScore={quoteData?.upguard_score}
                          information={
                            <p className="ml-7 font-medium text-sm text-primaryBg">
                              When you purchase an ISOA Health Insurance policy
                              you will be provided with an in-depth UpGuard
                              report that highlights those areas of
                              vulnerability cybercriminals may exploit and
                              recommendations on how your business can improve
                              it's cyber security. We monitor your UpGuard score
                              and if there is a material increase in your cyber
                              risk, we will send you an updated report as soon
                              as possible explaining new vulnerabilities in your
                              website.{" "}
                            </p>
                          }
                        />
                      </div>
                    )}

                  <div>
                    {sortedQuoteOptionsData?.length > 0 && (
                      <ProductDetails
                        quoteOptions={sortedQuoteOptionsData}
                        handleQuoteOptionSelect={handleQuoteOptionSelect}
                        setOptionalExtensionForQuote1={
                          setOptionalExtensionForQuote1
                        }
                        setOptionalExtensionForQuote2={
                          setOptionalExtensionForQuote2
                        }
                        isOptionalExtensionForQuote1={
                          isOptionalExtensionForQuote1
                        }
                        isOptionalExtensionForQuote2={
                          isOptionalExtensionForQuote2
                        }
                        setQuoteDataForRecalculate={setQuoteDataForRecalculate}
                        handleRecalculateButton={handleRecalculateButton}
                        quoteDataForRecalculate={quoteDataForRecalculate}
                        handleToggleOptionalExtension={
                          handleToggleOptionalExtension
                        }
                        policyType={response?.data?.policies[0]?.policy_type}
                        parentPolicy={
                          response?.data?.policies[0]?.parent_policy
                        }
                        //  policyId={quoteId}
                        // quoteId={quoteIdForEmailQuote}
                      />
                    )}
                  </div>

                  <div>
                    <div className="sm:px-14 text-primaryBg flex flex-col px-6 space-y-6">
                      {/* <div className="flex flex-row space-x-1 items-center">
                        <p>Read more about policy wording</p>
                        <button
                          className="text-secondary cursor-pointer flex space-x-1 items-center"
                          onClick={() => handleDownloadDocument()}
                        >
                          <span className="underline"> here</span>{" "}
                          <ViewLinkIcon />
                        </button>
                      </div> */}
                      <div className="flex">
                        <div className="flex space-x-2">
                          <div className="-mt-[2px]">
                            <svg
                              width="17"
                              height="24"
                              viewBox="0 0 17 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.421 16.0093C16.1297 14.791 16.484 13.4546 16.484 12C16.5586 10.5454 16.2043 9.20902 15.421 7.99068C14.6378 6.77233 13.6681 5.80265 12.5119 5.08159C11.3558 4.36052 10.0193 4 8.50262 4C6.98591 4 5.64327 4.36052 4.47465 5.08159C3.30604 5.80265 2.34256 6.77233 1.58421 7.99068C0.825851 9.20902 0.465326 10.5454 0.502622 12C0.539919 13.4546 0.900443 14.791 1.58421 16.0093C2.26797 17.2277 3.23144 18.1974 4.47465 18.9184C5.71786 19.6395 7.0605 20 8.50262 20C9.94474 20 11.2812 19.6395 12.5119 18.9184C13.7427 18.1974 14.7124 17.2277 15.421 16.0093ZM9.82663 7.67366V6.01399C9.82663 5.91453 9.79555 5.83372 9.73339 5.77156C9.67123 5.7094 9.59042 5.67832 9.49097 5.67832H7.49563C7.39617 5.67832 7.31537 5.7094 7.25321 5.77156C7.19104 5.83372 7.15997 5.91453 7.15997 6.01399V7.67366C7.15997 7.77312 7.19104 7.85392 7.25321 7.91608C7.31537 7.97824 7.39617 8.00932 7.49563 8.00932H9.49097C9.59042 8.00932 9.67123 7.97824 9.73339 7.91608C9.79555 7.85392 9.82663 7.77312 9.82663 7.67366ZM11.1506 16.9977V15.338C11.1506 15.2385 11.1196 15.1577 11.0574 15.0956C10.9952 15.0334 10.9206 15.0023 10.8336 15.0023H9.82663V9.669C9.82663 9.56954 9.79555 9.48873 9.73339 9.42657C9.67123 9.36441 9.59042 9.33333 9.49097 9.33333H6.17162C6.07216 9.33333 5.99136 9.36441 5.9292 9.42657C5.86704 9.48873 5.83596 9.56954 5.83596 9.669V11.3287C5.83596 11.4281 5.86704 11.5089 5.9292 11.5711C5.99136 11.6333 6.07216 11.6643 6.17162 11.6643H7.15997V15.0023H6.17162C6.07216 15.0023 5.99136 15.0334 5.9292 15.0956C5.86704 15.1577 5.83596 15.2385 5.83596 15.338V16.9977C5.83596 17.0971 5.86704 17.1779 5.9292 17.2401C5.99136 17.3023 6.07216 17.3333 6.17162 17.3333H10.8336C10.9206 17.3333 10.9952 17.3023 11.0574 17.2401C11.1196 17.1779 11.1506 17.0971 11.1506 16.9977Z"
                                fill="#5841BF"
                              />
                            </svg>
                          </div>
                          <p className="ml-7 font-medium text-primaryBg">
                          ISOA Helath Insurance can only be paid annually via
                            credit card.
                            <br />
                            <br />
                            As our ISOA Helath Insurance policy does not renew
                            automatically you will receive a notification from
                            us at least one month before the end date of your
                            policy. This notification will be sent to the email
                            address you registered with us and will require you
                            to answer some additional questions before a renewal
                            can take place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col space-y-8 bg-[#FFF9E7] text-primaryBg md:flex-row md:space-x-8 md:space-y-0 py-6">
                      <div className="w-full flex flex-col px-6 md:my-5 space-y-8 md:px-16">
                        <div className="flex flex-col space-y-5">
                          <div className="flex items-center space-x-3">
                            <EmailIcon />
                            <h3 className="font-bold text-[1.75rem]">
                              Email quote
                            </h3>
                          </div>
                          <p>
                            Email yourself a copy of your quote for your
                            records.
                          </p>
                          <div>
                            <p className="font-black">Your email</p>
                            <p>{quoteData?.insured_contact_email}</p>
                          </div>
                        </div>
                        <div className="w-full flex justify-center gap-4">
                          <div className="w-full md:w-[14.25rem]">
                            <Button
                              onClick={() => handleEmailQuote()}
                              label="Email quote"
                              variant=""
                              disabled={!isDocsGenerated}
                              showTooltip={!isDocsGenerated}
                              tooltipContent="Please wait while your quote documents are being generated."
                              id="email_quote_btn"
                            />
                          </div>
                          {!isDocsGenerated &&
                            <div className="w-max">
                              <Button
                                label={<RefreshIcon styles="px-2" />}
                                onClick={() => {
                                  setAbortRequest(true);
                                  handleRefresh();
                                }} />
                            </div>}
                        </div>
                      </div>
                      <div className="relative">
                        <div className="bg-[#B1B1B1] mx-6 md:mx-0 h-[1px] md:h-0 md:w-0"></div>
                        <div className="hidden md:block bg-[#B1B1B1] w-[1px] h-full"></div>
                      </div>
                      <div className="w-full my-5 px-6 md:pl-10 md:pr-16">
                        <div className="flex flex-col space-y-5">
                          <div className="flex items-center space-x-3">
                            <NotQuiteReadyIcon />
                            <h3 className="font-bold text-[1.75rem]">
                              Not quite ready?
                            </h3>
                          </div>
                          <p>
                            Your quote is valid until{" "}
                            <span className="font-black">
                              {quoteData?.quote?.quote_expiration_date}
                            </span>
                            . If you have any questions, you can contact us
                            below and we’ll get in touch with you. Or call us on{" "}
                            <span className="text-secondary">1300 555 123</span>{" "}
                            (Mon-Fri 9am-5pm) with your quote number{" "}
                            <span className="font-black">
                              {quoteData?.quote?.quote_number}
                            </span>
                            .
                          </p>

                          <p className="font-bold">
                            Need to change something?{" "}
                            <button
                              className="font-medium underline text-secondary cursor-pointer"
                              onClick={() => setIsRestartQuoteClikced(true)}
                            >
                              Restart quote
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-14">
                  <GetInTouchCard />
                </div>
              </div>
            </div>
          </div>
          <div>
            <AdditionalInsuranceCTA />
          </div>
        </div>
      )}

      <RestartQuoteModal
        openModal={isRestartQuoteClikced}
        setOpenModal={setIsRestartQuoteClikced}
        handleRestartQuote={handleRestartQuote}
      />
    </>
  );
};

export default Quote;

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  // if (!(await verifyAuthToken(session))) {
  //   return redirect("/login", {
  //     headers: {
  //       "Set-Cookie": await destroySession(session),
  //     },
  //   });
  // }
  const formData = await request.formData();

  // Extract the query parameter 'quoteId' from the request URL
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");

  const optionalExtensionsSectionsData: any = formData.get(
    "optionalExtensionsSectionsData"
  );
  const restartQuotePayload: any = formData.get("restartQuotePayload");
  const emailQuotePayload: any = formData.get("emailQuotePayload");

  const isRecalculateCoverages = formData.get("recalculate") == "true";
  const isUpdateOptionalExtensions =
    formData.get("updateOptionalExtensions") == "true";
  const isDownload = formData.get("isDownload") === "true";
  const isRestartQuote = formData.get("restartQuote") === "true";
  const isEmailQuote = formData.get("emailQuote") === "true";

  const isRefreshQuote = formData.get("refresh_quote") == "true";
  const isPollingCall = formData.get("isPollingCall") == "true";

  let response;
  let resData;

  const responseData: any = formData.get("response");
  response = JSON.parse(responseData);

  if (isRecalculateCoverages) {
    const data = JSON.parse(formData.get("data"));
    const resData = await editCoverageAndExcess(session, data, data?.policy_id);
    return json(
      {
        response: { ...resData, isCoverageUpdated: true },
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  } else if (isUpdateOptionalExtensions) {
    const data = JSON.parse(optionalExtensionsSectionsData);

    const payload = { ...response, ...data };
    resData = await updatePolicy(session, payload);

    return json(
      {
        response: { ...resData, isOptionalExtensionsUpdated: true },
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  } else if (isDownload == true) {
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
  } else if (isEmailQuote) {
    const data = JSON.parse(emailQuotePayload);
    resData = await emailQuote(session, data);
    if (resData?.status?.message === SUCCESS) {
      return json(
        {
          response: { isQuoteEmailed: true },
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    } else {
      return json(
        {
          response: resData,
          isEmailQuote: true,
        },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    }
  } else if (isRefreshQuote) {
    const resData = await getQuoteById(session, quoteId);
    return json(
      { response: resData, refreshQuote: true, isPollingCall },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  return json(
    {
      response: resData,
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}
