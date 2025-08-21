import { useNavigate } from "@remix-run/react";
import QuestionTooltip from "../common/QuestionTooltip";
import ViewLinkIcon from "../Quote/Icons/ViewLinkIcon";
import Button from "../common/Button";
import CyberGoIcon from "../Quote/Icons/CyberGoIcon";
import CyberPlusIcon from "../Quote/Icons/CyberPlusIcon";
import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import { useAppContext } from "~/context/ContextProvider";
import { IndustryList } from "~/constants/quote";
import { ACCESS_CONTROL, HUMAN_RESOURCES_SECURITY } from "~/constants/string";
import { capitalizeFirstLetter, formatAmount } from "~/utils";

type SummaryHeadingProps = {
  heading: ReactNode;
  isEditable: boolean;
  goto?: string;
};

const SummaryHeading: React.FC<SummaryHeadingProps> = ({
  heading,
  isEditable,
  goto = "/",
}: SummaryHeadingProps) => {
  const navigate = useNavigate();

  return (
    <div className="py-4 px-6 bg-[#FAEFFC] md:rounded-t-md flex flex-col md:flex-row md:justify-between md:items-center">
      {heading}
      {!isEditable ? (
        <div className="text-primaryBg">
          This section cannot be changed{" "}
          <span className="align-middle">
            <QuestionTooltip
              tooltipContent={
                <p>
                  This section is a summary of your previous answers and cannot
                  be edited.
                </p>
              }
            />
          </span>
        </div>
      ) : (
        <div
          className="flex space-x-1 cursor-pointer"
          onClick={() => navigate(goto)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.5035 5.98109C19.8188 5.65012 19.9764 5.25611 19.9764 4.79905C19.9764 4.342 19.8188 3.94011 19.5035 3.59338L16.4066 0.496454C16.0599 0.165483 15.6541 0 15.1891 0C14.7242 0 14.3341 0.165483 14.0189 0.496454L11.8203 2.67139L17.305 8.17967L19.5035 5.98109ZM10.9693 3.52246L16.4539 9.00709L5.48463 20H0V14.4917L10.9693 3.52246ZM11.3948 5.76832C11.5839 5.76832 11.6785 5.86288 11.6785 6.05201C11.6785 6.14657 11.6548 6.22537 11.6076 6.28842L4.44444 13.4279C4.3814 13.4909 4.31048 13.5225 4.23168 13.5225C4.02679 13.5225 3.92435 13.4279 3.92435 13.2388C3.92435 13.1442 3.95587 13.0654 4.01891 13.0024L11.182 5.86288C11.2451 5.79984 11.316 5.76832 11.3948 5.76832ZM5.98109 17.0922L4.79905 18.2979H3.38061V16.6194H1.67849V15.2009L2.88416 13.9953L5.98109 17.0922Z"
              fill="#9E61C7"
            />
          </svg>
          <span className="text-secondary underline">Go back and edit</span>
        </div>
      )}
    </div>
  );
};

interface props {
  data: any;
  summaryData: any;
  businessDetails: any;
  lossHistory: any;
  informationSecurityMeasures: any;
  optionalExtensions: any;
  dataCompliance: any;
  insuranceHistory: any;
  existingBusinessDetails: any;
  quoteId: any;
  handleDownloadDocument:any,
}
const SummaryDetails: React.FC<props> = ({
  data,
  summaryData,
  businessDetails,
  lossHistory,
  informationSecurityMeasures,
  optionalExtensions,
  dataCompliance,
  insuranceHistory,
  existingBusinessDetails,
  quoteId,
  handleDownloadDocument,
}: props) => {
  const navigate = useNavigate();
  const { stepState, setStepState, productDetails } = useAppContext();
  const [industry_name, setIndustryName] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (summaryRef.current) {
      observer.observe(summaryRef.current);
    }

    return () => {
      if (summaryRef.current) {
        observer.unobserve(summaryRef.current);
      }
    };
  }, [summaryRef]);

  useEffect(() => {
    if (
      typeof businessDetails?.insured_industry === "string" &&
      businessDetails?.insured_industry !== "" &&
      businessDetails?.insured_industry !== undefined &&
      businessDetails?.insured_industry !== null
    ) {
      setIndustryName(data?.industry_name || "");
    }
  }, [summaryData]);

  return (
    <div className="bg-white rounded-md relative">
      {/* Summary card */}
      <div className="md:hidden" ref={summaryRef}>
        <div className="h-3 bg-secondaryBg"></div>
        <div className="px-9 py-10 rounded-md text-primaryBg">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <p className="text-primaryBg">YOU'RE GETTING</p>
              {productDetails?.quoteOptionSelected?.plan_display_name?.toLowerCase() ===
              "cyberplus" ? (
                <CyberPlusIcon />
              ) : (
                <CyberGoIcon />
              )}
            </div>

            <div>
              <h1 className="font-black text-4xl">
                {productDetails?.quoteOptionSelected?.plan_display_name}
              </h1>
              <p className="text-primaryBg">
                <span className="text-3xl font-black">
                  $
                  {formatAmount(
                    Number(productDetails?.quoteOptionSelected?.total_payable)
                  )}
                </span>{" "}
                per year
              </p>
              <p>(Including GST)</p>
              <p>
                Your cover begins on{" "}
                <span className="font-extrabold">
                  {businessDetails?.policy_inception_date}
                </span>
              </p>
            </div>
            <div className="flex flex-col space-y-5">
              <div className="max-w-[19rem]">
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
              <div className="flex  text-grayCustom">
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
                  <p className="ml-7 font-medium">
                    ISOA Health Insurance can only be paid annually via credit
                    card.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-[0.125rem] items-center cursor-pointer text-primaryBg ">
              <span className="underline" onClick={() => handleDownloadDocument()}> View policy wording</span> &nbsp;{" "}
              <ViewLinkIcon />
            </div>
            <div className="h-[1px] bg-[#D8D8D8] md:hidden"></div>
          </div>
        </div>
      </div>

      {/* Sticky summary card for the smaller screens */}
      {isSticky && (
        <div className="md:hidden fixed inset-x-0 bottom-0 bg-white z-50">
          <div className="px-9 py-4 sm:py-10 text-primaryBg">
            <div className="flex sm:items-center flex-col space-y-2 sm:space-y-6">
              <div className="flex sm:space-x-14">
                <div className="hidden sm:flex sm:flex-col sm:space-y-2">
                  <p className="text-primaryBg">YOU'RE GETTING</p>
                  {productDetails?.quoteOptionSelected?.plan_display_name?.toLowerCase() ===
                  "cyberplus" ? (
                    <CyberPlusIcon />
                  ) : (
                    <CyberGoIcon />
                  )}
                </div>

                <div>
                  <h1 className="font-black text-[1.75rem] sm:text-4xl">
                    {productDetails?.quoteOptionSelected?.plan_display_name}
                  </h1>
                  <p className="text-primaryBg">
                    <span className="text-2xl sm:text-3xl font-black">
                      $
                      {formatAmount(
                        Number(
                          productDetails?.quoteOptionSelected?.total_payable
                        )
                      )}
                    </span>{" "}
                    per year
                  </p>
                  <p>(Including GST)</p>
                  <p className="hidden sm:flex">
                    Your cover begins on{" "}
                    <span className="font-extrabold">
                      {businessDetails?.policy_inception_date}
                    </span>
                  </p>
                </div>
              </div>

              <div className="sm:w-[85%]">
                <Button
                  onClick={() => {
                    navigate("/buy-policy?quoteId=" + quoteId);
                    setStepState((prevState) => ({
                      ...prevState,
                      currentStep: 6,
                      subStep: 1,
                    }));
                  }}
                  label="Continue to payment"
                  variant="filled"
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business details */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Business details
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">My occupation is best descibed as</p>
            <p>{industry_name}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">No. of employees</p>
            <p>{businessDetails?.num_employees}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Total annual revenue</p>
            <p>
              ${formatAmount(Number(businessDetails?.total_annual_revenue))}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Of the total revenue above: Is any of it generated from online
              activities?
            </p>
            <p>
              ${formatAmount(Number(businessDetails?.total_revenue_online))}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Is more than 50% derived from overseas?</p>
            <p>
              {capitalizeFirstLetter(
                businessDetails?.has_50PCT_overseas_revenue
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Loss history */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Loss history
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              In the past three years, have you or any of your company's
              subsidiaries had any incidents, unplanned business interruptions,
              claims or legal actions involving unauthorised access or misuse of
              your network that cost more than $5,000?
            </p>
            <p>{capitalizeFirstLetter(lossHistory?.has_claim_issue)}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Are there any factors that you are currently aware of that may
              cause a loss or claim that may be covered under the ISOA Health
              Insurance policy you are applying for?
            </p>
            <p>{capitalizeFirstLetter(lossHistory?.has_loss_factors)}</p>
            {lossHistory?.has_loss_factors?.toLowerCase() !== "no" && (
              <>
                <p className="text-grayCustom">Please provide more details.</p>
                <p>{lossHistory?.has_loss_factors_details || "-"}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data & compliance */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Data & compliance
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              How many customers does your business have, from whom you use,
              store, disclose or collect information from.
            </p>
            <p>{dataCompliance?.num_customers}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Does your business collect, store, disclose or use any of the
              following categories of data?
            </p>
            <ul className="list-disc pl-5 ">
              {dataCompliance?.sensitive_data[0]
                ?.split(",")
                ?.map((item: string, index: number) => (
                  <li key={index} className="leading-6">
                    {item}
                  </li>
                ))}
            </ul>
            <p>
              {dataCompliance?.sensitive_data?.includes("None of the above") &&
                dataCompliance?.sensitive_data_none_details}
            </p>
          </div>
        </div>
      </div>

      {/* Operation security */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Operation security
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Do you use anti-malware protection for all your devices such as
              workstations, servers, laptops and any other applicable systems?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_malware_protection
              )}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Do you perform regular backups of all your business critical data
              and store one copy off-site?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_regular_backups
              )}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Do you apply updates and patches to software, operating systems
              and applications including anti-malware protection?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_software_patches
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Optional Extensions */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Optional Extensions
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="text-primaryBg">COMPUTER CRIME</p>
            <p className="font-bold">
              Would you like to purchase the extra cover for Computer Crime?
            </p>
            <p>
              {capitalizeFirstLetter(
                optionalExtensions?.has_computer_crime_cover
              ) || "-"}
            </p>

            {optionalExtensions?.has_computer_crime_cover?.toLowerCase() !==
              "no" && (
              <>
                <p className="font-bold">
                  a) Do you segregate duties so that no one person can request
                  or authorise (i) expenditure; (ii) refund monies, or (iii)
                  refund goods?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_segregated_duties_payments
                  ) || "-"}
                </p>

                <p className="font-bold">
                  b) Do you segregate duties so that no one person can make
                  payments and reconcile bank statements?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_segregated_duties_expense
                  ) || "-"}
                </p>

                <p className="font-bold">
                  c) Do you segregate duties and system passwords so that no one
                  person can request and authorise the release of electronic
                  funds transfers in respect of the same transaction?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_segregated_duties_fund_txns
                  ) || "-"}
                </p>

                <p className="font-bold">
                  d) Do you require two or more signatories or approvers for
                  fund transfers over $1,000?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_auth_limits_1K
                  ) || "-"}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-primaryBg">SOCIAL ENGINEERING FRAUD</p>
            <p className="font-bold">
              Would you like to purchase the extra cover for Social Engineering
              Fraud?
            </p>
            <p>
              {capitalizeFirstLetter(
                optionalExtensions?.has_social_engg_fraud_ext
              )}
            </p>

            {optionalExtensions?.has_social_engg_fraud_ext?.toLowerCase() !==
              "no" && (
              <>
                <p className="font-bold">
                  a) Do you have procedures for verifying destination bank
                  accounts and/or any changes to destination bank account
                  details, before funds are transferred?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_verified_destination_bank
                  ) || "-"}
                </p>

                <p className="font-bold">
                  b) Do you hold an approved list of vendors and suppliers,
                  including authorised contact people and contact details, which
                  is checked when payments are made?
                </p>
                <p>
                  {capitalizeFirstLetter(
                    optionalExtensions?.has_approved_vendors
                  ) || "-"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Company URL */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Company URL
            </h2>
          }
          isEditable={false}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">Website</p>
            <p>{businessDetails?.insured_company_url || "-"}</p>
          </div>
        </div>
      </div>

      {/* Policy holder contact details */}
      <div>
        <SummaryHeading
          heading={
            <h2 className=" flex text-[1.75rem] text-primaryBg font-bold">
              Policy holder{" "}
              <span className="hidden md:block">&nbsp;contact&nbsp;</span>
              details
            </h2>
          }
          isEditable={true}
          goto={`/contact-details?quoteId=${quoteId}`}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Do you currently have business insurance with ISOA?{" "}
              <span className="text-secondaryBg">(non editable)</span>
            </p>

            <p>
              {capitalizeFirstLetter(
                existingBusinessDetails?.has_existing_business
              ) || "-"}
            </p>
          </div>

          {existingBusinessDetails?.has_existing_business?.toLowerCase() ==
            "yes" && (
            <div className="flex flex-col space-y-4">
              <p className="font-bold">
                What is your existing business policy number?{" "}
                <span className="text-secondaryBg">(non editable)</span>
              </p>

              <p>{existingBusinessDetails?.existing_policy_number || "-"}</p>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Referral code{" "}
              <span className="text-secondaryBg">(non editable)</span>
            </p>

            <p>{businessDetails?.referral_code || "-"}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Name of contact person</p>
            <p>{businessDetails?.insured_contact_name}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Phone number</p>
            <p>{businessDetails?.insured_contact_phone}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Email address{" "}
              <span className="text-secondaryBg">(non editable)</span>
            </p>
            <p>{businessDetails?.insured_contact_email}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Contact consent{" "}
              <span className="text-secondaryBg">(non editable)</span>
            </p>

            <p>{businessDetails?.contact_consent ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Additional details */}
      <div>
        <SummaryHeading
          heading={
            <h2 className="text-[1.75rem] text-primaryBg font-bold">
              Additional details
            </h2>
          }
          isEditable={true}
          goto={`/final-questions?quoteId=${quoteId}`}
        />
        <div className="p-8 text-primaryBg  flex flex-col space-y-6">
          <div className="font-black text-2xl">Insurance history</div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">
              Does your business currently hold or has ever held Cyber Insurance
              providing the same or similar cover as the insurance sought?{" "}
            </p>
            <p>
              {capitalizeFirstLetter(insuranceHistory?.has_current_cyber_cover)}
            </p>
            {insuranceHistory?.has_current_cyber_cover?.toLowerCase() !==
              "no" && (
              <>
                {" "}
                <p className="font-bold">
                  Please input your insurance provider(s).
                </p>
                <p>
                  {insuranceHistory?.has_current_cyber_cover_details || "-"}
                </p>
              </>
            )}
          </div>

          <div className="h-[1px] bg-[#D8D8D8]"></div>

          <div className="font-black text-2xl">
            Information security measures
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-primaryBg">{HUMAN_RESOURCES_SECURITY}</p>

            <p className="font-bold">
              Does your business provide training or education to employees to
              increase Cyber security awareness and phishing resilience at least
              once annually?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_cyber_training
              )}
            </p>

            <p className="font-bold">
              Does your business have qualified personnel assigned to manage and
              secure IT systems?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_qualified_it_team
              )}
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-primaryBg">{ACCESS_CONTROL}</p>

            <p className="font-bold">
              Does your business enforce a password policy requiring strong and
              unique passwords for all accounts and devices operating?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_password_policy
              )}
            </p>

            <p className="font-bold">
              Does your business enforce implementation of two-factor
              authentication for all accounts where available?
            </p>
            <p>
              {capitalizeFirstLetter(
                informationSecurityMeasures?.has_two_factor_auth
              )}
            </p>
          </div>

          <div className="h-[1px] bg-[#D8D8D8]"></div>

          <div className="font-black text-2xl">Business details</div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Business name</p>
            <p>{businessDetails?.insured_company_name}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Trading name</p>
            <p>{businessDetails?.insured_trading_name}</p>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="font-bold">Business address</p>
            <div>
              <p>{businessDetails?.insured_address_line1} </p>
              <p> {businessDetails?.insured_address_line2} </p>
              <p> {businessDetails?.insured_address_postcode} </p>
              <p> {businessDetails?.insured_address_state}</p>
            </div>
          </div>

          <div className="font-black text-2xl">Policy duration</div>

          <p>
            {businessDetails?.policy_inception_date} -{" "}
            {businessDetails?.policy_expiry_date}
          </p>

          <div className="md:hidden sm:w-4/5">
            <Button
              onClick={() => {
                navigate("/final-questions");
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
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;
