import QuestionTooltip from "../common/QuestionTooltip";
import ToggleButtonGroup from "../common/ToggleButtonGroup";
import Checkbox from "../common/Checkbox";
import FormSectionHeader from "../common/FormSectionHeader";
import InsuranceHistoryIcon from "./SVGIcons/InsuranceHistoryIcon";
import InformationSecurityMeasuresIcon from "./SVGIcons/InformationSecurityMeasuresIcon";
import BusinessDetailsIcon from "./SVGIcons/BusinessDetailsIcon";
import PolicyStartDateIcon from "./SVGIcons/PolicyStartDateIcon";
import CalenderIcon from "./SVGIcons/CalenderIcon";
import { useState } from "react";
import { useAppContext } from "~/context/ContextProvider";
import { useEffect } from "react";
import {
  calculatePolicyDateRange,
  convertDateToDDMMYYYY,
  convertDateToYYYYMMDD,
  getMaxDateForPolicyInception,
  getTodaysDate,
} from "~/utils";
import { RENEWAL } from "~/constants/string";

interface props {
  handleChange: any;
  handleToggleChange: any;
  handleCheckBox: any;
  isValidPostCode: boolean;
  policyType: string;
  parentPolicy: any;
}

const FinalQuestionsForm = ({
  handleChange,
  handleToggleChange,
  handleCheckBox,
  isValidPostCode,
  policyType,
  parentPolicy,
}: props) => {
  const { finalQuestionsDetails, setFinalQuestionsDetails } = useAppContext();

  // State to store the minimum and maximum allowable end dates
  const [minEndDate, setMinEndDate] = useState("");
  const [maxEndDate, setMaxEndDate] = useState("");

  useEffect(() => {
    const { minDate, maxDate } = calculatePolicyDateRange(
      finalQuestionsDetails?.policy_inception_date
    );

    setMinEndDate(minDate);
    setMaxEndDate(maxDate);
  }, []);

  const handleStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFinalQuestionsDetails((data) => {
      return {
        ...data,
        policy_expiry_date: "",
      };
    });

    const newDate = e.target.value;

    if (newDate) {
      setFinalQuestionsDetails((data) => {
        return {
          ...data,
          policy_inception_date: convertDateToDDMMYYYY(newDate),
        };
      });

      const [day, month, year] = convertDateToDDMMYYYY(newDate)
        .split("-")
        .map(Number);

      const date = new Date(year, month - 1, day);

      date.setFullYear(date.getFullYear() + 1);

      const formattedDate = [
        ("0" + date.getDate()).slice(-2),
        ("0" + (date.getMonth() + 1)).slice(-2),
        date.getFullYear(),
      ].join("-");

      setFinalQuestionsDetails((data) => {
        return {
          ...data,
          policy_expiry_date: formattedDate,
        };
      });

      const { minDate, maxDate } = calculatePolicyDateRange(
        convertDateToDDMMYYYY(newDate)
      );

      setMinEndDate(minDate);
      setMaxEndDate(maxDate);
    } else {
      setFinalQuestionsDetails((data) => {
        return {
          ...data,
          policy_inception_date: "",
        };
      });
    }
  };

  const handleEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newDate = e.target.value;
    if (newDate) {
      setFinalQuestionsDetails((data) => {
        return {
          ...data,
          policy_expiry_date: convertDateToDDMMYYYY(newDate),
        };
      });
    } else {
      setFinalQuestionsDetails((data) => {
        return {
          ...data,
          policy_expiry_date: "",
        };
      });
    }
  };

  return (
    <div className="bg-white rounded-md border-0 shadow-custom">
      <div className="px-8 py-10 rounded-md xl:py-14 xl:px-16">
        <form className="flex flex-col space-y-16 xl:px-7 text-primaryBg">
          {/* Insurance History */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<InsuranceHistoryIcon />}
              title="Insurance History"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col space-y-3 md:flex-row md:justify-between items-start md:space-y-0 md:space-x-4">
                <p className="md:w-[512px] xl:max-w-3xl text-grayCustom">
                  Does your business currently hold or has ever held Cyber
                  Insurance?
                </p>
                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_current_cyber_cover"
                    value={finalQuestionsDetails?.has_current_cyber_cover}
                    handleToggleChange={handleToggleChange}
                    id="has_current_cyber_cover"
                    disabled={parentPolicy ? true : false}
                  />
                </div>
              </div>

              {finalQuestionsDetails?.has_current_cyber_cover === "yes" && (
                <div className="flex flex-col mt-8 space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4 items-start">
                  <p className="text-grayCustom">
                    Please input your insurance provider(s).{" "}
                    <span className="text-xl font-bold">*</span>
                  </p>
                  <div className="w-[289px] md:w-[335px]">
                    <input
                      type="text"
                      onChange={handleChange}
                      value={
                        finalQuestionsDetails?.has_current_cyber_cover_details
                      }
                      name="has_current_cyber_cover_details"
                      className={`px-4 py-[10px] w-full rounded-lg border border-primaryBg ${
                        parentPolicy ? "cursor-not-allowed" : ""
                      }`}
                      placeholder="Insurance provider(s)"
                      id="has_current_cyber_cover_details"
                      disabled={parentPolicy ? true : false}
                      maxLength={1000}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Information Security Measures */}
          <div className="flex flex-col space-y-16">
            <FormSectionHeader
              icon={<InformationSecurityMeasuresIcon />}
              title="Information Security Measures"
            />
            <div className="flex flex-col space-y-6">
              <div className="font-bold text-xl">Human Resources Security</div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0 items-start">
                <div className="md:w-[512px] xl:max-w-3xl text-grayCustom">
                  Does your business provide training or education to employees
                  to increase Cyber security awareness and phishing resilience
                  at least once annually?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Phishing is a technique used by cyber criminals to gain access to your system or data. They may send fake emails pretending to originate from trusted sources, but in reality will download malware or attempt to collect sensitive information from you." />
                  </span>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_cyber_training"
                    value={finalQuestionsDetails?.has_cyber_training}
                    handleToggleChange={handleToggleChange}
                    id="has_cyber_training"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                <div className="md:w-[512px] xl:max-w-3xl text-grayCustom">
                  Does your business have qualified personnel assigned to manage
                  and secure IT systems?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Qualified personnel are defined as IT staff or an individual with expertise in managing and securing computer systems." />
                  </span>
                </div>
                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_qualified_it_team"
                    value={finalQuestionsDetails?.has_qualified_it_team}
                    handleToggleChange={handleToggleChange}
                    id="has_qualified_it_team"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="font-bold text-xl">Access Control</div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                <div className="md:w-[512px] xl:max-w-3xl text-grayCustom">
                  Does your business enforce a password policy requiring strong
                  and unique passwords for all accounts and devices operating?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="A strong password is defined as a mix of letters, numbers and symbols, and is long. Unique requires for you to not reuse the password amongst different accounts, and to not share your password with others." />
                  </span>
                </div>

                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_password_policy"
                    value={finalQuestionsDetails?.has_password_policy}
                    handleToggleChange={handleToggleChange}
                    id="has_password_policy"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                <div className="md:w-[512px] xl:max-w-3xl text-grayCustom">
                  Does your business enforce implementation of two-factor
                  authentication for all accounts where available?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="Two factor authentication requires both a password and a passcode generated by text or an authentication app. For example Google Authenticator or Authy." />
                  </span>
                </div>
                <div className="w-[289px] md:w-[335px]">
                  <ToggleButtonGroup
                    name="has_two_factor_auth"
                    value={finalQuestionsDetails?.has_two_factor_auth}
                    handleToggleChange={handleToggleChange}
                    id="has_two_factor_auth"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<BusinessDetailsIcon />}
              title="Business Details"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4 md:space-y-0">
                <p className="text-grayCustom">Business Name</p>
                <div className="flex flex-col space-y-5 w-[289px] md:w-[335px]">
                  <input
                    type="text"
                    name="insured_company_name"
                    value={finalQuestionsDetails?.insured_company_name}
                    onChange={handleChange}
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="Company name"
                    id="insured_company_name"
                    maxLength={255}
                  />
                  <div className="pt-3">
                    <Checkbox
                      label="My trading name is different"
                      name="is_trading_name_different"
                      checked={finalQuestionsDetails?.is_trading_name_different}
                      onChange={handleCheckBox}
                      id="is_trading_name_different"
                    />
                  </div>
                </div>
              </div>

              {finalQuestionsDetails?.is_trading_name_different && (
                <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4 md:space-y-0">
                  <p className="text-grayCustom">Trading Name</p>
                  <div className="w-[289px] md:w-[335px]">
                    <input
                      type="text"
                      name="insured_trading_name"
                      value={finalQuestionsDetails?.insured_trading_name}
                      onChange={handleChange}
                      className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                      placeholder="Trading name"
                      id="insured_trading_name"
                      maxLength={255}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4 md:space-y-0">
                <p className="text-grayCustom">Business Address</p>
                <div className="flex flex-col space-y-5 w-[289px] md:w-[335px]">
                  <input
                    type="text"
                    name="insured_address_line1"
                    onChange={handleChange}
                    value={finalQuestionsDetails?.insured_address_line1}
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="Address line 1"
                    id="insured_address_line1"
                    maxLength={255}
                  />
                  <input
                    type="text"
                    onChange={handleChange}
                    name="insured_address_line2"
                    value={finalQuestionsDetails?.insured_address_line2}
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="Address line 2/City (optional)"
                    id="insured_address_line2"
                    maxLength={255}
                  />
                  <input
                    type="text"
                    onChange={handleChange}
                    name="insured_address_state"
                    value={finalQuestionsDetails?.insured_address_state}
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="State/region"
                    id="insured_address_state"
                    maxLength={50}
                  />
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, "number")}
                    value={finalQuestionsDetails?.insured_address_postcode}
                    name="insured_address_postcode"
                    className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                    placeholder="Postcode"
                    id="insured_address_postcode"
                    maxLength={10}
                  />
                  {!isValidPostCode && (
                    <p className="text-red-500 text-xs mt-2">
                      Please enter a valid post code.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Policy Dates */}
          <div className="flex flex-col space-y-12">
            <FormSectionHeader
              icon={<PolicyStartDateIcon />}
              title="Policy Start Date"
            />
            <div className="flex flex-col space-y-12">
              <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4 md:space-y-0">
                <p className="text-grayCustom">When do you want to start your policy?</p>
                <div className=" w-[289px] md:w-[335px]">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Select date"
                      className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                      value={finalQuestionsDetails?.policy_inception_date}
                      disabled={policyType?.toLowerCase() === RENEWAL}
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                      <CalenderIcon />
                    </div>
                    <input
                      type="date"
                      min={getTodaysDate()}
                      max={getMaxDateForPolicyInception()}
                      value={
                        convertDateToYYYYMMDD(
                          finalQuestionsDetails?.policy_inception_date
                        ) || ""
                      }
                      onChange={handleStartDateChange}
                      disabled={policyType?.toLowerCase() === RENEWAL}
                      className={`absolute top-0 left-0 pr-3 w-full h-full opacity-[0.00000000001] ${
                        parentPolicy ? "cursor-not-allowed" : ""
                      }`}
                      id="policy_inception_date"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-col mt-8 space-y-3 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4 md:space-y-0">
                <div>
                  When do you want to end your policy?{" "}
                  <span className="align-middle">
                    <QuestionTooltip tooltipContent="AMI only offers policies with a lifespan between nine to fifteen months." />
                  </span>
                </div>
                <div className=" w-[289px] md:w-[335px]">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Select date"
                      className={`px-4 py-[10px] w-full rounded-lg border border-grayCustom `}
                      value={finalQuestionsDetails?.policy_expiry_date}
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                      <CalenderIcon />
                    </div>
                    <input
                      type="date"
                      disabled={
                        finalQuestionsDetails?.policy_inception_date === ""
                      }
                      onChange={handleEndDateChange}
                      value={
                        convertDateToYYYYMMDD(
                          finalQuestionsDetails?.policy_expiry_date
                        ) || ""
                      }
                      className={`absolute top-0 left-0 pr-3 w-full h-full opacity-[0.00000000001] ${
                        finalQuestionsDetails?.policy_inception_date === ""
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                      min={minEndDate}
                      max={maxEndDate}
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinalQuestionsForm;
