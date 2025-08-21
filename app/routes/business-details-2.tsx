import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Link,
  json,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import NothingFoundIcon from "~/assets/SVGIcons/NothingFoundIcon";
import WarningIcon from "~/assets/SVGIcons/WarningIcon";
import BusinessDetailsStep2Form from "~/components/BusinessDetailsForms/BusinessDetailsStep2Form";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import {
  CLOSED_LOST,
  DATA_COMPLIANCE,
  INFO_SECURITY_MEASURES,
  INSURED_DOMAIN_BLACKLISTED,
  I_DO_NOT_COLLECT_ANY_INFORMATION,
  LOSS_HISTORY,
  OPTIONAL_EXTENSIONS,
  QUOTED,
  RENEWAL,
  SUCCESS,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  createQuote,
  getPolicyById,
  updatePolicy,
  urlBlacklistCheck,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { domainValidation, removeCommas } from "~/utils";
import dns from "dns";
import util from "util";
import SocialEngineeringFraudIcon from "~/components/Quote/Icons/SocialEngineeringFraudIcon";

// Promisify the dns.lookup function
const dnsLookup = util.promisify(dns.lookup);

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  let response: any;
  if (quoteId !== "new-quote") {
    const session = await getSession(request.headers.get("cookie"));
    if (!(await verifyAuthToken(session))) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
    response = await getPolicyById(session, quoteId);
    return json(response, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    response = {
      newQuote: true,
    };
    return json(response);
  }
}

export default function BusinessDetailsStep2() {
  const navigate = useNavigate();
  const {
    stepState,
    setStepState,
    businessDetails2,
    setBusinessDetails2,
    businessDetails,
  } = useAppContext();
  const { setToastProps } = useToast();
  const [isDomainValid, setDomainValid] = useState(true);
  const response: any = useLoaderData<typeof loader>();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [openPolicyDeclinedModal, setOpenPolicyDeclinedModal] = useState(false);
  const [declinedReasons, setDeclinedReasons] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const submit = useSubmit();
  const actionData: any = useActionData();
  const [openNoURLModal, setOpenNoURLModal] = useState(false);
  const [isNoOptionalExtensionsModal, setNoOptionalExtensionsModal] =
    useState(false);
  const [isComputerCrimeNotProvided, setComputerCrimeNotProvided] =
    useState(false);
  const [isSocialEnggFraudNotProvided, setSocialEnggFraudNotProvided] =
    useState(false);
  const [openBlacklistedURLModal, setOpenBlacklistedURLModal] = useState(false);
  const [
    confirmNoOptionalExtensionsCover,
    setconfirmNoOptionalExtensionsCover,
  ] = useState(false);
  const [isOneOfTheOptionalExtensionsNo, setOneOfTheOptionalExtensionsNo] =
    useState(false);
  let data;
  const [isHardStopForOperationSecurity, setHardStopForOperationSecurity] =
    useState(false);
  const [isHardStopForLossHistory, setHardStopForLossHistory] = useState(false);

  //If fields already exist in backend
  useEffect(() => {
    if (response && !response.newQuote && response.data) {
      data = response.data.policies[0];
      const _lossHistory = data?.sections.find(
        (section: any) => section.section_code == LOSS_HISTORY
      );

      const dataComplianceData = data?.sections.find(
        (section: any) => section.section_code == DATA_COMPLIANCE
      );

      const infoSecurityMeasures = data?.sections.find(
        (section: any) => section.section_code == INFO_SECURITY_MEASURES
      );

      const optionalExtension = data?.sections.find(
        (section: any) => section.section_code == OPTIONAL_EXTENSIONS
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
        sensitive_data_none_details: dataComplianceData?.section_details.find(
          (detail: any) =>
            detail.section_detail_code == "sensitive_data_none_details"
        )?.attribute_value,
      };

      const newInfoSecurityMeasures = {
        has_malware_protection:
          infoSecurityMeasures?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_malware_protection"
          )?.attribute_value || "",
        has_regular_backups:
          infoSecurityMeasures?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_regular_backups"
          )?.attribute_value || "",
        has_software_patches:
          infoSecurityMeasures?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_software_patches"
          )?.attribute_value || "",
      };

      const newOptionalExtension = {
        has_computer_crime_cover:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_computer_crime_cover"
          )?.attribute_value || "",
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
          )?.attribute_value || "",

        has_social_engg_fraud_ext:
          optionalExtension?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_social_engg_fraud_ext"
          )?.attribute_value || "",

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
      };

      const newData = {
        ...newLossHistoryDetails,
        ...newDataCompliance,
        ...newInfoSecurityMeasures,
        ...newOptionalExtension,
        insured_company_url:
          businessDetails2?.insured_company_url || data?.insured_company_url,
        insured_company_url_blacklisted:
          businessDetails2?.insured_company_url_blacklisted ||
          data?.insured_company_url_blacklisted,
        confirm_basic_cover_blacklisted_url:
          businessDetails2?.confirm_basic_cover_blacklisted_url ||
          data?.confirm_basic_cover_blacklisted_url,
        confirm_basic_cover_nourl:
          businessDetails2?.confirm_basic_cover_nourl ||
          data?.confirm_basic_cover_nourl,
      };

      // Check if the new data is different from the current state
      if (JSON.stringify(newData) !== JSON.stringify(businessDetails2)) {
        setBusinessDetails2(newData);
      }
    }
  }, []);

  //If any one field is missing then disable the next button
  useEffect(() => {
    let masterFlag = false;
    let sensitiveDataFlag = false;
    let computerCrimeFlag = false;
    let socialEnggFlag = false;
    if (
      businessDetails2?.has_claim_issue.length > 0 &&
      businessDetails2?.has_loss_factors?.length > 0 &&
      businessDetails2?.num_customers?.length > 0 &&
      businessDetails2?.sensitive_data.length > 0 &&
      businessDetails2?.has_malware_protection.length > 0 &&
      businessDetails2?.has_regular_backups?.length > 0 &&
      businessDetails2?.has_software_patches.length > 0 &&
      businessDetails2?.has_computer_crime_cover?.length > 0 &&
      businessDetails2?.has_social_engg_fraud_ext?.length > 0 &&
      (businessDetails2?.insured_company_url?.length > 0 ? isDomainValid : true)
    ) {
      masterFlag = true;
    } else {
      masterFlag = false;
    }

    if (
      businessDetails2?.sensitive_data?.includes("None of the above") &&
      businessDetails2?.sensitive_data_none_details?.trim()?.length > 0
    ) {
      sensitiveDataFlag = true;
    } else if (
      !businessDetails2?.sensitive_data?.includes("None of the above") &&
      businessDetails2?.sensitive_data?.length > 0
    ) {
      sensitiveDataFlag = true;
    } else {
      sensitiveDataFlag = false;
    }

    if (
      businessDetails2?.has_computer_crime_cover?.toLowerCase() == "yes" &&
      businessDetails2?.has_segregated_duties_expense?.length > 0 &&
      businessDetails2?.has_segregated_duties_fund_txns?.length > 0 &&
      businessDetails2?.has_segregated_duties_payments?.length > 0 &&
      businessDetails2?.has_auth_limits_1K?.length > 0
    ) {
      computerCrimeFlag = true;
    } else if (
      businessDetails2?.has_computer_crime_cover?.toLowerCase() == "no"
    ) {
      computerCrimeFlag = true;
    } else {
      computerCrimeFlag = false;
    }
    if (
      businessDetails2?.has_social_engg_fraud_ext?.toLowerCase() == "yes" &&
      businessDetails2?.has_verified_destination_bank?.length > 0 &&
      businessDetails2?.has_approved_vendors?.length > 0
    ) {
      socialEnggFlag = true;
    } else if (
      businessDetails2?.has_social_engg_fraud_ext?.toLowerCase() == "no"
    ) {
      socialEnggFlag = true;
    } else {
      socialEnggFlag = false;
    }

    if (
      masterFlag &&
      computerCrimeFlag &&
      socialEnggFlag &&
      sensitiveDataFlag
    ) {
      setNextButtonDisabled(false);
    } else {
      setNextButtonDisabled(true);
    }
  }, [businessDetails2]);

  useEffect(() => {
    //Hardstop for operation security
    if (actionData?.response?.hardstopForOperationSecurity) {
      setHardStopForOperationSecurity(true);
    }

    //Hardstop for loss history
    if (actionData?.response?.hardstopForLossHistory) {
      setHardStopForLossHistory(true);
    }

    //For url blacklist validations
    if (
      actionData?.response?.status?.statusCode == 400 &&
      actionData?.response?.status?.description == INSURED_DOMAIN_BLACKLISTED
    ) {
      setBusinessDetails2((data) => {
        return {
          ...data,
          insured_company_url_blacklisted: true,
        };
      });
      setOpenBlacklistedURLModal(true);
    }

    //For no optional extensions check
    if (actionData?.response?.noOptionalExtensionsCheck == true) {
      setOneOfTheOptionalExtensionsNo(true);
      setNoOptionalExtensionsModal(true);
      setComputerCrimeNotProvided(actionData?.response?.isComputerCrime);
      setSocialEnggFraudNotProvided(actionData?.response?.isSocialEnggFraud);
    }

    // For policy declined modal
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
    }

    //For backend errors
    if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description &&
      actionData?.response?.status?.description != INSURED_DOMAIN_BLACKLISTED
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.message +
          "-" +
          JSON.stringify(
            actionData?.response?.status?.description?.message ??
              actionData?.response?.status?.description
          )?.replace(/['"]+/g, ""),
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

  //To check if the quote is in quoted stage
  useEffect(() => {
    if (response?.data?.policies?.length > 0) {
      const policyStage = response?.data?.policies[0]?.policy_stage;
      if (policyStage?.toLowerCase() == QUOTED) {
        navigate("/quote?quoteId=" + quoteId);
      }
    }
  }, [response]);

  //To check if user has refreshed, if yes then redirect him to first page business details-1
  useEffect(() => {
    if (
      (Object?.keys(businessDetails?.insured_industry)?.length == 0 ||
        businessDetails?.insured_industry == "") &&
      businessDetails?.num_employees?.length == 0 &&
      businessDetails?.total_annual_revenue?.length == 0 &&
      businessDetails?.has_50PCT_overseas_revenue?.length == 0
    ) {
      navigate("/business-details-1?quoteId=" + quoteId);
    }
  }, []);

  const handleChange = (e: any, type = "") => {
    const { name, value } = e?.target;
    if (name === "insured_company_url") {
      const domainValid = domainValidation(value);
      setDomainValid(domainValid);
      setBusinessDetails2((data: any) => {
        return {
          ...data,
          confirm_basic_cover_blacklisted_url: false,
          confirm_basic_cover_nourl: false,
          insured_company_url_blacklisted: false,
        };
      });
    }
    if (type === "number") {
      const formattedValue = value?.replace(/\D/g, "");

      if (name?.includes("num_customers")) {
        let numOfCustomers = removeCommas(formattedValue);
        if (numOfCustomers.length > 6) {
          setBusinessDetails2((data: any) => {
            return {
              ...data,
              num_customers: numOfCustomers.slice(0, 6),
            };
          });
        } else {
          setBusinessDetails2((data: any) => {
            return {
              ...data,
              num_customers: numOfCustomers,
            };
          });
        }
      } else {
        setBusinessDetails2((data: any) => {
          return {
            ...data,
            [name]: formattedValue,
          };
        });
      }
    } else {
      setBusinessDetails2((data: any) => {
        return {
          ...data,
          [name]: value,
        };
      });
    }
  };

  const handleToggleChange = (name: string, value: string) => {
    if (
      [
        "has_computer_crime_cover",
        "has_segregated_duties_payments",
        "has_segregated_duties_expense",
        "has_segregated_duties_fund_txns",
        "has_auth_limits_1K",
        "has_social_engg_fraud_ext",
        "has_verified_destination_bank",
        "has_approved_vendors",
      ]?.includes(name)
    ) {
      setOneOfTheOptionalExtensionsNo(false);
      setconfirmNoOptionalExtensionsCover(false);
    }

    if (name == "has_loss_factors" && value == "no") {
      setBusinessDetails2((data: any) => {
        return {
          ...data,
          has_loss_factors_details: "",
        };
      });
    }

    setBusinessDetails2((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  // Function to goto step back
  const handleBackButton = () => {
    navigate("/business-details-1?quoteId=" + quoteId);
  };

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    //To check if insured url is not provided and basic cover is also not confirmed
    if (
      (businessDetails2?.insured_company_url === "" ||
        businessDetails2?.insured_company_url === null) &&
      !businessDetails2?.confirm_basic_cover_nourl
    ) {
      setOpenNoURLModal(true);
    } //To check if hardstop for optional extensions is triggered and cover without optional extensions is also not confirmed
    else if (
      isOneOfTheOptionalExtensionsNo &&
      !confirmNoOptionalExtensionsCover
    ) {
      setNoOptionalExtensionsModal(true);
    } else {
      const formData = new FormData();
      formData.append("has_claim_issue", businessDetails2?.has_claim_issue);
      formData.append("has_loss_factors", businessDetails2?.has_loss_factors);
      formData.append(
        "has_loss_factors_details",
        businessDetails2?.has_loss_factors_details
      );
      formData.append("num_customers", businessDetails2?.num_customers);
      formData.append("sensitive_data", businessDetails2?.sensitive_data);
      formData.append(
        "sensitive_data_none_details",
        businessDetails2?.sensitive_data_none_details?.trim()
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
      formData.append(
        "has_auth_limits_1K",
        businessDetails2?.has_auth_limits_1K
      );
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
      formData.append(
        "confirm_no_optional_extensions_cover",
        confirmNoOptionalExtensionsCover
      );
      if (
        response &&
        !response.newQuote &&
        response?.data?.policies[0] &&
        response?.data?.policies[0]?.policy_type?.toLowerCase() === RENEWAL
      ) {
        const data = response.data.policies[0];
        formData.append("isUpdate", "true");
        formData.append("response", JSON.stringify(data, null, 2));
      }
      formData.append("isSaveAndNext", "true");
      submit(formData, { method: "post" });
    }
  };

  const handleCheckBox = (value: string) => {
    //If value is i do not collect any info
    if (value?.toLowerCase() == I_DO_NOT_COLLECT_ANY_INFORMATION) {
      const isIDoNotCollectAnyInfoIntoArray =
        businessDetails2?.sensitive_data?.includes(value);

      if (isIDoNotCollectAnyInfoIntoArray == false) {
        setBusinessDetails2((prev: any) => ({
          ...prev,
          sensitive_data: [value],
        }));
      } else {
        const newCheckboxArray = businessDetails2?.sensitive_data?.filter(
          (item: any) => item != value
        );
        setBusinessDetails2((prev: any) => ({
          ...prev,
          sensitive_data: newCheckboxArray,
        }));
      }
    } else {
      //If value is not  "i do not collect any info"
      if (value?.toLowerCase() === "none of the above") {
        const isNoneNodeAddedIntoArray =
          businessDetails2?.sensitive_data?.includes(value);

        if (isNoneNodeAddedIntoArray === false) {
          setBusinessDetails2((prev: any) => ({
            ...prev,
            sensitive_data: [value],
          }));
        } else {
          let newCheckboxArray = businessDetails2?.sensitive_data?.filter(
            (item: any) => item != value
          );
          if (newCheckboxArray?.includes("I do not collect any information")) {
            newCheckboxArray = newCheckboxArray?.filter(
              (item: any) =>
                item?.toLowerCase() != I_DO_NOT_COLLECT_ANY_INFORMATION
            );
          }
          setBusinessDetails2((prev: any) => ({
            ...prev,
            sensitive_data: newCheckboxArray,
            sensitive_data_none_details: "",
          }));
        }
      } else {
        const isSelected = businessDetails2?.sensitive_data?.includes(value);
        let newCheckboxes = isSelected
          ? businessDetails2?.sensitive_data?.filter(
              (item: any) => item !== value
            )
          : [...businessDetails2?.sensitive_data, value];

        if (newCheckboxes?.includes("None of the above")) {
          newCheckboxes = newCheckboxes?.filter(
            (item: any) => item != "None of the above"
          );
        }
        if (newCheckboxes?.includes("I do not collect any information")) {
          newCheckboxes = newCheckboxes?.filter(
            (item: any) =>
              item?.toLowerCase() != I_DO_NOT_COLLECT_ANY_INFORMATION
          );
        }
        setBusinessDetails2((prev: any) => ({
          ...prev,
          sensitive_data: newCheckboxes,
          sensitive_data_none_details: "",
        }));
      }
    }
  };

  const handleNoUrlConfirmation = () => {
    setBusinessDetails2((data: any) => {
      return {
        ...data,
        confirm_basic_cover_nourl: true,
      };
    });
    setOpenNoURLModal(false);
  };

  const handleBlacklistedUrlConfirmation = () => {
    setBusinessDetails2((data: any) => {
      return {
        ...data,
        confirm_basic_cover_blacklisted_url: true,
      };
    });
    setOpenBlacklistedURLModal(false);
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
          <div className="sm:px-10 md:px-28 lg:px-40">
            <div className="px-4 pt-16 pb-10 sm:px-0 md:pt-20 md:pb-16">
              <h1 className="font-black text-3xl text-primaryBg">
                Tell us about your business
              </h1>
            </div>

            {/* Business details step 2 form */}
            <div className="pb-10 md:pb-16">
              <BusinessDetailsStep2Form
                handleToggleChange={handleToggleChange}
                handleChange={handleChange}
                handleCheckBox={handleCheckBox}
                isDomainValid={isDomainValid}
                insuredURLBlacklisted={
                  businessDetails2?.insured_company_url_blacklisted
                }
              />
            </div>

            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() => {
                    setStepState((prevState) => ({
                      ...prevState,
                      subStep: 1,
                    }));
                    handleBackButton();
                  }}
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                  id="business_details_2_back_btn"
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={() => {
                    handleSaveAndNextButton();
                    setStepState((prevState) => ({
                      ...prevState,
                      subStep: 3,
                    }));
                  }}
                  label="Next"
                  variant="filled"
                  disabled={isNextButtonDisabled}
                  showTooltip={isNextButtonDisabled}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                  id="business_details_2_next_btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No url confirmation modal */}
      <Modal
        isOpen={openNoURLModal}
        onClose={() => setOpenNoURLModal(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to <br />
              provide your business with
              <br />
              the Computer Crime extension
            </h1>
            <p>
              As you didn't provide us a URL we are unable to offer you
              <br /> the Computer Crime Extension. However, you’re still able to
              get
              <br /> a quote without optional extensions.
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => handleNoUrlConfirmation()}
                label="Continue"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />

      {/* Blacklisted url confirmation modal */}
      <Modal
        isOpen={openBlacklistedURLModal}
        onClose={() => setOpenBlacklistedURLModal(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to <br />
              provide your business with
              <br />
              the Computer Crime extension
            </h1>
            <p>
              According to Upguard data, your URL is blacklisted! We are unable
              to offer you
              <br /> the Computer Crime Extension. However, you’re still able to
              get
              <br /> a quote without optional extensions.
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => handleBlacklistedUrlConfirmation()}
                label="Continue"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />

      {/* Confirmation of no optional extensions modal  */}
      <Modal
        isOpen={isNoOptionalExtensionsModal}
        onClose={() => {
          setNoOptionalExtensionsModal(false);
        }}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to
              <br />
              provide your business with <br />
              {isComputerCrimeNotProvided &&
                !isSocialEnggFraudNotProvided &&
                "the Computer Crime extension"}
              {isSocialEnggFraudNotProvided &&
                !isComputerCrimeNotProvided &&
                "the Social Engineering Fraud extension"}
              {isComputerCrimeNotProvided && isSocialEnggFraudNotProvided && (
                <>
                  the Computer Crime & the
                  <br /> Social Engineering Fraud extensions
                </>
              )}
            </h1>
            <p>
              Your business does not meet the eligibility criteria.
              <br />
              However, you’re still able to get a quote
              <br />
              without optional extensions.
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => {
                  setconfirmNoOptionalExtensionsCover(true);
                  setNoOptionalExtensionsModal(false);
                }}
                label="Continue"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />

      {/* If policy creation is declined (In the renewal case) */}
      <Modal
        isOpen={openPolicyDeclinedModal}
        onClose={() => setOpenPolicyDeclinedModal(false)}
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
                onClick={() =>
                  navigate(`/business-details-1?quoteId=${quoteId}`)
                }
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

      {/* Hardstop for declined operation security questions */}
      <Modal
        isOpen={isHardStopForOperationSecurity}
        onClose={() => setHardStopForOperationSecurity(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to proceed
            </h1>
            <p>
              You do not have the required cyber hygiene controls in place for
              us to
              <br /> provide a quote for your business. If you’d like to get in
              touch with us
              <br /> or have any questions, please{" "}
              <Link to="/contact-us" className="underline underline-offset-1 text-secondary">
                contact us
              </Link>
              .
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => {
                  setHardStopForOperationSecurity(false);
                }}
                label="Okay"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />

      {/* Hardstop for declined loss history questions */}
      <Modal
        isOpen={isHardStopForLossHistory}
        onClose={() => setHardStopForLossHistory(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to proceed
            </h1>
            <p>
              Your business could have a pending claim that does not meet
              <br /> our underwriting guidelines. If you’d like to get in touch
              with us
              <br /> or have any questions, please{" "}
              <Link
                to="/contact-us"
                className="underline underline-offset-1 text-secondary"
              >
                contact us
              </Link>
              .
            </p>
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <div className="w-60">
              <Button
                onClick={() => {
                  setHardStopForLossHistory(false);
                }}
                label="Okay"
                variant="filled"
                disabled={false}
                showTooltip={false}
                tooltipContent=""
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const has_claim_issue = formData.get("has_claim_issue");
  const has_loss_factors: any = formData.get("has_loss_factors");
  const has_loss_factors_details = formData.get("has_loss_factors_details");
  const num_customers = formData.get("num_customers");
  let sensitive_data: any = formData.get("sensitive_data");
  const sensitive_data_none_details = formData.get(
    "sensitive_data_none_details"
  );
  const has_malware_protection = formData.get("has_malware_protection");
  const has_regular_backups = formData.get("has_regular_backups");
  const has_software_patches = formData.get("has_software_patches");
  const has_computer_crime_cover: any = formData.get(
    "has_computer_crime_cover"
  );
  const has_segregated_duties_payments: any = formData.get(
    "has_segregated_duties_payments"
  );
  const has_segregated_duties_expense: any = formData.get(
    "has_segregated_duties_expense"
  );
  const has_segregated_duties_fund_txns: any = formData.get(
    "has_segregated_duties_fund_txns"
  );
  const has_auth_limits_1K: any = formData.get("has_auth_limits_1K");
  const has_social_engg_fraud_ext: any = formData.get(
    "has_social_engg_fraud_ext"
  );
  const has_verified_destination_bank: any = formData.get(
    "has_verified_destination_bank"
  );
  const has_approved_vendors: any = formData.get("has_approved_vendors");

  let insured_company_url: any =
    formData.get("insured_company_url") === "null" ||
    formData.get("insured_company_url") === "undefined"
      ? ""
      : formData.get("insured_company_url");

  const confirm_basic_cover_blacklisted_url =
    formData.get("confirm_basic_cover_blacklisted_url") === "undefined" ||
    formData.get("confirm_basic_cover_blacklisted_url") === "null"
      ? ""
      : formData.get("confirm_basic_cover_blacklisted_url");

  const confirm_basic_cover_nourl =
    formData.get("confirm_basic_cover_nourl") === "undefined" ||
    formData.get("confirm_basic_cover_nourl") === "null"
      ? ""
      : formData.get("confirm_basic_cover_nourl");

  const confirm_no_optional_extensions_cover: any =
    formData.get("confirm_no_optional_extensions_cover") === "undefined" ||
    formData.get("confirm_no_optional_extensions_cover") === "null"
      ? ""
      : formData.get("confirm_no_optional_extensions_cover");

  const insured_company_url_blacklisted: any =
    formData.get("insured_company_url_blacklisted") === "undefined" ||
    formData.get("insured_company_url_blacklisted") === "null"
      ? ""
      : formData.get("insured_company_url_blacklisted");

  const isUpdate = formData.get("isUpdate") == "true";
  let resData;

  /*********************************************************
   * -HARDSTOP RULES */
  const hardstopForOperationSecurity =
    has_malware_protection == "no" ||
    has_regular_backups == "no" ||
    has_software_patches == "no"
      ? true
      : false;

  if (hardstopForOperationSecurity) {
    return json({
      response: { hardstopForOperationSecurity },
    });
  }

  const hardstopForLossHistory =
    has_claim_issue == "yes" || has_loss_factors == "yes" ? true : false;

  if (hardstopForLossHistory) {
    return json({
      response: { hardstopForLossHistory },
    });
  }

  /********************************************************/

  //For No Optional Extensions Check
  if (confirm_no_optional_extensions_cover?.toLowerCase() == "false") {
    let isComputerCrime = false;
    let isSocialEnggFraud = false;
    if (has_computer_crime_cover?.toLowerCase() == "yes") {
      if (
        has_segregated_duties_expense?.toLowerCase() == "no" ||
        has_segregated_duties_fund_txns?.toLowerCase() == "no" ||
        has_segregated_duties_payments?.toLowerCase() == "no" ||
        has_auth_limits_1K?.toLowerCase() == "no"
      ) {
        isComputerCrime = true;
      }
    }

    if (has_social_engg_fraud_ext?.toLowerCase() == "yes") {
      if (
        has_verified_destination_bank?.toLowerCase() == "no" ||
        has_approved_vendors?.toLowerCase() == "no"
      ) {
        {
          isSocialEnggFraud = true;
        }
      }
    }

    if (isComputerCrime && isSocialEnggFraud) {
      return json({
        response: {
          noOptionalExtensionsCheck: true,
          isSocialEnggFraud: isSocialEnggFraud,
          isComputerCrime: isComputerCrime,
        },
      });
    } else if (isComputerCrime) {
      return json({
        response: {
          noOptionalExtensionsCheck: true,
          isComputerCrime: isComputerCrime,
          isSocialEnggFraud: false,
        },
      });
    } else if (isSocialEnggFraud) {
      return json({
        response: {
          noOptionalExtensionsCheck: true,
          isSocialEnggFraud: isSocialEnggFraud,
          isComputerCrime: false,
        },
      });
    }
  }

  // For DNS chck
  if (insured_company_url != "") {
    let insured_company_url_duplicate = insured_company_url;
    try {
      if (!/^https?:\/\//i.test(insured_company_url)) {
        insured_company_url_duplicate = "https://" + insured_company_url;
      }
      const url = new URL(insured_company_url_duplicate);
      await dnsLookup(url.hostname);
    } catch (error) {
      console.error(error);
      return {
        response: {
          status: {
            statusCode: 400,
            message: "Error",
            description: "Bad business URL",
          },
          data: {
            policies: [],
          },
        },
      };
    }
  }

  //For url blacklisting
  if (
    insured_company_url != "" &&
    confirm_basic_cover_blacklisted_url != "true"
  ) {
    const data = { insured_company_url: insured_company_url };
    resData = await urlBlacklistCheck(data);
    if (resData?.status?.message !== SUCCESS) {
      return json({ response: resData });
    }
  }

  let response;
  let lossHistoryData: any = {
    has_claim_issue,
    has_loss_factors,
    has_loss_factors_details,
  };
  if (has_loss_factors?.toLowerCase() == "no") {
    lossHistoryData = { ...lossHistoryData, has_loss_factors_details: "" };
  }

  sensitive_data = sensitive_data?.replace(/,/g, ";");

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

  const infoSecurityMeasuresData: any = {
    has_malware_protection,
    has_regular_backups,
    has_software_patches,
  };

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

  if (isUpdate) {
    const session = await getSession(request.headers.get("cookie"));
    if (!(await verifyAuthToken(session))) {
      return redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
    const responseData: any = formData.get("response");
    response = JSON.parse(responseData);
    response = {
      ...response,
      insured_company_url,
      confirm_basic_cover_blacklisted_url,
      confirm_basic_cover_nourl,
      insured_company_url_blacklisted,
    };

    let section = response?.sections?.find(
      (section: any) => section.section_code == LOSS_HISTORY
    );

    let section2 = response?.sections?.find(
      (section: any) => section.section_code == DATA_COMPLIANCE
    );

    let section3 = response?.sections?.find(
      (section: any) => section.section_code == INFO_SECURITY_MEASURES
    );

    let section4 = response?.sections?.find(
      (section: any) => section.section_code == OPTIONAL_EXTENSIONS
    );

    section?.section_details?.map((section: any) => {
      if (lossHistoryData[section?.section_detail_code] !== undefined || null) {
        section.attribute_value = lossHistoryData[section?.section_detail_code];
      }
    });

    section2?.section_details?.map((section: any) => {
      if (
        dataComplianceData[section?.section_detail_code] !== undefined ||
        null
      ) {
        section.attribute_value =
          dataComplianceData[section?.section_detail_code];
      }
    });

    section3?.section_details?.map((section: any) => {
      if (
        infoSecurityMeasuresData[section?.section_detail_code] !== undefined ||
        null
      ) {
        section.attribute_value =
          infoSecurityMeasuresData[section?.section_detail_code];
      }
    });

    section4?.section_details?.map((section: any) => {
      if (
        optionalExtensionsData[section?.section_detail_code] !== undefined ||
        null
      ) {
        section.attribute_value =
          optionalExtensionsData[section?.section_detail_code];
      }
    });

    //update policy
    resData = await updatePolicy(session, response);

    if (resData?.status?.message === SUCCESS) {
      const policy_id = resData?.data?.policies[0]?.policy_id;
      return redirect("/quote-processing?quoteId=" + policy_id, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
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
  } else {
    return redirect("/business-details-3?quoteId=new-quote");
  }
}
