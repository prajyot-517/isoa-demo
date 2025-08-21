import { useNavigate } from "@remix-run/react";
import CyberGoIcon from "../Quote/Icons/CyberGoIcon";
import CyberPlusIcon from "../Quote/Icons/CyberPlusIcon";
import UpgardCyberRiskProfile from "../Quote/UpgardCyberRiskProfile";
import Pill from "../common/Pill";
import QuestionTooltip from "../common/QuestionTooltip";
import CoverIcon from "./SVGIcons/CoverIcon";
import UpguardIcon from "./SVGIcons/UpguardIcon";
import DocumentsIcon from "./SVGIcons/DocumentsIcon";
import ViewLinkIcon from "../Quote/Icons/ViewLinkIcon";
import CancelPolicyIcon from "./SVGIcons/CancelPolicyIcon";
import { formatAmount, isFutureDate, shouldShowCOI } from "~/utils";
import { BOUND, CANCELLATION, ENDORSEMENT, RENEWAL } from "~/constants/string";
import { useEffect, useState } from "react";

const PRODUCT_NAME = "CyberPlus";

type SucceedingPolicy = {
  policy_type: string;
};

interface PolicyDetailsCardProps {
  responseData: any;
  handleDownloadDocument: (path: string, name: string) => void;
  policyId: any;
  succeedingBoundOrCancelledPolicy?: SucceedingPolicy;
  isPolicyDueForRenewal?: boolean;
  handleDownloadCOIDocument: any;
}

const PolicyDetailsCard = ({
  responseData,
  handleDownloadDocument,
  policyId,
  succeedingBoundOrCancelledPolicy,
  isPolicyDueForRenewal,
  handleDownloadCOIDocument,
}: PolicyDetailsCardProps) => {
  const navigate = useNavigate();

  const [policyCoverages, setPolicyCoverages] = useState([]);
  const [optionalExtensions, setOptionalExtensions] = useState([]);

  function categorizeAndSortCoverages(data: any) {
    // Filter and sort for policyCoverages
    const policyCoverages = data
      ?.filter(
        (category: any) =>
          category.category_name === "Third Party Covers" ||
          category.category_name === "First Party Covers"
      )
      ?.flatMap((category: any) => category.category_items)
      ?.sort((a, b) => a.coverage_index - b.coverage_index);

    // Filter and sort for optionalExtensions
    const optionalExtensions = data
      ?.filter(
        (category: any) =>
          category.category_name === "First Party Optional Extensions"
      )
      ?.flatMap((category: any) => category.category_items)
      ?.sort((a, b) => a.coverage_index - b.coverage_index);

    setPolicyCoverages(policyCoverages);
    setOptionalExtensions(optionalExtensions);
  }

  useEffect(() => {
    categorizeAndSortCoverages(responseData?.policy_coverages);
  }, [responseData]);

  return (
    <div className="bg-white rounded-md shadow -mt-2 md:-mt-10 text-primaryBg">
      {/* Policy details heading */}
      <div>
        <div className="h-[10px] bg-secondaryBg rounded-t-md"></div>
        <div className="flex flex-col space-y-9 pb-10 pt-9 px-6 sm:px-9 md:px-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex flex-col space-y-8   md:space-y-0 md:flex-row md:space-x-8">
              {PRODUCT_NAME?.toLowerCase() === "cyberplus" ? (
                <div className="mt-1">
                  <CyberPlusIcon />
                </div>
              ) : (
                <div className="mt-1">
                  <CyberGoIcon />
                </div>
              )}
              <div>
                <h1 className="font-black text-4xl">
                  {responseData?.quote_option_plan_name}
                </h1>
                <p className="text-primaryBg">
                  <span className="text-3xl font-black">
                    $
                    {formatAmount(
                      Number(responseData?.net_total_payable).toFixed(2)
                    )}
                  </span>{" "}
                  per year
                </p>
                <p>(Including GST)</p>
                <div className="mt-6">
                  <p>
                    Cover up to{" "}
                    <span className="font-extrabold">
                      $
                      {formatAmount(
                        Number(responseData?.policy_coverage_amount)
                      )}
                    </span>
                  </p>
                  <p>
                    Policy excess{" "}
                    <span className="font-extrabold">
                      $
                      {formatAmount(Number(responseData?.policy_excess_amount))}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col font-bold mt-5 sm:mt-0 md:items-end">
              <p>Policy number:</p>
              <p>{responseData?.policy_number}</p>
              <div className="mt-5 w-fit">
                {isPolicyDueForRenewal ? (
                  <Pill
                    variant="warning"
                    label={`Due for renewal on ${responseData?.effective_end_date}`}
                  />
                ) : succeedingBoundOrCancelledPolicy ? (
                  <Pill
                    variant="warning"
                    label={`Pending  ${
                      succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                      ENDORSEMENT
                        ? "endorsement"
                        : succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                          RENEWAL
                        ? "renewal"
                        : succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                          CANCELLATION
                        ? "cancellation"
                        : ""
                    }`}
                  />
                ) : isFutureDate(responseData?.effective_date) ? (
                  <Pill variant="success" label="Bound" />
                ) : (
                  <Pill variant="success" label="Active" />
                )}
              </div>
            </div>
          </div>
          <hr />
          <div className="flex flex-wrap gap-y-6 gap-x-[2rem] xl:gap-x-[3rem]">
            <div className="flex flex-col font-bold">
              <p className="text-primaryBg">Trading name</p>
              <p className="text-[1.25rem] font-bold">
                {responseData?.insured_trading_name}
              </p>
            </div>

            <div className="flex flex-col font-bold">
              <p className="text-primaryBg">Policy start date</p>
              <p className="text-[1.25rem] font-bold">
                {responseData?.policy_inception_date}
              </p>
            </div>

            <div className="flex flex-col font-bold">
              <p className="text-primaryBg">Policy expiry date</p>
              <p className="text-[1.25rem] font-bold">
                {responseData?.policy_expiry_date}
              </p>
            </div>

            <div className="flex flex-col font-bold">
              <p className="text-primaryBg">Policy effective start date </p>
              <p className="text-[1.25rem] font-bold ">
                {responseData?.effective_date}
              </p>
            </div>

            <div className="flex flex-col font-bold">
              <div className="text-primaryBg">
                Policy effective end date{" "}
                {succeedingBoundOrCancelledPolicy && (
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="This policy has a subsequent endorsement or renewal or cancellation effective from this date" />
                  </span>
                )}
              </div>
              <p
                className={`text-[1.25rem] font-bold ${
                  succeedingBoundOrCancelledPolicy ? "-mt-[6px]" : ""
                }`}
              >
                {responseData?.effective_end_date}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div>
        {/* Heading */}
        <div className="py-4 px-6 sm:px-9 md:px-16 bg-[#F5F5F5]">
          <div className="flex space-x-6 items-center">
            <CoverIcon />
            <h2 className="font-black text-2xl">Cover</h2>
          </div>
        </div>

        {/* Table */}
        <div className="py-10 px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col  md:w-1/2">
              {policyCoverages
                ?.slice(0, Math.ceil(policyCoverages?.length / 2))
                ?.map((item: any, index) => (
                  <div
                    key={index}
                    className={`px-6 py-5 sm:py-6 sm:px-8 border-t border-x border-[#D8D8D8] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"
                    } ${index === 0 ? "rounded-t-md" : ""} ${
                      index + 1 === Math.ceil(policyCoverages.length / 2)
                        ? "md:border-b md:rounded-b-md"
                        : ""
                    }`}
                  >
                    <div className="font-black">
                      {item.limit_name}{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent={item?.description} />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <p>{item?.coverage_title}</p>
                        <p className="font-bold text-[0.85rem] sm:text-lg">
                          {Number(item?.sublimit_value) === 0
                            ? "Not covered"
                            : `$${formatAmount(Number(item?.sublimit_value))}`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {item?.excess_title}{" "}
                          {item?.limit_name?.toLowerCase() ===
                            "business interruption" && (
                            <QuestionTooltip
                              tooltipContent={
                                "There is no dollar excess payable for Business Interruption Claims. We will cover losses incurred 12 hours after a Cyber Event that directly causes Business Interruption Loss, subject to terms and conditions."
                              }
                            />
                          )}
                        </div>

                        <p className="font-bold text-[0.85rem] sm:text-lg">
                          {item?.limit_name?.toLowerCase() !==
                            "business interruption" && item?.excess_value !== 0
                            ? "$"
                            : ""}

                          {Number(item?.excess_value) === 0
                            ? "Not covered"
                            : `${formatAmount(Number(item?.excess_value))}`}

                          {item?.limit_name?.toLowerCase() ===
                          "business interruption"
                            ? " hours"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex flex-col md:w-1/2">
              {policyCoverages
                ?.slice(Math.ceil(policyCoverages?.length / 2))
                ?.map((item: any, index) => (
                  <div
                    key={index}
                    className={`px-6 py-5 sm:py-6 sm:px-8 border-t border-x border-[#D8D8D8] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"
                    } ${index === 0 ? "rounded-t-md" : ""} ${
                      index + 1 ===
                      policyCoverages?.length -
                        Math.ceil(policyCoverages?.length / 2)
                        ? "border-b rounded-b-md"
                        : ""
                    }`}
                  >
                    <div className="font-black">
                      {item?.limit_name}{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent={item?.description} />
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <p>{item?.coverage_title}</p>
                        <p className="font-bold text-[0.85rem] sm:text-lg">
                          {Number(item?.sublimit_value) === 0
                            ? "Not covered"
                            : `$${formatAmount(Number(item?.sublimit_value))}`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {item?.excess_title}
                          {item?.limit_name?.toLowerCase() ===
                            "business interruption" && (
                            <QuestionTooltip
                              tooltipContent={
                                "There is no dollar excess payable for Business Interruption Claims. We will cover losses incurred 12 hours after a Cyber Event that directly causes Business Interruption Loss, subject to terms and conditions."
                              }
                            />
                          )}
                        </div>

                        <p className="font-bold text-[0.85rem] sm:text-lg">
                          {item?.limit_name?.toLowerCase() !==
                            "business interruption" && item?.excess_value !== 0
                            ? "$"
                            : ""}
                          {Number(item?.excess_value) === 0
                            ? "Not covered"
                            : `${formatAmount(Number(item?.excess_value))}`}
                          {item?.limit_name?.toLowerCase() ===
                          "business interruption"
                            ? " hours"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {optionalExtensions?.length > 0 && (
            <div className="py-4 font-bold text-[1.25rem]">
              Optional Extensions
            </div>
          )}

          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col  md:w-1/2">
              {optionalExtensions
                ?.slice(0, Math.ceil(optionalExtensions?.length / 2))
                ?.map((item: any, index) => (
                  <div
                    key={index}
                    className={`px-6 py-5 sm:py-6 sm:px-8 border-t border-x border-[#D8D8D8] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"
                    } ${index === 0 ? "rounded-t-md" : ""} ${
                      index + 1 === Math.ceil(optionalExtensions?.length / 2)
                        ? "md:border-b md:rounded-b-md"
                        : ""
                    }`}
                  >
                    <div className="font-black">
                      {item?.limit_name}{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent={item?.description} />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <p>{item?.coverage_title}</p>
                        <div className="font-bold text-[0.85rem] sm:text-lg flex items-center">
                          {responseData?.quote_option_plan_name
                            ?.toLowerCase()
                            ?.includes("cybergo") ? (
                            <>
                              Unavailable&nbsp;
                              <QuestionTooltip
                                tooltipContent={
                                  "This cover is not available with CyberGo."
                                }
                              />
                            </>
                          ) : (
                            <>
                              {Number(item?.sublimit_value) === 0
                                ? "Not covered"
                                : `$${formatAmount(
                                    Number(item?.sublimit_value)
                                  )}`}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p>{item?.excess_title}</p>

                        <div className="font-bold text-[0.85rem] sm:text-lg flex items-center">
                          {responseData?.quote_option_plan_name
                            ?.toLowerCase()
                            ?.includes("cybergo") ? (
                            <>
                              Unavailable&nbsp;
                              <QuestionTooltip
                                tooltipContent={
                                  "This cover is not available with CyberGo."
                                }
                              />
                            </>
                          ) : (
                            <>
                              {Number(item?.excess_value) === 0
                                ? "Not covered"
                                : `$${formatAmount(
                                    Number(item?.excess_value)
                                  )}`}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex flex-col md:w-1/2">
              {optionalExtensions
                ?.slice(Math.ceil(optionalExtensions?.length / 2))
                .map((item: any, index) => (
                  <div
                    key={index}
                    className={`px-6 py-5 sm:py-6 sm:px-8 border-t border-x border-[#D8D8D8] ${
                      index % 2 === 0
                        ? "bg-[#F5F5F5] md:bg-white"
                        : "bg-[#F5F5F5]"
                    } ${index === 0 ? "md:rounded-t-md" : ""} ${
                      index + 1 ===
                      optionalExtensions?.length -
                        Math.ceil(optionalExtensions?.length / 2)
                        ? "border-b rounded-b-md"
                        : ""
                    }`}
                  >
                    <div className="font-black">
                      {item?.limit_name}{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent={item?.description} />
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <p>{item?.coverage_title}</p>
                        <div className="font-bold text-[0.85rem] sm:text-lg flex items-center">
                          {responseData?.quote_option_plan_name
                            ?.toLowerCase()
                            ?.includes("cybergo") ? (
                            <>
                              Unavailable&nbsp;
                              <QuestionTooltip
                                tooltipContent={
                                  "This cover is not available with CyberGo."
                                }
                              />
                            </>
                          ) : (
                            <>
                              {Number(item?.sublimit_value) === 0
                                ? "Not covered"
                                : `$${formatAmount(
                                    Number(item?.sublimit_value)
                                  )}`}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p>{item?.excess_title}</p>

                        <div className="font-bold text-[0.85rem] sm:text-lg flex items-center">
                          {responseData?.quote_option_plan_name
                            ?.toLowerCase()
                            ?.includes("cybergo") ? (
                            <>
                              Unavailable&nbsp;
                              <QuestionTooltip
                                tooltipContent={
                                  "This cover is not available with CyberGo."
                                }
                              />
                            </>
                          ) : (
                            <>
                              {Number(item?.excess_value) === 0
                                ? "Not covered"
                                : `$${formatAmount(
                                    Number(item?.excess_value)
                                  )}`}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upguard cyber risk profile */}
      {responseData?.insured_company_url !== null &&
        responseData?.insured_company_url !== "" && (
          <div className="pb-10">
            <UpgardCyberRiskProfile
              generationDate={responseData?.upguard_score_generation_date}
              upguardScore={responseData?.upguard_score}
              policyType={responseData?.policy_type}
              upguardHeadingStyle="font-black text-2xl"
              information={
                <p className="ml-7 font-medium text-sm text-primaryBg">
                  You will receive an in-depth UpGuard report within 1-3
                  business days of buying a ISOA Health Insurance policy. Did not
                  receive it?{" "}
                  <span
                    className="text-secondary cursor-pointer underline"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact us
                  </span>
                  .
                </p>
              }
              upguardIcon={<UpguardIcon />}
            />
          </div>
        )}

      {/* Documents */}
      <div>
        {/* Heading */}
        <div className="py-4 px-6 sm:px-9 md:px-16 bg-[#F5F5F5]">
          <div className="flex space-x-6 items-center">
            <DocumentsIcon />
            <h2 className="font-black text-2xl">Documents</h2>
          </div>
        </div>

        {responseData?.policy_documents?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-6 md:px-[4.375rem] w-fit">
            <p className="text-primaryBg">
              Documents are being generated. Please refresh the page in a few
              moments to check for availability.
            </p>
            <div role="status" className="flex justify-center items-center">
              <div className="flex gap-2 mt-12">
                <div className="h-2 w-2 sm:h-4 sm:w-4 bg-secondaryBg rounded-full animate-loader" />
                <div className="h-2 w-2 sm:h-4 sm:w-4 bg-secondaryBg rounded-full animate-loader animation-delay-200" />
                <div className="h-2 w-2 sm:h-4 sm:w-4 bg-secondaryBg rounded-full animate-loader animation-delay-400" />
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {responseData?.policy_documents?.length > 0 && (
          <div className="py-10 px-6 md:px-[4.375rem] text-grayCustom grid grid-cols-1 md:grid-cols-3 gap-6">
            {responseData?.policy_documents?.map(
              (document: any, index: any) => (
                <div key={index} className="flex items-center">
                  <div
                    className="underline cursor-pointer font-bold text-lg text-primaryBg overflow-hidden whitespace-nowrap mr-1"
                    title={document?.document_name}
                    onClick={() =>
                      handleDownloadDocument(
                        document?.document_path,
                        document?.document_name
                      )
                    }
                  >
                    {document?.document_name}
                  </div>
                  <div>
                    <ViewLinkIcon />
                  </div>
                </div>
              )
            )}

            {shouldShowCOI(
              responseData?.effective_date,
              responseData?.effective_end_date
            ) && (
              <div className="flex items-center">
                <div
                  className="underline cursor-pointer font-bold text-lg text-primaryBg overflow-hidden whitespace-nowrap mr-1"
                  title="Certificate of Insurance"
                  onClick={() => handleDownloadCOIDocument()}
                >
                  Certificate of Insurance
                </div>
                <div>
                  <ViewLinkIcon />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!succeedingBoundOrCancelledPolicy && (
        <>
          <hr />
          <div className="py-10 px-6 md:px-16">
            <div className="flex space-x-4 p-8 bg-softBg rounded-[0.25rem]">
              <div>
                <CancelPolicyIcon />
              </div>
              <div className="flex flex-col space-y-4">
                <h2 className="font-bold text-2xl">
                  No longer need Cyber Insurance?
                </h2>
                <p>
                  You can cancel your policy at any time. If you cancel your
                  policy your cover will end at 4 PM on the date you select. You
                  will be refunded through the credit card you purchased the
                  policy with. This may take up to 5-10 business days.
                </p>
                <p
                  className="text-secondary underline cursor-pointer w-fit"
                  onClick={() =>
                    navigate("/cancel-policy/step-1?policyId=" + policyId)
                  }
                >
                  Cancel policy
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyDetailsCard;
