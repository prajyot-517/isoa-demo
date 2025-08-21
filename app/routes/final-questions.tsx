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
import { useState, useEffect } from "react";
import FinalQuestionsForm from "~/components/FinalQuestionsForm";
import Button from "~/components/common/Button";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import {
  INFO_SECURITY_MEASURES,
  INSURANCE_HISTORY,
  SUCCESS,
} from "~/constants/string";
import { useAppContext } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import { getPolicyById, updatePolicy } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(await verifyAuthToken(session))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  const goBackToSummary = session.get("goBackToSummary");

  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  const response = await getPolicyById(session, quoteId);
  return json(
    { response, goBackToSummary },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
}

export default function FinalQuestions() {
  const {
    stepState,
    setStepState,
    finalQuestionsDetails,
    setFinalQuestionsDetails,
    setToastProps,
    productDetails,
  } = useAppContext();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const loaderData: any = useLoaderData<typeof loader>();
  const response = loaderData?.response;
  const goBackToSummary = loaderData?.goBackToSummary;
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId: any = searchParams.get("quoteId");
  const actionData: any = useActionData();
  const [isValidPostCode, setValidPostCode] = useState(true);

  //If fields already exist in backend
  useEffect(() => {
    if (
      (response &&
        !response?.newQuote &&
        response?.data &&
        actionData?.response?.status == undefined) ||
      null
    ) {
      const data = response?.data?.policies[0];
      const infoSecurity = data?.sections?.find(
        (section: any) => section?.section_code == INFO_SECURITY_MEASURES
      );

      const insuranceSection = data?.sections?.find(
        (section: any) => section?.section_code == INSURANCE_HISTORY
      );

      const newInsuranceHistoryData = {
        has_current_cyber_cover:
          insuranceSection?.section_details?.find(
            (detail: any) =>
              detail?.section_detail_code == "has_current_cyber_cover"
          )?.attribute_value || "",
        has_current_cyber_cover_details:
          insuranceSection?.section_details?.find(
            (detail: any) =>
              detail?.section_detail_code == "has_current_cyber_cover_details"
          )?.attribute_value || "",
      };

      const newDataInfoSecurity = {
        has_cyber_training:
          infoSecurity?.section_details?.find(
            (detail: any) => detail.section_detail_code == "has_cyber_training"
          )?.attribute_value || "",
        has_qualified_it_team:
          infoSecurity?.section_details?.find(
            (detail: any) =>
              detail.section_detail_code == "has_qualified_it_team"
          )?.attribute_value || "",

        has_password_policy:
          infoSecurity?.section_details?.find(
            (detail: any) => detail.section_detail_code == "has_password_policy"
          )?.attribute_value || "",
        has_two_factor_auth:
          infoSecurity?.section_details?.find(
            (detail: any) => detail.section_detail_code == "has_two_factor_auth"
          )?.attribute_value || "",
      };

      const newData = {
        ...newInsuranceHistoryData,
        ...newDataInfoSecurity,

        insured_company_name: data?.insured_company_name || "",

        insured_trading_name: data?.insured_trading_name || "",

        insured_address_line1: data?.insured_address_line1 || "",

        insured_address_line2: data?.insured_address_line2 || "",

        insured_address_postcode: data?.insured_address_postcode || "",

        insured_address_state: data?.insured_address_state || "",

        policy_inception_date: data?.policy_inception_date || "",

        policy_expiry_date: data?.policy_expiry_date || "",

        is_trading_name_different: true,
      };
      // Check if the new data is different from the current state
      if (JSON.stringify(newData) !== JSON.stringify(finalQuestionsDetails)) {
        setFinalQuestionsDetails(newData);
      }
    }
  }, [response]);

  //If any one field is missing then disable the next button
  useEffect(() => {
    if (
      finalQuestionsDetails?.has_current_cyber_cover?.length > 0 &&
      finalQuestionsDetails?.has_cyber_training?.length > 0 &&
      finalQuestionsDetails?.has_qualified_it_team?.length > 0 &&
      finalQuestionsDetails?.has_password_policy?.length > 0 &&
      finalQuestionsDetails?.has_two_factor_auth?.length > 0 &&
      finalQuestionsDetails?.insured_company_name?.trim()?.length > 0 &&
      finalQuestionsDetails?.insured_address_line1?.trim()?.length > 0 &&
      finalQuestionsDetails?.insured_address_postcode?.length > 0 &&
      finalQuestionsDetails?.insured_address_state?.trim()?.length > 0 &&
      finalQuestionsDetails?.policy_inception_date?.length > 0 &&
      finalQuestionsDetails?.policy_expiry_date?.length > 0 &&
      finalQuestionsDetails?.insured_trading_name?.trim()?.length > 0 &&
      isValidPostCode
    ) {
      if (
        finalQuestionsDetails?.has_current_cyber_cover?.toLowerCase() ===
          "yes" &&
        finalQuestionsDetails?.has_current_cyber_cover_details?.trim()?.length >
          0
      ) {
        setNextButtonDisabled(false);
      } else if (
        finalQuestionsDetails?.has_current_cyber_cover?.toLowerCase() == "no"
      ) {
        setNextButtonDisabled(false);
      } else {
        setNextButtonDisabled(true);
      }
    } else {
      setNextButtonDisabled(true);
    }
  }, [finalQuestionsDetails, response]);

  useEffect(() => {
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
          (response?.status?.description?.message ??
            response?.status?.description),
        variant: "error",
      });
    }
  }, [actionData, response]);

  const handleChange = (e: any, type = "") => {
    const { name, value } = e?.target;
    if (
      name === "insured_company_name" &&
      !finalQuestionsDetails?.is_trading_name_different
    ) {
      setFinalQuestionsDetails((data: any) => {
        return {
          ...data,
          [name]: value,
          insured_trading_name: value,
        };
      });
    } else {
      if (type === "number") {
        if (name === "insured_address_postcode") {
          const valueToBeStored = value?.replace(/\D/g, "")?.slice(0, 4);

          if (valueToBeStored.length <= 4) {
            setFinalQuestionsDetails((data) => ({
              ...data,
              [name]: valueToBeStored,
            }));
          }

          const isValidPostcode = /^\d{4}$/.test(valueToBeStored);
          setValidPostCode(isValidPostcode);
        } else {
          setFinalQuestionsDetails((data: any) => {
            return {
              ...data,
              [name]: `${value && Math.max(0, value)}`,
            };
          });
        }
      } else if (name === "insured_address_state") {
        setFinalQuestionsDetails((data: any) => {
          return {
            ...data,
            [name]: value?.replace(/\d/g, ""),
          };
        });
      } else
        setFinalQuestionsDetails((data: any) => {
          return {
            ...data,
            [name]: value,
          };
        });
    }
  };

  const handleSaveAndNextButton = () => {
    const formData = new FormData();
    formData.append(
      "has_current_cyber_cover",
      finalQuestionsDetails?.has_current_cyber_cover
    );
    formData.append(
      "has_current_cyber_cover_details",
      finalQuestionsDetails?.has_current_cyber_cover_details?.trim()
    );
    formData.append(
      "has_cyber_training",
      finalQuestionsDetails?.has_cyber_training
    );
    formData.append(
      "has_qualified_it_team",
      finalQuestionsDetails?.has_qualified_it_team
    );
    formData.append(
      "has_password_policy",
      finalQuestionsDetails?.has_password_policy
    );
    formData.append(
      "has_two_factor_auth",
      finalQuestionsDetails?.has_two_factor_auth
    );

    formData.append(
      "insured_company_name",
      finalQuestionsDetails?.insured_company_name?.trim()
    );

    formData.append(
      "insured_trading_name",
      finalQuestionsDetails?.insured_trading_name?.trim()
    );

    formData.append(
      "insured_address_line1",
      finalQuestionsDetails?.insured_address_line1?.trim()
    );

    formData.append(
      "insured_address_line2",
      finalQuestionsDetails?.insured_address_line2?.trim()
    );

    formData.append(
      "insured_address_postcode",
      finalQuestionsDetails?.insured_address_postcode?.trim()
    );

    formData.append(
      "insured_address_state",
      finalQuestionsDetails?.insured_address_state?.trim()
    );

    formData.append(
      "policy_inception_date",
      finalQuestionsDetails?.policy_inception_date
    );

    formData.append(
      "policy_expiry_date",
      finalQuestionsDetails?.policy_expiry_date
    );

    formData.append("quote_id", quoteId);
    if (response && !response.newQuote && response?.data?.policies[0]) {
      const data = response.data.policies[0];
      formData.append("isUpdate", "true");
      formData.append("response", JSON.stringify(data, null, 2));
    }
    submit(formData, { method: "post" });
  };

  const handleToggleChange = (name: any, value: string) => {
    setFinalQuestionsDetails((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleCheckBox = (e: any) => {
    if (e.target.checked == true) {
      setFinalQuestionsDetails((prev: any) => ({
        ...prev,
        is_trading_name_different: e.target.checked,
      }));
    } else {
      setFinalQuestionsDetails((prev: any) => ({
        ...prev,
        is_trading_name_different: e.target.checked,
        insured_trading_name: finalQuestionsDetails?.insured_company_name,
      }));
    }
  };

  //To check if the quote option selected is empty
  useEffect(() => {
    if (Object?.keys(productDetails?.quoteOptionSelected)?.length == 0) {
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
          <div className="text-primaryBg sm:px-10 md:px-28 lg:px-40">
            <div className="px-4 pt-16 pb-10 sm:px-0 md:pt-20 md:pb-16">
              <h1 className="font-black text-[2.25rem] ">Final questions</h1>
              <p className="mt-6 font-bold text-[1.25rem]">
                You're almost done. Just a few final questions to go.
              </p>
            </div>

            {/* Final questions form */}
            <div className="pb-10 md:pb-16">
              <FinalQuestionsForm
                handleChange={handleChange}
                handleToggleChange={handleToggleChange}
                handleCheckBox={handleCheckBox}
                isValidPostCode={isValidPostCode}
                policyType={response?.data?.policies[0]?.policy_type}
                parentPolicy={response?.data?.policies[0]?.parent_policy}
              />
            </div>

            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() =>
                    navigate(`/contact-details?quoteId=${quoteId}`)
                  }
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                  id="final_questions_back_btn"
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={() => {
                    handleSaveAndNextButton();
                    setStepState((prevState) => ({
                      ...prevState,
                      currentStep: 5,
                      subStep: 1,
                    }));
                  }}
                  label="Continue to summary"
                  variant="filled"
                  disabled={isNextButtonDisabled}
                  showTooltip={isNextButtonDisabled}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                  id="final_questions_continue_btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const has_current_cyber_cover: any = formData.get("has_current_cyber_cover");
  const has_current_cyber_cover_details = formData.get(
    "has_current_cyber_cover_details"
  );

  const has_cyber_training = formData.get("has_cyber_training");

  const has_qualified_it_team = formData.get("has_qualified_it_team");

  const has_password_policy = formData.get("has_password_policy");

  const has_two_factor_auth = formData.get("has_two_factor_auth");

  const insured_trading_name = formData.get("insured_trading_name");

  const insured_company_name = formData.get("insured_company_name");

  const insured_address_line1 = formData.get("insured_address_line1");

  const insured_address_line2 = formData.get("insured_address_line2");

  const insured_address_postcode = formData.get("insured_address_postcode");

  const insured_address_state = formData.get("insured_address_state");

  const policy_inception_date = formData.get("policy_inception_date");

  const policy_expiry_date = formData.get("policy_expiry_date");

  const isUpdate = formData.get("isUpdate") == "true";
  let response;

  let insuranceHistoryData: any = {
    has_current_cyber_cover,
    has_current_cyber_cover_details,
  };

  if (has_current_cyber_cover?.toLowerCase() == "no") {
    insuranceHistoryData = {
      ...insuranceHistoryData,
      has_current_cyber_cover_details: "",
    };
  }

  const infoSecurityMeasures: any = {
    has_cyber_training,
    has_qualified_it_team,
    has_password_policy,
    has_two_factor_auth,
  };

  const businessDetails = {
    insured_company_name,
    insured_trading_name,
    insured_address_line1,
    insured_address_line2,
    insured_address_state,
    insured_address_postcode,
  };

  const policyDates = {
    policy_inception_date,
    policy_expiry_date,
  };

  const responseData: any = formData.get("response");

  response = JSON.parse(responseData);

  response = { ...response, ...businessDetails, ...policyDates };

  let section = response?.sections?.find(
    (section: any) => section.section_code == INSURANCE_HISTORY
  );

  let section2 = response?.sections?.find(
    (section: any) => section.section_code == INFO_SECURITY_MEASURES
  );

  section?.section_details?.map((section: any) => {
    if (
      insuranceHistoryData[section?.section_detail_code] != undefined ||
      null
    ) {
      section.attribute_value =
        insuranceHistoryData[section?.section_detail_code];
    }
  });

  section2?.section_details?.map((section: any) => {
    if (
      infoSecurityMeasures[section?.section_detail_code] != undefined ||
      null
    ) {
      section.attribute_value =
        infoSecurityMeasures[section?.section_detail_code];
    }
  });

  const resData = await updatePolicy(session, response);

  if (resData?.status?.message === SUCCESS) {
    const policyId = resData?.data?.policies[0]?.policy_id;
    return redirect("/summary?quoteId=" + policyId, {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    return json(
      {
        response: resData,
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  }
}
