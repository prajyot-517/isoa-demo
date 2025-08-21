import QuestionTooltip from "../common/QuestionTooltip";
import ToggleButtonGroup from "../common/ToggleButtonGroup";
import LossHistoryIcon from "./SVGIcons/LossHistoryIcon";
import DataAndComplianceIcon from "./SVGIcons/DataAndComplianceIcon";
import Checkbox from "../common/Checkbox";
import OperationSecurityIcon from "./SVGIcons/OperationSecurityIcon";
import OptionalExtensionsIcon from "./SVGIcons/OptionalExtensionsIcon";
import InformationCard from "../common/InformationCard";
import BusinessURLIcon from "./SVGIcons/BusinessURLIcon";
import FormSectionHeader from "../common/FormSectionHeader";
import { useAppContext } from "~/context/ContextProvider";
import RestrictedUrlIcon from "./SVGIcons/RestrictedUrlIcon";
import { formatAmount } from "~/utils";
interface props {
  handleToggleChange: any;
  handleChange: any;
  handleCheckBox: any;
  isDomainValid: boolean;
  insuredURLBlacklisted: boolean;
}

const doesTheCompanyCollectStoreData = [
  {
    id: "Identifying Information",
    value: "Identifying Information",
    tooltip: (
      <div className=" w-full">
        <h2>For example</h2>
        <ul className="list-disc px-6">
          <li className="">Name</li>
          <li className="">Photograph</li>
          <li className="">Date of Birth</li>
          <li className="">Driver's license number</li>
          <li className="">National ID number,</li>
          <li className="">Tax file number(TFN)</li>
          <li className="">Internet protocol (IP) addresses</li>
          <li className="">Location information from a mobile device</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Contact Information",
    value: "Contact Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Phone Number</li>
          <li className="">Email Address</li>
          <li className="">Postal Address</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Demographic Information",
    value: "Demographic Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Gender</li>
          <li className="">Race/Ethnicity</li>
          <li className="">Nationality</li>
          <li className="">Language</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Sensitive Information",
    value: "Sensitive Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Individual's racial or ethnic origin</li>
          <li className="">Political opinions or associations</li>
          <li className="">Religious or philosophical beliefs</li>
          <li className="">Trade union membership or associations</li>
          <li className="">Sexual orientation</li>
          <li className="">Criminal record</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Health Information",
    value: "Health Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc list-outside px-6 ">
          <li className="">Notes of your symptoms or diagnosis</li>
          <li className="">
            Information about a health service you've had or will receive
          </li>
          <li className="">Specialist reports and test results</li>
          <li className="">Prescriptions and other pharmaceutical purchases</li>
          <li className="">Dental records</li>
          <li className="">Your genetic inforamtion</li>
          <li className="">Your wishes about future health services</li>
          <li className="">Your wishes about potential organ donations</li>
          <li className="">Appointment and billing details</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Financial Information",
    value: "Financial Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Income record</li>
          <li className="">Expenses record</li>
          <li className="">Debt record</li>
          <li className="">Repayment history</li>
          <li className="">Investments record</li>
          <li className="">Credit score</li>
          <li className="">Credit report</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Biometric Information",
    value: "Biometric Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Fingerprints</li>
          <li className="">Facial Recognition Data</li>
          <li className="">Iris Recognition Data</li>
          <li className="">Palm Recognition Data</li>
          <li className="">Voiceprint</li>
          <li className="">Signature</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Employment Record Information",
    value: "Employment Record Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Job application</li>
          <li className="">Resume</li>
          <li className="">Employment contract</li>
          <li className="">Performance reviews</li>
          <li className="">Disciplinary records</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Credit Information",
    value: "Credit Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Credit Card Number</li>
          <li className="">Credit Card Expiry Date</li>
          <li className="">Credit Card Verification Value(CVV)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "Proprietary Information",
    value: "Proprietary Information",
    tooltip: (
      <div className="">
        <h2 className="">For example</h2>
        <ul className="list-disc px-6 ">
          <li className="">Patents - pending applications</li>
          <li className="">Trademarks - pending Trademark application</li>
          <li className="">Copyrights - Pending copyright registrations</li>
          <li className="">Trade Secrets</li>
          <li className="">
            Licensing - Intellectual property to and from third parties
          </li>
          <li className="">Commercial credit report</li>
        </ul>
      </div>
    ),
  },
  {
    id: "I do not collect any information",
    value: "I do not collect any information",
  },
  {
    id: "None of the above",
    value: "None of the above",
  },
];

const BusinessDetailsStep2Form: React.FC<props> = ({
  handleChange,
  handleToggleChange,
  handleCheckBox,
  isDomainValid,
  insuredURLBlacklisted,
}: props) => {

  const { businessDetails2, setBusinessDetails2 } = useAppContext();

  return (
    <div className="bg-white rounded-md border-0 shadow-custom">
      <div className="px-8 py-10 rounded-md xl:px-14 xl:pt-14 xl:pb-16 3xl:px-28">
        <form className="flex flex-col space-y-16 xl:px-9 text-primary">
          {/* Loss History */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<LossHistoryIcon />}
              title="Loss History"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                <p className="md:w-[512px] xl:max-w-3xl">
                  In the past three years, have you or any of your company's
                  subsidiaries had any incidents, unplanned business
                  interruptions, claims or legal actions involving unauthorised
                  access or misuse of your network that cost more than $5,000?
                </p>
                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_claim_issue"
                    value={businessDetails2?.has_claim_issue}
                    handleToggleChange={handleToggleChange}
                    id="has_claim_issue"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                  <div className="md:w-[512px] xl:max-w-3xl">
                    Are there any factors that you are currently aware of that
                    may cause a loss or claim that may be covered under the ISOA
                    Health Insurance policy you are applying for?{" "}
                    <span className="align-middle">
                      <QuestionTooltip tooltipContent="You need to tell us if there is anything that may affect this policy that we don't already know about. If you don't tell us, then your insurance may not be valid and you may not be covered if you need to make a claim." />
                    </span>
                  </div>
                  <div className="w-[289px] md:w-[335px]">
                    <ToggleButtonGroup
                      name="has_loss_factors"
                      value={businessDetails2?.has_loss_factors}
                      handleToggleChange={handleToggleChange}
                      id="has_loss_factors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Compliance */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<DataAndComplianceIcon />}
              title="Data & Compliance"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                <div className="md:w-[512px] xl:max-w-3xl">
                  How many customers does your business have that you use,
                  store, disclose or collect information from.{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Please estimate the number of customers you use, store, disclose or collect information from the list of sensitive data below." />
                  </span>
                </div>
                <div className="w-[289px] md:w-[335px]">
                  <input
                    type="text"
                    min={0}
                    value={formatAmount(businessDetails2?.num_customers)}
                    name="num_customers"
                    onChange={(e) => handleChange(e, "number")}
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="e.g. 100"
                    id="num_customers"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                  <div className="md:w-[512px] xl:max-w-3xl">
                    Does your business collect, store, disclose or use any of
                    the following categories of data?
                  </div>

                  <div className="flex flex-col space-y-5 w-[351px]">
                    <p className="text-primary">Select all that apply.</p>

                    {doesTheCompanyCollectStoreData?.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center flex-wrap space-x-2"
                      >
                        <Checkbox
                          label={option.id}
                          name="sensitive_data"
                          checked={businessDetails2?.sensitive_data?.some(
                            (item) => item.includes(option?.id)
                          )}
                          onChange={() => {
                            handleCheckBox(option.value);
                            if (option.id !== "None of the above") {
                              setBusinessDetails2((data: any) => {
                                return {
                                  ...data,
                                  sensitive_data_none_details: "",
                                };
                              });
                            }
                          }}
                          id={`sensitive_data_${index}`}
                        />
                        {option?.tooltip && (
                          <QuestionTooltip tooltipContent={option?.tooltip} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {businessDetails2?.sensitive_data?.some(
                  (data: any) => data == "None of the above"
                ) && (
                  <div className="flex flex-col mt-8 space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                    <p className="text-grayCustom">
                      Please provide more details.{" "}
                      <span className="text-xl font-bold">*</span>
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <input
                        type="text"
                        onChange={handleChange}
                        value={businessDetails2.sensitive_data_none_details}
                        name="sensitive_data_none_details"
                        className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                        placeholder="Tell us more about it."
                        id="sensitive_data_none_details"
                        maxLength={1000}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Operation Security */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<OperationSecurityIcon />}
              title="Operation Security"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                <div className="md:w-[512px] xl:max-w-3xl">
                  Do you use anti-malware protection for all your devices such
                  as workstations, servers, laptops and any other applicable
                  systems?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Malware protection is included with the latest Windows and Mac operating systems. Other examples include McAfee Antivirus and Norton Antivirus." />
                  </span>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_malware_protection"
                    value={businessDetails2?.has_malware_protection}
                    handleToggleChange={handleToggleChange}
                    id="has_malware_protection"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                <div className="md:w-[512px] xl:max-w-3xl">
                  Do you perform regular backups of all your business critical
                  data and store one copy off-site?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Regular backups provide the capability to restore data if the current dataset is corrupted. Note OneDrive is a cloud storage service, and does not qualify as a backup if live syncing is on. Cloud storage is considered a backup only if it is manually saved regularly. Critical data is defined by the industry you are in." />
                  </span>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_regular_backups"
                    value={businessDetails2?.has_regular_backups}
                    handleToggleChange={handleToggleChange}
                    id="has_regular_backups"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
                <p className="md:w-[512px] xl:max-w-3xl">
                  Do you apply updates and patches to software, operating
                  systems and applications including anti-malware protection?
                </p>
                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_software_patches"
                    value={businessDetails2?.has_software_patches}
                    handleToggleChange={handleToggleChange}
                    id="has_software_patches"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Extensions */}
          <div className="flex flex-col space-y-16">
            <FormSectionHeader
              icon={<OptionalExtensionsIcon />}
              title="Optional Extensions"
            />
            <div className="flex flex-col space-y-6">
              <div className="font-bold text-xl text-primaryBg">Computer Crime</div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                <div className="md:w-[512px] xl:max-w-3xl">
                  Would you like to purchase the extra cover for Computer Crime?
                  <div className="my-3 md:my-0">
                    <InformationCard
                      title=""
                      body="This covers you for money that is fraudulently moved, lost or stolen as a direct result of a targeted cyber-attack on your computer system."
                      iconColor="#5841BF"
                      backgroundColor="#FAEFFC"
                    />
                  </div>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_computer_crime_cover"
                    value={businessDetails2?.has_computer_crime_cover}
                    handleToggleChange={handleToggleChange}
                    id="has_computer_crime_cover"
                  />
                </div>
              </div>
              {businessDetails2?.has_computer_crime_cover === "yes" && (
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <div className="md:w-[512px] xl:max-w-3xl">
                      a) Do you segregate duties so that no one person can
                      request or authorise (i) expenditure; (ii) refund monies,
                      or (iii) refund goods?{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent="Are there two or more people that must confirm any transaction in your business?" />
                      </span>
                    </div>

                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_segregated_duties_payments"
                        value={businessDetails2?.has_segregated_duties_payments}
                        handleToggleChange={handleToggleChange}
                        id="has_segregated_duties_payments"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <p className="md:w-[512px] xl:max-w-3xl ">
                      b) Do you segregate duties so that no one person can make
                      payments and reconcile bank statements?
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_segregated_duties_expense"
                        value={businessDetails2?.has_segregated_duties_expense}
                        handleToggleChange={handleToggleChange}
                        id="has_segregated_duties_expense"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <p className="md:w-[512px] xl:max-w-3xl ">
                      c) Do you segregate duties and system passwords so that no
                      one person can request and authorise the release of
                      electronic funds transfers in respect of the same
                      transaction?
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_segregated_duties_fund_txns"
                        value={
                          businessDetails2?.has_segregated_duties_fund_txns
                        }
                        handleToggleChange={handleToggleChange}
                        id="has_segregated_duties_fund_txns"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <p className="md:w-[512px] xl:max-w-3xl ">
                      d) Do you require two or more signatories or approvers for
                      fund transfers over $1000?
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_auth_limits_1K"
                        value={businessDetails2?.has_auth_limits_1K}
                        handleToggleChange={handleToggleChange}
                        id="has_auth_limits_1K"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-6">
              <div className="font-bold text-xl text-primaryBg">Social Engineering Fraud</div>

              <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                <div className="md:w-[512px] xl:max-w-3xl">
                  Would you like to purchase the extra cover for Social
                  Engineering Fraud?
                  <div className="my-3">
                    <InformationCard
                      title=""
                      body="This covers you for money that is fraudulently moved, lost or stolen as a direct result of an email (phishing) or phone-related (phreaking) cyber-attack."
                      iconColor="#5841BF"
                      backgroundColor="#FAEFFC"
                    />
                  </div>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_social_engg_fraud_ext"
                    value={businessDetails2?.has_social_engg_fraud_ext}
                    handleToggleChange={handleToggleChange}
                    id="has_social_engg_fraud_ext"
                  />
                </div>
              </div>
              {businessDetails2?.has_social_engg_fraud_ext === "yes" && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <div className="md:w-[512px] xl:max-w-3xl">
                      a) Do you have procedures for verifying destination bank
                      accounts and/or any changes to destination bank account
                      details, before funds are transferred?{" "}
                      <span className="align-middle">
                        <QuestionTooltip tooltipContent="A destination bank account is the bank account where you want to send money, is there a verification process for any changes to the bank account?" />
                      </span>
                    </div>

                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_verified_destination_bank"
                        value={businessDetails2?.has_verified_destination_bank}
                        handleToggleChange={handleToggleChange}
                        id="has_verified_destination_bank"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                    <p className="md:w-[512px] xl:max-w-3xl ">
                      b) Do you hold an approved list of vendors and suppliers,
                      including authorised contact people and contact details,
                      which is checked when payments are made?
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_approved_vendors"
                        value={businessDetails2?.has_approved_vendors}
                        handleToggleChange={handleToggleChange}
                        id="has_approved_vendors"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business URL */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<BusinessURLIcon />}
              title="Business URL"
              subtitle="(if applicable)"
            />
            <div
              className={`flex flex-col  ${
                businessDetails2?.insured_company_url_blacklisted
                  ? "space-y-8"
                  : "space-y-5"
              }`}
            >
              <input
                type="url"
                name="insured_company_url"
                onChange={handleChange}
                value={businessDetails2?.insured_company_url ? businessDetails2?.insured_company_url : ""}
                className="px-4 py-[5px] w-full rounded-lg border border-grayCustom"
                placeholder="e.g. www.website.com"
                id="insured_company_url"
              />
              {!isDomainValid &&
                businessDetails2?.insured_company_url?.length > 0 && (
                  <p className="text-[#CC0000]">Please enter a valid url.</p>
                )}
              {insuredURLBlacklisted?.toString() === "true" && (
                <div className="flex px-4 py-3 space-x-2 bg-[#FFF3E6] rounded-sm">
                  <div>
                    <RestrictedUrlIcon />
                  </div>
                  <p>
                    Your business URL is restricted from our cyber vulnerability
                    assessment. However, you're still able to get a quote
                    without this assessment.
                  </p>
                </div>
              )}
              <InformationCard
                title="Why are we asking this?"
                body="To better understand your cyber risks, we've partnered with UpGuard, a world leading cyber security risk management software provider. We use your business URL to perform a cyber vulnerability assessment to determine your digital vulnerabilities. We will only use your business URL to perform this assessment and not for any other purposes such as marketing. In some instances your digital vulnerabilities may be too high for us to provide you with insurance."
                iconColor="#5841BF"
                backgroundColor="#FAEFFC"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetailsStep2Form;
