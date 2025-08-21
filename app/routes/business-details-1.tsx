import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import WarningIcon from "~/assets/SVGIcons/WarningIcon";
import BusinessDetailsStep1Form from "~/components/BusinessDetailsForms/BusinessDetailsStep1Form";
import Button from "~/components/common/Button";
import InformationCard from "~/components/common/InformationCard";
import Modal from "~/components/common/Modal";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import {
  INFO_SECURITY_MEASURES,
  QUOTED,
  RENEWAL,
  REVENUE_DETAILS,
  SUCCESS,
} from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  getOccupationsList,
  getPolicyById,
  updatePolicy,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { formatAmount, removeCommas } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  let response: any;

  session.unset("isExistingUser");

  if (quoteId !== "new-quote") {
    // if (!(await verifyAuthToken(session))) {
    //   return redirect("/login", {
    //     headers: {
    //       "Set-Cookie": await destroySession(session),
    //     },
    //   });
    // }
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

    return json(response, {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

export default function BusinessDetailsStep1() {
  const { stepState, setStepState, businessDetails, setBusinessDetails } =
    useAppContext();
  const { setToastProps } = useToast();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [isOccupationLoading, setIsOccupationLoading] = useState(false);
  const [matchedIndustryList, setMatchedIndustryList] = useState<any>([]);
  const [industryInput, setIndustryInput] = useState<any>({});
  const response = useLoaderData<typeof loader>();
  const [isHardStopForIndustryCode, setHardStopForIndustryCode] =
    useState(false);
  const [isHardStopForAnnualRevenue, setHardStopForAnnualRevenue] =
    useState(false);
  const [
    isHardStopFor50PCTOverseasRevenue,
    setHardStopFor50PCTOverseasRevenue,
  ] = useState(false);
  const submit = useSubmit();
  const actionData: any = useActionData();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");

  //If fields already exist in backend
  useEffect(() => {
    if (response && !response.newQuote && response.data) {
      const data = response.data.policies[0];

      const insuredRevenue = data?.sections.find(
        (section: any) => section.section_code == REVENUE_DETAILS
      );

      const infoSecurity = data?.sections.find(
        (section: any) => section.section_code == INFO_SECURITY_MEASURES
      );

      

      const newBusinessDetails = {
        
        visa_status: data?.visa_status || "",

        school: data?.school || "",

        age: data?.age || "",

        num_employees:
          infoSecurity?.section_details.find(
            (detail: any) => detail.section_detail_code == "num_employees"
          )?.attribute_value || "",

        total_annual_revenue:
          formatAmount(
            insuredRevenue?.section_details.find(
              (detail: any) =>
                detail.section_detail_code == "total_annual_revenue"
            )?.attribute_value
          ) || "",

        has_online_revenue:
          insuredRevenue?.section_details.find(
            (detail: any) => detail.section_detail_code == "has_online_revenue"
          )?.attribute_value || "no",

        total_revenue_online:
          formatAmount(
            insuredRevenue?.section_details.find(
              (detail: any) =>
                detail.section_detail_code == "total_revenue_online"
            )?.attribute_value
          ) || "",

        has_50PCT_overseas_revenue:
          insuredRevenue?.section_details.find(
            (detail: any) =>
              detail.section_detail_code == "has_50PCT_overseas_revenue"
          )?.attribute_value || "",
      };
      setBusinessDetails(newBusinessDetails);

      // Check if the new data is different from the current state
      if (
        JSON.stringify(newBusinessDetails) !== JSON.stringify(businessDetails)
      ) {
        setBusinessDetails(newBusinessDetails);
      }
    }
  }, []);

  //If any one field is missing then disable the next button
  useEffect(() => {
    // if (
    // (Object?.keys(businessDetails?.insured_industry)?.length > 0 ||
    //   businessDetails?.insured_industry != "") &&
    // businessDetails?.insured_industry?.length > 0 &&
    // businessDetails?.industry_name?.length > 0 &&
    // businessDetails?.num_employees?.length > 0 &&
    // businessDetails?.total_annual_revenue?.length > 0 &&
    // parseFloat(removeCommas(businessDetails?.total_annual_revenue)) != 0 &&
    // (businessDetails?.total_revenue_online?.length === 0 ||
    //   parseFloat(removeCommas(businessDetails?.total_revenue_online)) != 0) &&
    // businessDetails?.has_50PCT_overseas_revenue?.length > 0
    //   (businessDetails?.has_50PCT_overseas_revenue == "no" &&
    //   businessDetails?.description?.length > 0)
    // ) {
    //   setNextButtonDisabled(false);
    // } else {
    //   setNextButtonDisabled(true);
    // }
    // setNextButtonDisabled(
    //   !(
    //     businessDetails?.visa_status?.length > 0 &&
    //     businessDetails?.school?.length > 0 &&
    //     businessDetails?.age?.length > 0 &&
    //     (businessDetails?.has_50PCT_overseas_revenue === "no"
    //       ? businessDetails?.description?.length > 0
    //       : true)
    //   )
    // );
    const isValid =
    businessDetails?.visa_status?.length > 0 &&
    businessDetails?.school?.length > 0 &&
    businessDetails?.age?.length > 0 &&
    businessDetails?.waive_out?.length > 0 &&
    (businessDetails?.waive_out !== "no" ||
      businessDetails?.description?.length > 0);
 
  setNextButtonDisabled(!isValid);
  }, [businessDetails]);

  useEffect(() => {
    setIsOccupationLoading(false);

    //For hardstop of total annual revenue
    // if (actionData?.response?.hardstopForAnnualRevenue) {
    //   setHardStopForAnnualRevenue(true);
    // }

    //For hardstop of 50% overseas revenue
    // if (actionData?.response?.hardstopFor50PCTOverseas) {
    //   setHardStopFor50PCTOverseasRevenue(true);
    // }

    if (
      actionData?.response?.status == 200 &&
      actionData?.response?.calledOccupationSearchApi
    ) {
      setMatchedIndustryList(actionData?.response?.data?.results);
    }

    //For backend errors
    if (
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
    }

    //For backend errors
    if (response?.status?.statusCode !== 200 && response?.status?.description) {
      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ||
            response?.status?.description),
        variant: "error",
      });
    }
  }, [actionData, response]);

  //To check if the quote is in quoted stage
  useEffect(() => {
    if (response?.data?.policies?.length > 0) {
      const policyStage = response?.data?.policies[0]?.policy_stage;
      if (policyStage?.toLowerCase() == QUOTED) {
        navigate("/quote?quoteId=" + quoteId);
      }
    }
  }, [response]);

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

  const handleChange = (e: any, type: string) => {
    const { name, value } = e?.target;
    if (type === "number") {
      const formattedValue = value?.replace(/\D/g, "");
      //For has online revenue
      if (name?.includes("total_revenue_online")) {
        if (
          formattedValue !== "" &&
          formattedValue !== 0 &&
          formattedValue !== "0"
        ) {
          setBusinessDetails((data: any) => {
            return {
              ...data,
              [name]: formatAmount(formattedValue),
              has_online_revenue: "yes",
            };
          });
        } else {
          setBusinessDetails((data: any) => {
            return {
              ...data,
              [name]: formatAmount(formattedValue),
              has_online_revenue: "no",
            };
          });
        }
      } else if (name?.includes("total_annual_revenue")) {
        setBusinessDetails((data: any) => {
          return {
            ...data,
            [name]: formatAmount(formattedValue),
          };
        });
      } else 
        if (name?.includes("num_employees")) {
        let numOfEmployees = removeCommas(formattedValue);
        if (numOfEmployees.length > 6) {
          setBusinessDetails((data: any) => {
            return {
              ...data,
              num_employees: numOfEmployees.slice(0, 6),
            };
          });
        } else {
          setBusinessDetails((data: any) => {
            return {
              ...data,
              num_employees: numOfEmployees,
            };
          });
        }
      } else {
        setBusinessDetails((data: any) => {
          return {
            ...data,
            [name]: formattedValue,
          };
        });
      }
    } else
      setBusinessDetails((data: any) => {
        return {
          ...data,
          [name]: value,
        };
      });
  };

  const handleToggleChange = (name: any, value: string) => {
    setBusinessDetails((data: any) => {
      if (name === "waive_out") {
      return {
        ...data,
        [name]: value,
        description: "",
      };
    }
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleGetOccupationOptions = (query: string) => {
    const formData = new FormData();
    formData.append("isOccupationSearch", "true");
    formData.append("occupationSearchValue", query);
    submit(formData, { method: "post" });
  };

  const handleSaveAndNextButton = () => {
    if (industryInput?.hazard_grade?.toLowerCase() === "decline") {
      setHardStopForIndustryCode(true);
      return;
    }

    const formData = new FormData();
    formData.append("visa_status", businessDetails?.visa_status);
    formData.append("age", businessDetails?.age);
    // formData.append(
    //   "total_annual_revenue",
    //   removeCommas(businessDetails?.total_annual_revenue)
    // );
    // formData.append("has_online_revenue", businessDetails?.has_online_revenue);
    // formData.append(
    //   "total_revenue_online",
    //   removeCommas(businessDetails?.total_revenue_online)
    // );
    formData.append(
      "school",
      businessDetails?.school
    );
    formData.append(
      "waive_out",
      businessDetails?.waive_out
    );
    formData.append(
      "description",
      businessDetails?.description
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
    submit(formData, { method: "post" });
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

            {/* Information card */}
            <div className="pb-10 md:pb-14">
              <InformationCard
                title="Important Information"
                body="The information you give us must be accurate and complete. This is so
          we can decide whether or not to accept your application for insurance
          and what terms should apply to it. If the information you give us
          isn’t accurate and complete, your application for insurance may be
          declined, we may reduce your claim or we may void your policy from the
          outset. If anything changes, you must also tell us."
                iconColor="#5841BF"
                backgroundColor="#FAEFFC"
              />
            </div>

            {/* Business details step 1 form */}
            <div className="pb-10 md:pb-16">
              <BusinessDetailsStep1Form
                handleToggleChange={handleToggleChange}
                handleChange={handleChange}
                setIsOccupationLoading={setIsOccupationLoading}
                handleGetOccupationOptions={handleGetOccupationOptions}
                isOccupationLoading={isOccupationLoading}
                matchedIndustryList={matchedIndustryList}
                setMatchedIndustryList={setMatchedIndustryList}
                setIndustryInput={setIndustryInput}
                value={
                  response?.data?.policies[0]?.industry_name ||
                  businessDetails?.industry_name ||
                  ""
                }
              />
            </div>

            <div className="flex justify-center w-full pb-20 sm:justify-end md:pb-40">
              <div className="w-60">
                <Button
                  onClick={() => {
                    setStepState((prevState) => ({
                      ...prevState,
                      subStep: 2,
                    }));
                    handleSaveAndNextButton();
                  }}
                  label="Next"
                  variant="filled"
                  disabled={
                    isNextButtonDisabled
                    // ||
                    // parseFloat(
                    //   removeCommas(businessDetails?.total_annual_revenue)
                    // ) <
                    //   parseFloat(
                    //     removeCommas(businessDetails?.total_revenue_online)
                    //   )
                  }
                  showTooltip={isNextButtonDisabled}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                  id="business_details_1_next_btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardstop for declined industry code */}
      <Modal
        isOpen={isHardStopForIndustryCode}
        onClose={() => setHardStopForIndustryCode(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to proceed
            </h1>
            <p>
              Unfortunately, we cannot cover your particular industry at this
              time.
              <br /> If you’d like to get in touch with us or have any
              questions, please{" "}
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
                  navigate("/");
                  setHardStopForIndustryCode(false);
                }}
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

      {/* Hardstop for declined total annual revenue */}
      <Modal
        isOpen={isHardStopForAnnualRevenue}
        onClose={() => setHardStopForAnnualRevenue(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to proceed
            </h1>
            <p>
              The annual revenue of your business is outside of our underwriting
              <br />
              guidelines and we cannot provide a quote for your business at this
              <br />
              time. If you’d like to get in touch with us or have any questions,
              <br />
              please{" "}
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
                  navigate("/");
                  setHardStopForAnnualRevenue(false);
                }}
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

      {/* Hardstop for declined 50% overseas revenue */}
      <Modal
        isOpen={isHardStopFor50PCTOverseasRevenue}
        onClose={() => setHardStopFor50PCTOverseasRevenue(false)}
        icon={<WarningIcon />}
        body={
          <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
            <h1 className="font-bold text-2xl">
              Sorry, we’re unable to proceed
            </h1>
            <p>
              More than 50% of your revenue comes from overseas.
              <br /> If you’d like to get in touch with us or have any
              questions, <br />
              please{" "}
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
                  navigate("/");
                  setHardStopFor50PCTOverseasRevenue(false);
                }}
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
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const age = formData.get("age");
  const visa_status: any = formData.get("visa_status");
  const school=formData.get("school");
  const waive_out = formData.get("waive_out");
  const description = formData.get("description");
  const total_annual_revenue = formData.get("total_annual_revenue");
  const has_online_revenue = formData.get("has_online_revenue");
  const total_revenue_online = formData.get("total_revenue_online");
  const isUpdate = formData.get("isUpdate") == "true";
  const isOccupationSearch = formData.get("isOccupationSearch") == "true";
  const occupationSearchValue: any = formData.get("occupationSearchValue");

  let response;

  const insuredRevenueData: any = {
    // has_50PCT_overseas_revenue,
    // age,
    school,
    total_annual_revenue,
    has_online_revenue,
    total_revenue_online,
    description,
  };

  const infoSecurityData: any = {
    age,
  };

  if (isOccupationSearch) {
    const resData = await getOccupationsList(occupationSearchValue);

    return json({ response: { ...resData, calledOccupationSearchApi: true } });
  }

  /**************************************************************
   *--- HARDSTOP RULES*/

  // const hardstopForAnnualRevenue =
  //   Number(total_annual_revenue) > 10000000 || Number(total_annual_revenue) == 0
  //     ? true
  //     : false;

  // if (hardstopForAnnualRevenue) {
  //   return json({
  //     response: { hardstopForAnnualRevenue },
  //   });
  // }

  // const hardstopFor50PCTOverseas =
  //   has_50PCT_overseas_revenue == "yes" ? true : false;

  // if (hardstopFor50PCTOverseas) {
  //   return json({
  //     response: { hardstopFor50PCTOverseas },
  //   });
  // }

  /**************************************************************/

  let resData;
  if (isUpdate) {
    // const session = await getSession(request.headers.get("cookie"));
    // if (!(await verifyAuthToken(session))) {
    //   return redirect("/login", {
    //     headers: {
    //       "Set-Cookie": await destroySession(session),
    //     },
    //   });
    // }
    const responseData: any = formData.get("response");
    response = JSON.parse(responseData);
    
    response = { ...response, visa_status };
    let section = response?.sections?.find(
      (section: any) => section.section_code == REVENUE_DETAILS
    );

    let section2 = response?.sections?.find(
      (section: any) => section.section_code == INFO_SECURITY_MEASURES
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

    //update policy
    resData = await updatePolicy(session, response);

    if (resData?.status?.message === SUCCESS) {
      const policyId = resData?.data?.policies[0]?.policy_id;
      return redirect("/quote?quoteId=" + policyId, {
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
  } //If new quote
  else {
    return redirect("/contact-details?quoteId=new-quote");
  }
}
