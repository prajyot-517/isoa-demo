import { Fragment, useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import QuestionTooltip from "../common/QuestionTooltip";
import CloseIcon from "./Icons/CloseIcon";
import ComputerCrimeIcon from "./Icons/ComputerCrimeIcon";
import CyberGoIcon from "./Icons/CyberGoIcon";
import CyberPlusIcon from "./Icons/CyberPlusIcon";
import PencilIcon from "./Icons/PencilIcon";
import SecureIcon from "./Icons/SecureIcon";
import SocialEngineeringFraudIcon from "./Icons/SocialEngineeringFraudIcon";
import TickIcon from "./Icons/TickIcon";
import { useAppContext, useToast } from "~/context/ContextProvider";
import CheckBoxToogle from "../common/CheckBoxToggle";
import { formatAmount } from "~/utils";
import { BI_TIME_ACCESS_TOOLTIP } from "~/constants/string";
import Pill from "../common/Pill";
import PlanCard from "../PlanCard";

interface OptionalExtensionState {
  isEnabled: boolean | null;
  checked: boolean | null;
  section_detail_code: string;
}

interface ProductDetailsProps {
  policyId:any;
  quoteId:any;
  quoteOptions: any;
  handleQuoteOptionSelect: (option: any) => void;
  setOptionalExtensionForQuote1: (data: any) => void;
  setOptionalExtensionForQuote2: (data: any) => void;
  isOptionalExtensionForQuote1: OptionalExtensionState;
  isOptionalExtensionForQuote2: OptionalExtensionState;
  handleRecalculateButton: () => void;
  setQuoteDataForRecalculate: (data: any) => void;
  quoteDataForRecalculate: any;
  handleToggleOptionalExtension: (index: any, checked: any) => void;
  policyType: string;
  parentPolicy: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  policyId,
  quoteId,
  quoteOptions,
  handleQuoteOptionSelect,
  setOptionalExtensionForQuote1,
  setOptionalExtensionForQuote2,
  isOptionalExtensionForQuote1,
  isOptionalExtensionForQuote2,
  handleRecalculateButton,
  setQuoteDataForRecalculate,
  quoteDataForRecalculate,
  handleToggleOptionalExtension,
  policyType = "New",
  parentPolicy,
}: ProductDetailsProps) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalOptions, setEditModalOptions] = useState([]);

  const [product, setProduct] = useState("");
  const [quoteOptions1, setQuoteOptions1] = useState<any>({});
  const [quoteOptions2, setQuoteOptions2] = useState<any>({});
  const[plans,setPlans]=useState([]);

  const scrollRef = useRef(null);
  const tableRef = useRef(null);

  const { setStepState } = useAppContext();
  const { setToastProps } = useToast();

  const handleScrollToTable = (target: string) => {
    if (scrollRef.current) {
      const table = scrollRef.current.querySelector(`[data-table="${target}"]`);
      if (table) {
        table.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    }
  };

  useEffect(() => {
    const transformedPlans = quoteOptions.map((q, idx) => ({
      id: q.quote_option_id,
      name: q.plan_display_name,
      price: `$${q.total_payable.toFixed(2)}`,
      priceNote: "per month",
      bgColor:
        idx === 0 ? "bg-gray-50" : idx === 1 ? "bg-blue-50" : "bg-orange-50",
      borderColor:
        idx === 0
          ? "border-gray-200"
          : idx === 1
          ? "border-blue-200"
          : "border-orange-200",
      buttonColor: "bg-purple-800 hover:bg-purple-900",
      features: [
          { text: "Annual maximum", value: "Unlimited", visible: true },
          {
            text: "Per injury/sickness maximum",
            value: `$${q.standard_coverage}`,
            visible: true,
          },
          {
            text: "Annual deductible in-network",
            value: `$${q.standard_excess}`,
            visible: true,
          },
          {
            text: "Annual deductible out-of-network - $400",
            value: "",
            visible: false,
          },
          { text: "Copay Student Health Center - $15", value: "", visible: false },
          { text: "Copay primary care physician - $30", value: "", visible: false },
          { text: "Coinsurance in-network - 80%", value: "", visible: false },
          { text: "Immunization & preventive care - $200", value: "", visible: false },
          { text: "Medical evacuation - Unlimited", value: "", visible: false },
          { text: "Repatriation of remains - Unlimited", value: "", visible: false },
          { text: "Provider network - Aetna PPO", value: "", visible: false },
        ],
      quote_option_id_for_bind: q.quote_option_id,
      quote_id_for_bind: quoteId,
      policy_id: policyId
    }));

    setPlans(transformedPlans);
  }, []);

  // quoteOptions, quoteId, policyId

  useEffect(() => {
    handleScrollToTable(quoteOptions1?.plan_display_name);
  }, [quoteOptions]);

//   useEffect(() => {
//   if (quoteOptions1?.plan_display_name) {
//     handleScrollToTable(quoteOptions1.plan_display_name);
//   }
// }, [quoteOptions1?.plan_display_name]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    setQuoteOptions1(quoteOptions[0] ? quoteOptions[0] : {});
    setQuoteOptions2(quoteOptions[1] ? quoteOptions[1] : {});
  }, [quoteOptions]);

  useEffect(() => {
    setProduct(quoteOptions[0]?.plan_display_name);
  }, [quoteOptions]);

  let masterQuoteOptions: any[] = [];
  let optionalExtensionsCoverages: any = [];

  //For mapping of quote option coverages along with optional extensions
  if (
    Object.keys(quoteOptions1).length > 0 &&
    Object.keys(quoteOptions2).length > 0
  ) {
    quoteOptions1?.coverages?.forEach((quote1: any) =>
      quoteOptions2?.coverages?.forEach((quote2: any) => {
        if (quote1?.limit_name === quote2?.limit_name) {
          if (quote1?.limit_name?.includes("(Optional Extension)")) {
            optionalExtensionsCoverages?.push({
              limit_name: quote1?.limit_name,
              quote_option_id_1: quote1?.quote_option_id,
              quote_option_id_2: quote2?.quote_option_id,
              policy_limit_1_title: quote1?.coverage_title,
              policy_limit_1: quote1?.sublimit_value,
              excess_value_1_title: quote1?.excess_title,
              excess_value_1: quote1?.excess_value,
              policy_limit_2: quote2?.sublimit_value,
              policy_limit_2_title: quote2?.coverage_title,
              excess_value_2: quote2?.excess_value,
              excess_value_2_title: quote2?.excess_title,
              description_1: quote1?.description,
              description_2: quote2?.description,
              allowed_coverage_values_1: quote1?.allowed_coverage_values,
              allowed_coverage_values_2: quote2?.allowed_coverage_values,
              allowed_excess_values_1: quote1?.allowed_excess_values,
              allowed_excess_values_2: quote2?.allowed_excess_values,
              is_editable: quote1?.is_editable,
            });
          } else {
            masterQuoteOptions?.push({
              limit_name: quote1.limit_name,
              quote_option_id_1: quote1?.quote_option_id,
              quote_option_id_2: quote2?.quote_option_id,
              policy_limit_1_title: quote1.coverage_title,
              policy_limit_1: quote1?.sublimit_value,
              excess_value_1_title: quote1.excess_title,
              excess_value_1: quote1?.excess_value,
              policy_limit_2: quote2?.sublimit_value,
              policy_limit_2_title: quote2?.coverage_title,
              excess_value_2: quote2?.excess_value,
              excess_value_2_title: quote2?.excess_title,
              description_1: quote1?.description,
              description_2: quote2?.description,
              allowed_coverage_values_1: quote1?.allowed_coverage_values,
              allowed_coverage_values_2: quote2?.allowed_coverage_values,
              allowed_excess_values_1: quote1?.allowed_excess_values,
              allowed_excess_values_2: quote2?.allowed_excess_values,
            });
          }
        }
      })
    );
  } else {
    quoteOptions1?.coverages?.forEach((quote1: any) => {
      if (quote1?.limit_name?.includes("(Optional Extension)")) {
        optionalExtensionsCoverages?.push({
          limit_name: quote1?.limit_name,
          quote_option_id_1: quote1?.quote_option_id,
          is_editable: quote1?.is_editable,
          policy_limit_1_title: quote1?.coverage_title,
          policy_limit_1: quote1?.sublimit_value,
          excess_value_1_title: quote1?.excess_title,
          excess_value_1: quote1?.excess_value,
          description_1: quote1?.description,
          allowed_coverage_values_1: quote1?.allowed_coverage_values,
          allowed_excess_values_1: quote1?.allowed_excess_values,
        });
      } else {
        masterQuoteOptions?.push({
          limit_name: quote1.limit_name,
          quote_option_id_1: quote1?.quote_option_id,
          policy_limit_1_title: quote1.coverage_title,
          policy_limit_1: quote1?.sublimit_value,
          excess_value_1_title: quote1.excess_title,
          excess_value_1: quote1?.excess_value,
          description_1: quote1?.description,
          allowed_coverage_values_1: quote1?.allowed_coverage_values,
          allowed_excess_values_1: quote1?.allowed_excess_values,
        });
      }
    });
  }

  //For passing the quote option selected to parent
  useEffect(() => {
    if (optionalExtensionsCoverages?.length > 0) {
      setOptionalExtensionForQuote1((data: any) => {
        return {
          ...data,
          name: optionalExtensionsCoverages[0]?.limit_name,
        };
      });
      setOptionalExtensionForQuote2((data: any) => {
        return {
          ...data,
          name: optionalExtensionsCoverages[1]?.limit_name,
        };
      });
    }
  }, []);

  const handleEdit = (quoteOption: any) => {
    setOpenEditModal(true);
    setEditModalOptions(
      quoteOption?.allowed_coverage_values
        ? quoteOption?.allowed_coverage_values.split(";")
        : []
    );
    setQuoteDataForRecalculate((prevState: any) => ({
      ...prevState,
      quote: {
        ...prevState.quote,
        quote_options: [
          {
            ...prevState.quote.quote_options[0],
            standard_excess: quoteOption?.standard_excess,
            quote_option_id: quoteOption?.quote_option_id,
          },
        ],
      },
    }));
    document.body.classList.add("overflow-hidden");
  };

  const handleEditCancel = () => {
    setOpenEditModal(false);
    setEditModalOptions([]);
    setQuoteDataForRecalculate((prevState: any) => ({
      ...prevState,
      quote: {
        ...prevState.quote,
        quote_options: [
          {
            ...prevState.quote.quote_options[0],
            standard_coverage: 0,
            standard_excess: 0,
            quote_option_id: "",
          },
        ],
      },
    }));
    document.body.classList.remove("overflow-hidden");
  };

  const handleEditSave = () => {
    if (
      quoteDataForRecalculate?.quote?.quote_options[0]?.standard_coverage === 0
    ) {
      setToastProps({
        variant: "warning",
        message: "Coverage cannot be empty",
      });
    } else {
      handleRecalculateButton();
      setOpenEditModal(false);
      document.body.classList.remove("overflow-hidden");
    }
  };
  return (
    <>
      <div className="text-primaryBg">
        <div className=" bg-[#F5F5F5] py-7 md:px-14 px-6">
          <h1 className="font-bold text-[1.75rem]">Product Details</h1>
        </div>
        {/* <div className="px-14 pt-12 lg:pt-14">
          <div className="overflow-x-auto" ref={tableRef}>
            <table
              className="min-w-full leading-normal hidden md:block"
              style={{
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={`px-7 py-5 text-left ${
                      quoteOptions?.length > 1 ? "w-5/12" : "w-1/2"
                    }`}
                  >
                    <div className="flex flex-col space-y-5">
                      <div>
                        <SecureIcon />
                      </div>
                      {quoteOptions?.length > 1 ? (
                        <h1 className="font-black text-[2.5rem]">
                          Choose the option which best suits your business
                          needs.
                        </h1>
                      ) : (
                        <h1 className="font-black text-[2.5rem]">
                          The CyberGo option best suits your business needs.
                        </h1>
                      )}
                    </div>
                  </th>

                  {quoteOptions?.map((quoteOption: any, index: number) => (
                    <th
                      scope="col"
                      className={`p-7 border-t  border-[#D8D8D8]  ${
                        quoteOptions?.length === 1
                          ? "border-x rounded-tr-lg rounded-tl-lg"
                          : index === 0
                          ? "border-l rounded-tl-lg"
                          : "border-x rounded-tr-lg"
                      }`}
                      key={index}
                    >
                      <div className="flex flex-col items-center space-y-2 ">
                        <h2 className="font-black text-2xl">
                          {quoteOption?.plan_display_name}
                        </h2>
                        <div>
                          {index === 0 ? <CyberGoIcon /> : <CyberPlusIcon />}
                        </div>
                        <div className="flex flex-col space-y-4">
                          <div className="flex-flex-col space-y-1">
                            <p className="font-black text-primaryBg text-[1.25rem]">
                              Total cost
                            </p>
                            <p className="font-bold text-primaryBg text-[1.25rem]">
                              <span className="text-primaryBg font-black text-4xl">
                                {Number(quoteOption?.total_payable) >= 0
                                  ? `$${formatAmount(
                                      Number(
                                        quoteOption?.total_payable
                                      ).toFixed(2)
                                    )}`
                                  : `- $${formatAmount(
                                      -Number(
                                        quoteOption?.total_payable
                                      ).toFixed(2)
                                    )}`}
                              </span>{" "}
                              per year
                            </p>
                            <p>(Including GST)</p>
                          </div>
                          <div className="text-primaryBg">
                            <div className="flex items-center">
                              <p className="flex items-center text-nowrap">
                                Cover up to
                                <span className="font-extrabold text-lg mx-1">
                                  $
                                  {formatAmount(
                                    Number(quoteOption?.standard_coverage)
                                  )}
                                </span>
                              </p>
                              <p
                                className="text-primaryBg flex ml-1 space-x-1 items-center cursor-pointer"
                                onClick={() => handleEdit(quoteOption)}
                              >
                                <span>Edit</span> <PencilIcon />
                              </p>
                            </div>
                            <p>
                              Policy excess of{" "}
                              <span className="font-extrabold text-lg mx-1">
                                $
                                {formatAmount(
                                  Number(quoteOption?.standard_excess)
                                )}
                              </span>
                            </p>

                            {parentPolicy &&
                            parentPolicy?.cover_type?.toLowerCase() ===
                              "cybergo" &&
                            index === 0 ? (
                              <div className="flex justify-center mt-2">
                                <Pill
                                  variant="success"
                                  label="Current"
                                  icon={false}
                                />
                              </div>
                            ) : parentPolicy &&
                              parentPolicy?.cover_type?.toLowerCase() ===
                                "cyberplus" &&
                              index === 1 ? (
                              <div className="flex justify-center mt-2">
                                <Pill
                                  variant="success"
                                  label="Current"
                                  icon={false}
                                />
                              </div>
                            ) : (
                              parentPolicy && (
                                <div className="justify-center invisible mt-2">
                                  <Pill
                                    variant="success"
                                    label="Current"
                                    icon={false}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-primaryBg">
                {masterQuoteOptions?.map((coverage, index) => (
                  <tr key={index}>
                    <td
                      className={`px-6 sm:px-8 py-6 border-t border-l border-[#D8D8D8] ${
                        index === 0 ? "rounded-tl-lg" : ""
                      }`}
                    >
                      <div>
                        <div className="font-black">
                          {coverage?.limit_name}{" "}
                          <span className="align-middle">
                            <QuestionTooltip
                              tooltipContent={coverage?.description_1}
                              containerRef={tableRef}
                            />
                          </span>
                        </div>
                        <p>{coverage?.policy_limit_1_title}</p>
                        <div className="flex items-center gap-1">
                          {coverage?.excess_value_1_title}
                          {coverage?.limit_name?.toLowerCase() ===
                            "business interruption" && (
                            <QuestionTooltip
                              tooltipContent={BI_TIME_ACCESS_TOOLTIP}
                              containerRef={tableRef}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-8 py-6 text-center bg-white border-t border-l border-[#D8D8D8] ${
                        quoteOptions?.length === 1 ? "border-r" : ""
                      }`}
                    >
                      <div className="font-bold text-lg">
                        <p>
                          {Number(coverage?.policy_limit_1) === 0
                            ? "Not covered"
                            : `$${formatAmount(
                                Number(coverage?.policy_limit_1)
                              )}`}
                        </p>
                        <p>
                          {Number(coverage?.excess_value_1) === 0 ? (
                            "Not covered"
                          ) : (
                            <span>
                              {coverage?.limit_name?.toLowerCase() !==
                              "business interruption"
                                ? "$"
                                : ""}
                              {formatAmount(Number(coverage?.excess_value_1))}
                              {coverage?.limit_name?.toLowerCase() ===
                              "business interruption"
                                ? " hours"
                                : ""}
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    {quoteOptions?.length > 1 && (
                      <td className="px-8 py-6 text-center bg-white border-t border-x border-[#D8D8D8]">
                        <div className="font-bold text-lg">
                          <p>
                            {Number(coverage?.policy_limit_2) === 0
                              ? "Not covered"
                              : `$${formatAmount(
                                  Number(coverage?.policy_limit_2)
                                )}`}
                          </p>
                          <p>
                            {Number(coverage?.excess_value_2) === 0 ? (
                              "Not covered"
                            ) : (
                              <span>
                                {coverage?.limit_name?.toLowerCase() !==
                                "business interruption"
                                  ? "$"
                                  : ""}
                                {formatAmount(Number(coverage?.excess_value_2))}
                                {coverage?.limit_name?.toLowerCase() ===
                                "business interruption"
                                  ? " hours"
                                  : ""}
                              </span>
                            )}
                          </p>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                <tr className="bg-primaryBg text-white">
                  <td
                    colSpan={quoteOptions?.length > 1 ? 3 : 2}
                    className="px-5 py-6 border-t border-l border-[#D8D8D8] "
                  >
                    <h3 className="font-bold text-2xl">Optional Extensions</h3>
                  </td>
                </tr>
                {optionalExtensionsCoverages?.map(
                  (coverage: any, index: any) => (
                    <Fragment key={index}>
                      <tr className="bg-[#F5F5F5]">
                        <td
                          className={`pl-8 pr-[22px] pt-[14px] pb-[10px] border-l border-[#D8D8D8] ${
                            index === 0 ? "border-y" : "border-b"
                          }`}
                        >
                          <div className="flex flex-row items-center space-x-10 justify-between">
                            <div className="flex flex-row items-center space-x-3">
                              <div>
                                {coverage?.limit_name
                                  ?.toLowerCase()
                                  ?.includes("computer crime") ? (
                                  <ComputerCrimeIcon />
                                ) : (
                                  <SocialEngineeringFraudIcon />
                                )}
                              </div>
                              <div className="font-black">
                                {coverage?.limit_name}{" "}
                                <span className="align-middle">
                                  <QuestionTooltip
                                    tooltipContent={coverage?.description_1}
                                    containerRef={tableRef}
                                  />
                                </span>
                              </div>
                            </div>
                            {quoteOptions?.length > 1 &&
                              index === 0 &&
                              isOptionalExtensionForQuote1?.isEnabled && (
                                <CheckBoxToogle
                                  initialChecked={
                                    index === 0
                                      ? isOptionalExtensionForQuote1?.checked
                                      : isOptionalExtensionForQuote2?.checked
                                  }
                                  isEnabled={
                                    index === 0
                                      ? isOptionalExtensionForQuote1?.isEnabled
                                      : isOptionalExtensionForQuote2?.isEnabled
                                  }
                                  setValue={
                                    index === 0
                                      ? setOptionalExtensionForQuote1
                                      : setOptionalExtensionForQuote2
                                  }
                                  handleToggleOptionalExtension={
                                    handleToggleOptionalExtension
                                  }
                                  index={index}
                                />
                              )}
                            {quoteOptions?.length > 1 &&
                              index === 1 &&
                              isOptionalExtensionForQuote2?.isEnabled && (
                                <CheckBoxToogle
                                  initialChecked={
                                    index === 0
                                      ? isOptionalExtensionForQuote1?.checked
                                      : isOptionalExtensionForQuote2?.checked
                                  }
                                  isEnabled={
                                    index === 0
                                      ? isOptionalExtensionForQuote1?.isEnabled
                                      : isOptionalExtensionForQuote2?.isEnabled
                                  }
                                  setValue={
                                    index === 0
                                      ? setOptionalExtensionForQuote1
                                      : setOptionalExtensionForQuote2
                                  }
                                  handleToggleOptionalExtension={
                                    handleToggleOptionalExtension
                                  }
                                  index={index}
                                />
                              )}
                          </div>
                        </td>

                        <td
                          className={`pt-[14px] pb-[10px] text-center border-l border-[#D8D8D8] ${
                            quoteOptions?.length === 1 ? "border-r" : ""
                          } ${index === 0 ? "border-y" : "border-b"}`}
                        >
                          <div className="flex items-center justify-center space-x-3 ">
                            <CloseIcon />
                            <div className="font-bold flex items-center gap-1">
                              Unavailable
                              <QuestionTooltip
                                tooltipContent={
                                  "This cover is not available with CyberGo."
                                }
                                containerRef={tableRef}
                              />
                            </div>
                          </div>
                        </td>
                        {quoteOptions?.length > 1 && (
                          <td className="pt-[14px] pb-[10px] text-center border-b border-x border-[#D8D8D8]">
                            <div className="flex items-center justify-center space-x-3 ">
                              {(coverage?.policy_limit_2 !== 0 &&
                                coverage?.policy_limit_2 !== undefined &&
                                coverage?.policy_limit_2 !== null) ||
                              (coverage?.excess_value_2 !== 0 &&
                                coverage?.excess_value_2 !== undefined &&
                                coverage?.excess_value_2 !== null) ? (
                                <TickIcon />
                              ) : (
                                <CloseIcon />
                              )}
                              <p className="font-bold">
                                {(coverage?.policy_limit_2 !== 0 &&
                                  coverage?.policy_limit_2 !== undefined &&
                                  coverage?.policy_limit_2 !== null) ||
                                (coverage?.excess_value_2 !== 0 &&
                                  coverage?.excess_value_2 !== undefined &&
                                  coverage?.excess_value_2 !== null)
                                  ? "Covered"
                                  : "Not covered"}
                              </p>
                            </div>
                          </td>
                        )}
                      </tr>

                      <tr>
                        <td
                          className={`pl-8 pr-[22px] pt-[14px] pb-[10px] ${
                            index + 1 === optionalExtensionsCoverages?.length
                              ? "border-b rounded-bl-lg"
                              : "border-b"
                          } border-l border-[#D8D8D8] `}
                        >
                          <div>
                            <p>{coverage?.policy_limit_1_title}</p>
                            <p>{coverage?.excess_value_1_title}</p>
                          </div>
                        </td>
                        <td
                          className={`pt-[14px] pb-[10px] text-center border-b border-l border-[#D8D8D8] ${
                            quoteOptions?.length === 1 ? "border-r" : ""
                          }`}
                        >
                          <div className="font-bold text-lg">
                            <p>
                              {Number(coverage?.policy_limit_1) === 0
                                ? "-"
                                : `$${formatAmount(
                                    Number(coverage?.policy_limit_1)
                                  )}`}
                            </p>
                            <p>
                              {Number(coverage?.excess_value_1) === 0
                                ? "-"
                                : `$${formatAmount(
                                    Number(coverage?.excess_value_1)
                                  )}`}
                            </p>
                          </div>
                        </td>
                        {quoteOptions?.length > 1 && (
                          <td className="pt-[14px] pb-[10px] text-center border-b border-x border-[#D8D8D8]">
                            <div className="font-bold text-lg">
                              <p>
                                {Number(coverage?.policy_limit_2) === 0
                                  ? "-"
                                  : `$${formatAmount(
                                      Number(coverage?.policy_limit_2)
                                    )}`}
                              </p>
                              <p>
                                {Number(coverage?.excess_value_2) === 0
                                  ? "-"
                                  : `$${formatAmount(
                                      Number(coverage?.excess_value_2)
                                    )}`}
                              </p>
                            </div>
                          </td>
                        )}
                      </tr>
                    </Fragment>
                  )
                )}
                <tr>
                  <td className="px-8 py-6 border-[#D8D8D8] "></td>
                  <td
                    className={`px-[3.25rem] py-8 text-center border-b border-l border-[#D8D8D8] rounded-bl-lg ${
                      quoteOptions?.length === 1 ? "border-r rounded-br-lg" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-5">
                      <div>
                        <p className="font-bold text-lg">
                          {Number(quoteOptions1?.total_payable) >= 0
                            ? `$${formatAmount(
                                Number(quoteOptions1?.total_payable).toFixed(2)
                              )}`
                            : `- $${formatAmount(
                                -Number(quoteOptions1?.total_payable).toFixed(2)
                              )}`}{" "}
                          per year
                        </p>
                        <p className="text-primaryBg">(Including GST)</p>
                      </div>
                      <div className="w-[13.25rem]">
                        <Button
                          onClick={() => {
                            handleQuoteOptionSelect(quoteOptions1);
                            setStepState((prevState) => ({
                              ...prevState,
                              currentStep: 3,
                              subStep: 1,
                            }));
                          }}
                          label="Select"
                          variant="filled"
                          disabled={
                            policyType?.toLowerCase() === "cancellation" ||
                            quoteOptions?.length === 0
                          }
                          showTooltip={false}
                          tooltipContent=""
                          id="quote_option_1_select_btn"
                        />
                      </div>
                    </div>
                  </td>
                  {quoteOptions?.length > 1 && (
                    <td className="px-[3.25rem] py-8 text-center border-b border-x border-[#D8D8D8] rounded-br-lg">
                      <div className="flex flex-col items-center space-y-5">
                        <div>
                          <p className="font-bold text-lg">
                            {Number(quoteOptions2?.total_payable) >= 0
                              ? `$${formatAmount(
                                  Number(quoteOptions2?.total_payable).toFixed(
                                    2
                                  )
                                )}`
                              : `- $${formatAmount(
                                  -Number(quoteOptions2?.total_payable).toFixed(
                                    2
                                  )
                                )}`}{" "}
                            per year
                          </p>
                          <p className="text-primaryBg">(Including GST)</p>
                        </div>
                        <div className="w-[13.25rem]">
                          <Button
                            onClick={() => {
                              handleQuoteOptionSelect(quoteOptions2);
                              setStepState((prevState) => ({
                                ...prevState,
                                currentStep: 3,
                                subStep: 1,
                              }));
                            }}
                            label="Select"
                            variant="filled"
                            disabled={
                              policyType?.toLowerCase() === "cancellation" ||
                              quoteOptions?.length === 0
                            }
                            showTooltip={false}
                            tooltipContent=""
                            id="quote_option_2_select_btn"
                          />
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}

        {/* -------------------------------------------Table view from 360px to 1154px-------------------------------------------------- */}
        {/* <div className="flex flex-col space-y-12 px-5 sm:px-9 md:hidden">
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-4">
              <div>
                <SecureIcon />
              </div>
              {quoteOptions?.length > 1 ? (
                <h1 className="font-black text-3xl sm:text-[2.5rem]">
                  Choose the option which best suits your business needs.
                </h1>
              ) : (
                <h1 className="font-black text-3xl text-[2.5rem]">
                  The CyberGo option best suits your business needs.
                </h1>
              )}
            </div>

            {quoteOptions?.length > 1 && (
              <div className="flex justify-center font-bold items-center bg-white border-2 border-primaryBg rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setProduct(quoteOptions1?.plan_display_name);
                    handleScrollToTable(quoteOptions1?.plan_display_name);
                  }}
                  className={`w-1/2 py-2 rounded-l-3xl border-r-2 border-primaryBg ${
                    product === quoteOptions1?.plan_display_name
                      ? "bg-primaryBg text-white"
                      : "text-primaryBg"
                  }`}
                >
                  {quoteOptions1?.plan_display_name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProduct(quoteOptions2?.plan_display_name);
                    handleScrollToTable(quoteOptions2?.plan_display_name);
                  }}
                  className={`w-1/2 py-2 rounded-r-3xl  ${
                    product === quoteOptions2?.plan_display_name
                      ? "bg-primaryBg text-white"
                      : "text-primaryBg"
                  }`}
                >
                  {quoteOptions2?.plan_display_name}
                </button>
              </div>
            )}
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-hidden flex flex-row space-x-5 scrollbar-hide"
          >
            <table
              className={`min-w-full leading-normal ${
                quoteOptions?.length > 1 ? "sm:min-w-[80%]" : ""
              } transition-opacity duration-500 ${
                quoteOptions?.length > 1
                  ? product === quoteOptions1?.plan_display_name
                    ? "opacity-100"
                    : "opacity-40"
                  : ""
              }`}
              style={{
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
              data-table={quoteOptions1?.plan_display_name}
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="p-6 sm:p-7 border-t border-x border-[#D8D8D8] rounded-tl-lg rounded-tr-lg"
                  >
                    <div className="flex flex-col items-center space-y-2 ">
                      <h2 className="font-black text-xl sm:text-2xl">
                        {quoteOptions1?.plan_display_name}
                      </h2>
                      <CyberGoIcon />
                      <div className="flex flex-col space-y-4">
                        <div className="flex-flex-col space-y-1">
                          <p className="font-black text-primaryBg text-[1.125rem] sm:text-[1.25rem]">
                            Total cost
                          </p>
                          <p className="font-bold text-primaryBg text-[1.125rem] sm:text-[1.25rem]">
                            <span className="text-primaryBg font-black text-3xl sm:text-4xl">
                              {Number(quoteOptions1?.total_payable) >= 0
                                ? `$${formatAmount(
                                    Number(
                                      quoteOptions1?.total_payable
                                    ).toFixed(2)
                                  )}`
                                : `- $${formatAmount(
                                    -Number(
                                      quoteOptions1?.total_payable
                                    ).toFixed(2)
                                  )}`}
                            </span>{" "}
                            per year
                          </p>
                          <p className="text-sm sm:text-base">
                            (Including GST)
                          </p>
                        </div>
                        <div className="text-primaryBg text-sm sm:text-base">
                          <div className="flex items-center">
                            <p className="flex items-center">
                              Cover up to
                              <span className="font-extrabold text-lg mx-1">
                                $
                                {formatAmount(
                                  Number(quoteOptions1?.standard_coverage)
                                )}
                              </span>
                            </p>
                            <p
                              className="text-primaryBg flex ml-1 space-x-1 items-center cursor-pointer"
                              onClick={() => handleEdit(quoteOptions1)}
                            >
                              <span>Edit</span> <PencilIcon />
                            </p>
                          </div>
                          <p>
                            Policy excess of{" "}
                            <span className="font-extrabold text-lg mx-1">
                              $
                              {formatAmount(
                                Number(quoteOptions1?.standard_excess)
                              )}
                            </span>
                          </p>

                          {parentPolicy &&
                          parentPolicy?.cover_type?.toLowerCase() ===
                            "cybergo" ? (
                            <div className="flex justify-center mt-2">
                              <Pill
                                variant="success"
                                label="Current"
                                icon={false}
                              />
                            </div>
                          ) : (
                            parentPolicy && (
                              <div className="justify-center invisible mt-2">
                                <Pill
                                  variant="success"
                                  label="Current"
                                  icon={false}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="text-primaryBg text-xs sm:text-base">
                {masterQuoteOptions?.map((coverage, index) => (
                  <tr key={index}>
                    <td className="px-6 py-5 sm:py-6 border-t border-x border-[#D8D8D8] sm:px-8">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-black">
                            {coverage?.limit_name}{" "}
                            <span className="align-middle">
                              <QuestionTooltip
                                tooltipContent={coverage?.description_1}
                                containerRef={scrollRef}
                              />
                            </span>
                          </div>
                          <p>{coverage?.policy_limit_1_title}</p>
                          <div className="flex items-center gap-1">
                            {coverage?.excess_value_1_title}
                            {coverage?.limit_name?.toLowerCase() ===
                              "business interruption" && (
                              <QuestionTooltip
                                tooltipContent={BI_TIME_ACCESS_TOOLTIP}
                                containerRef={scrollRef}
                              />
                            )}
                          </div>
                        </div>
                        <div className="font-bold text-[0.85rem] sm:text-lg">
                          <p>
                            {Number(coverage?.policy_limit_1) === 0
                              ? "-"
                              : `$${formatAmount(
                                  Number(coverage?.policy_limit_1)
                                )}`}
                          </p>
                          <p>
                            {Number(coverage?.excess_value_1) === 0 ? (
                              "-"
                            ) : (
                              <span>
                                {coverage?.limit_name?.toLowerCase() !==
                                "business interruption"
                                  ? "$"
                                  : ""}
                                {formatAmount(Number(coverage?.excess_value_1))}
                                {coverage?.limit_name?.toLowerCase() ===
                                "business interruption"
                                  ? " hours"
                                  : ""}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-primaryBg text-white">
                  <td className="px-5 py-6  border-t border-x border-[#D8D8D8] ">
                    <h3 className="font-bold text-[1.125rem] sm:text-2xl">
                      Optional Extensions
                    </h3>
                  </td>
                </tr>
                {optionalExtensionsCoverages?.map(
                  (coverage: any, index: any) => (
                    <Fragment key={index}>
                      <tr className="bg-[#F5F5F5]">
                        <td className="px-6 py-5 sm:pl-8 sm:pr-[22px] sm:pt-[14px] sm:pb-[10px] border-t border-x border-[#D8D8D8] ">
                          <div className="flex flex-row items-center space-x-4 sm:space-x-10 justify-between">
                            <div className="flex flex-row items-center space-x-3">
                              <ComputerCrimeIcon />
                              <div className="font-black">
                                {coverage?.limit_name}{" "}
                                <span className="align-middle">
                                  <QuestionTooltip
                                    tooltipContent={coverage?.description_1}
                                    containerRef={scrollRef}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="pl-8 pr-[22px] py-5 sm:py-0 sm:pt-[14px] sm:pb-[10px] border-t border-x border-[#D8D8D8] ">
                          <div className="flex justify-between items-center">
                            <div>
                              <p>{coverage?.policy_limit_1_title}</p>
                              <p>{coverage?.excess_value_1_title}</p>
                            </div>
                            <div className="font-bold text-[0.85rem] sm:text-lg">
                              <p>
                                {Number(coverage?.policy_limit_1) === 0
                                  ? "-"
                                  : `$${formatAmount(
                                      Number(coverage?.policy_limit_1)
                                    )}`}
                              </p>
                              <p>
                                {Number(coverage?.excess_value_1) === 0
                                  ? "-"
                                  : `$${formatAmount(
                                      Number(coverage?.excess_value_1)
                                    )}`}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  )
                )}
                <tr>
                  <td className="px-[2.5rem] py-5 sm:px-[3.25rem] sm:py-8 text-center border-y border-x border-[#D8D8D8] rounded-bl-lg rounded-br-lg">
                    <div className="flex flex-col items-center space-y-4 sm:space-y-5">
                      <div>
                        <p className="font-bold text-lg">
                          {Number(quoteOptions1?.total_payable) >= 0
                            ? `$${formatAmount(
                                Number(quoteOptions1?.total_payable).toFixed(2)
                              )}`
                            : `- $${formatAmount(
                                -Number(quoteOptions1?.total_payable).toFixed(2)
                              )}`}
                          per year
                        </p>
                        <p className="text-primaryBg">(Including GST)</p>
                      </div>
                      <div className="w-[13.25rem]">
                        <Button
                          onClick={() => {
                            handleQuoteOptionSelect(quoteOptions1);
                            setStepState((prevState) => ({
                              ...prevState,
                              currentStep: 3,
                              subStep: 1,
                            }));
                          }}
                          label="Select"
                          variant="filled"
                          disabled={
                            policyType?.toLowerCase() === "cancellation" ||
                            quoteOptions?.length === 0
                          }
                          showTooltip={false}
                          tooltipContent=""
                          id="quote_option_1_select_btn"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {quoteOptions?.length > 1 && (
              <table
                className={`min-w-full leading-normal sm:min-w-[80%] transition-opacity duration-500 ${
                  product === quoteOptions2?.plan_display_name
                    ? "opacity-100"
                    : "opacity-40"
                }`}
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0",
                }}
                data-table={quoteOptions2?.plan_display_name}
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="p-6 sm:p-7 border-t border-x border-[#D8D8D8] rounded-tl-lg rounded-tr-lg"
                    >
                      <div className="flex flex-col items-center space-y-2 ">
                        <h2 className="font-black text-xl sm:text-2xl">
                          {quoteOptions2?.plan_display_name}
                        </h2>
                        <CyberPlusIcon />
                        <div className="flex flex-col space-y-4">
                          <div className="flex-flex-col space-y-1">
                            <p className="font-black text-primaryBg text-[1.125rem] sm:text-[1.25rem]">
                              Total cost
                            </p>
                            <p className="font-bold text-primaryBg text-[1.125rem] sm:text-[1.25rem]">
                              <span className="text-primaryBg font-black text-3xl sm:text-4xl">
                                {Number(quoteOptions2?.total_payable) >= 0
                                  ? `$${formatAmount(
                                      Number(
                                        quoteOptions2?.total_payable
                                      ).toFixed(2)
                                    )}`
                                  : `- $${formatAmount(
                                      -Number(
                                        quoteOptions2?.total_payable
                                      ).toFixed(2)
                                    )}`}
                              </span>{" "}
                              per year
                            </p>
                            <p className="text-sm sm:text-base">
                              (Including GST)
                            </p>
                          </div>
                          <div className="text-primaryBg text-sm sm:text-base">
                            <div className="flex items-center">
                              <p className="flex items-center">
                                Cover up to
                                <span className="font-extrabold text-lg mx-1">
                                  $
                                  {formatAmount(
                                    Number(quoteOptions2?.standard_coverage)
                                  )}
                                </span>
                              </p>
                              <p
                                className="text-primaryBg flex ml-1 space-x-1 items-center cursor-pointer"
                                onClick={() => handleEdit(quoteOptions2)}
                              >
                                <span>Edit</span> <PencilIcon />
                              </p>
                            </div>
                            <p>
                              Policy excess of{" "}
                              <span className="font-extrabold text-lg mx-1">
                                $
                                {formatAmount(
                                  Number(quoteOptions2?.standard_excess)
                                )}
                              </span>
                            </p>

                            {parentPolicy &&
                            parentPolicy?.cover_type?.toLowerCase() ===
                              "cyberplus" ? (
                              <div className="flex justify-center mt-2">
                                <Pill
                                  variant="success"
                                  label="Current"
                                  icon={false}
                                />
                              </div>
                            ) : (
                              parentPolicy && (
                                <div className="justify-center invisible mt-2">
                                  <Pill
                                    variant="success"
                                    label="Current"
                                    icon={false}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-primaryBg text-xs sm:text-base">
                  {masterQuoteOptions?.map((coverage, index) => (
                    <tr key={index}>
                      <td
                        className={`px-6 py-5 sm:py-6 border-t border-x border-[#D8D8D8] sm:px-8`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-black">
                              {coverage?.limit_name}{" "}
                              <span className="align-middle">
                                <QuestionTooltip
                                  tooltipContent={coverage?.description_1}
                                  containerRef={scrollRef}
                                />
                              </span>
                            </div>
                            <p>{coverage?.policy_limit_1_title}</p>
                            <div className="flex items-center gap-1">
                              {coverage?.excess_value_1_title}
                              {coverage?.limit_name?.toLowerCase() ===
                                "business interruption" && (
                                <QuestionTooltip
                                  tooltipContent={BI_TIME_ACCESS_TOOLTIP}
                                  containerRef={scrollRef}
                                />
                              )}
                            </div>
                          </div>
                          <div className="font-bold text-[0.85rem] sm:text-lg">
                            <p>
                              {Number(coverage?.policy_limit_2) === 0
                                ? "-"
                                : `$${formatAmount(
                                    Number(coverage?.policy_limit_2)
                                  )}`}
                            </p>
                            <p>
                              {Number(coverage?.excess_value_2) === 0 ? (
                                "-"
                              ) : (
                                <span>
                                  {coverage?.limit_name?.toLowerCase() !==
                                  "business interruption"
                                    ? "$"
                                    : ""}
                                  {formatAmount(
                                    Number(coverage?.excess_value_2)
                                  )}
                                  {coverage?.limit_name?.toLowerCase() ===
                                  "business interruption"
                                    ? " hours"
                                    : ""}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primaryBg text-white">
                    <td className="px-5 py-6  border-t border-x border-[#D8D8D8] ">
                      <h3 className="font-bold text-[1.125rem] sm:text-2xl">
                        Optional Extensions
                      </h3>
                    </td>
                  </tr>
                  {optionalExtensionsCoverages?.map(
                    (coverage: any, index: any) => (
                      <Fragment key={index}>
                        <tr className="bg-[#F5F5F5]">
                          <td className="px-6 py-5 sm:pl-8 sm:pr-[22px] sm:pt-[14px] sm:pb-[10px] border-t border-x border-[#D8D8D8] ">
                            <div className="flex flex-row items-center space-x-4 sm:space-x-10 justify-between">
                              <div className="flex flex-row items-center space-x-3">
                                <ComputerCrimeIcon />
                                <div className="font-black">
                                  {coverage?.limit_name}{" "}
                                  <span className="align-middle">
                                    <QuestionTooltip
                                      tooltipContent={coverage?.description_1}
                                      containerRef={scrollRef}
                                    />
                                  </span>
                                </div>
                              </div>

                              {index === 0 &&
                                isOptionalExtensionForQuote1?.isEnabled && (
                                  <CheckBoxToogle
                                    initialChecked={
                                      index === 0
                                        ? isOptionalExtensionForQuote1?.checked
                                        : isOptionalExtensionForQuote2?.checked
                                    }
                                    isEnabled={
                                      index === 0
                                        ? isOptionalExtensionForQuote1?.isEnabled
                                        : isOptionalExtensionForQuote2?.isEnabled
                                    }
                                    setValue={
                                      index === 0
                                        ? setOptionalExtensionForQuote1
                                        : setOptionalExtensionForQuote2
                                    }
                                    handleToggleOptionalExtension={
                                      handleToggleOptionalExtension
                                    }
                                    index={index}
                                  />
                                )}
                              {index === 1 &&
                                isOptionalExtensionForQuote2?.isEnabled && (
                                  <CheckBoxToogle
                                    initialChecked={
                                      index === 0
                                        ? isOptionalExtensionForQuote1?.checked
                                        : isOptionalExtensionForQuote2?.checked
                                    }
                                    isEnabled={
                                      index === 0
                                        ? isOptionalExtensionForQuote1?.isEnabled
                                        : isOptionalExtensionForQuote2?.isEnabled
                                    }
                                    setValue={
                                      index === 0
                                        ? setOptionalExtensionForQuote1
                                        : setOptionalExtensionForQuote2
                                    }
                                    handleToggleOptionalExtension={
                                      handleToggleOptionalExtension
                                    }
                                    index={index}
                                  />
                                )}
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <td className="pl-8 pr-[22px] py-5 sm:py-0 sm:pt-[14px] sm:pb-[10px] border-t border-x border-[#D8D8D8] ">
                            <div className="flex justify-between items-center">
                              <div>
                                <p>{coverage?.policy_limit_1_title}</p>
                                <p>{coverage?.excess_value_1_title}</p>
                              </div>
                              <div className="font-bold text-[0.85rem] sm:text-lg">
                                <p>
                                  {Number(coverage?.policy_limit_2) === 0
                                    ? "-"
                                    : `$${formatAmount(
                                        Number(coverage?.policy_limit_2)
                                      )}`}
                                </p>
                                <p>
                                  {Number(coverage?.excess_value_2) === 0
                                    ? "-"
                                    : `$${formatAmount(
                                        Number(coverage?.excess_value_2)
                                      )}`}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    )
                  )}
                  <tr>
                    <td className="px-[2.5rem] py-5 sm:px-[3.25rem] sm:py-8 text-center border-y border-x border-[#D8D8D8] rounded-bl-lg rounded-br-lg">
                      <div className="flex flex-col items-center space-y-4 sm:space-y-5">
                        <div>
                          <p className="font-bold text-lg">
                            {Number(quoteOptions2?.total_payable) >= 0
                              ? `$${formatAmount(
                                  Number(quoteOptions2?.total_payable).toFixed(
                                    2
                                  )
                                )}`
                              : `- $${formatAmount(
                                  -Number(quoteOptions2?.total_payable).toFixed(
                                    2
                                  )
                                )}`}{" "}
                            per year
                          </p>
                          <p className="text-primaryBg">(Including GST)</p>
                        </div>
                        <div className="w-[13.25rem]">
                          <Button
                            onClick={() => {
                              handleQuoteOptionSelect(quoteOptions2);
                              setStepState((prevState) => ({
                                ...prevState,
                                currentStep: 3,
                                subStep: 1,
                              }));
                            }}
                            label="Select"
                            variant="filled"
                            disabled={
                              policyType?.toLowerCase() === "cancellation" ||
                              quoteOptions?.length === 0
                            }
                            showTooltip={false}
                            tooltipContent=""
                            id="quote_option_2_select_btn"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div> */}

        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {plans?.map((plan) => (
                <PlanCard key={plan.id}plan={plan} />
              ))}
            </div>
          </div>
        </div>

      </div>

      {openEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-[#FAEFFC] md:w-[509px] flex flex-col space-y-8 rounded shadow-md text-primaryBg p-6 md:p-8">
            <div className="flex flex-col space-y-6">
              <h2 className="text-[1.25rem] font-bold">Edit cover up to</h2>
              <select
                className="block w-full border rounded-md shadow-sm h-11 px-2 outline-none"
                value={quoteDataForRecalculate?.standard_coverage}
                defaultValue=""
                onChange={(e) => {
                  setQuoteDataForRecalculate((prevState: any) => ({
                    ...prevState,
                    quote: {
                      ...prevState.quote,
                      quote_options: [
                        {
                          ...prevState.quote.quote_options[0],
                          standard_coverage: e.target.value,
                        },
                      ],
                    },
                  }));
                }}
              >
                <option value="" disabled>
                  Select cover up
                </option>
                {editModalOptions?.map((option, index) => (
                  <option value={option} key={index}>
                    ${formatAmount(option)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4 md:space-x-6">
              <div className="w-[6.675rem]">
                <Button
                  onClick={() => handleEditCancel()}
                  label="Cancel"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
              <div className="w-[6.675rem]">
                <Button
                  onClick={() => handleEditSave()}
                  label="Save"
                  variant="filled"
                  disabled={
                    quoteDataForRecalculate?.quote?.quote_options[0]
                      ?.standard_coverage === 0
                  }
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
