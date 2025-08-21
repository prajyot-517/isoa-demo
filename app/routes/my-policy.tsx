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
import PolicyDetailsCard from "~/components/MyPolicy/PolicyDetailsCard";
import Button from "~/components/common/Button";
import GetInTouchCard from "~/components/common/GetInTouchCard";
import NothingFound from "~/components/common/NothingFound";
import {
  BOUND,
  CANCELLATION,
  CANCELLED,
  ENDORSEMENT,
  PRE_QUOTE,
  QUOTED,
  RENEWAL,
  SUCCESS,
} from "~/constants/string";
import { useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import {
  downloadCOIDocument,
  downloadDocument,
  getPolicyById,
  renewPolicy,
} from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { downloadDocumentUtil, isDatePassed } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  if (!(await verifyAuthToken(session))) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
  const { searchParams } = new URL(request.url);
  const policyId: any = searchParams.get("policyId");
  const response = await getPolicyById(session, policyId);
  return json(response, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const MyPolicy = () => {
  const response = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const policyId = searchParams.get("policyId");
  const submit = useSubmit();
  const data = response?.data?.policies[0];
  const [documentNameForDownload, setDocumentNameForDownload] = useState("");
  const [renewalPolicy, setRenewalPolicy] = useState<any>(null);
  const actionData: any = useActionData();
  const { setToastProps } = useToast();

  const [
    succeedingBoundOrCancelledPolicy,
    setSucceedingBoundOrCancelledPolicy,
  ] = useState<any>(null);

  let nothingFound =
    response?.status?.statusCode === 400 ||
    response?.status?.statusCode === 500 ||
    response?.status?.statusCode === 401
      ? true
      : false;

  //For download
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (actionData?.response?.isDownload) {
        try {
          downloadDocumentUtil(
            actionData?.response?.data,
            documentNameForDownload
          );
        } catch (error) {
          console.error(error);
          setToastProps({ variant: "error", message: "Download failed" });
        }
      } else if (
        actionData?.response?.isCOIDownload &&
        actionData?.response?.status?.statusCode === 200
      ) {
        try {
          downloadDocumentUtil(
            actionData?.response?.data,
            documentNameForDownload
          );
        } catch (error) {
          console.error(error);
          setToastProps({ variant: "error", message: "Download failed" });
        }
      } else if (actionData?.isRenewalSucceed) {
        navigate(
          "/business-details-1?quoteId=" +
            actionData?.response?.data?.policies[0]?.policy_id
        );
      }
    }
  }, [actionData]);

  //For backend errors
  useEffect(() => {
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

  useEffect(() => {
    if (response?.status?.statusCode === 200 && response?.data?.policies[0]) {
      setSucceedingBoundOrCancelledPolicy(
        response?.data?.policies[0]?.succeeding_policies?.find(
          (policy: any) => {
            return (
              policy?.policy_stage?.toLowerCase() === BOUND ||
              policy?.policy_stage?.toLowerCase() === CANCELLED
            );
          }
        )
      );
      setRenewalPolicy(
        response?.data?.policies[0]?.succeeding_policies?.find(
          (policy: any) => {
            return (
              (policy?.policy_stage?.toLowerCase() === PRE_QUOTE ||
                policy?.policy_stage?.toLowerCase() === QUOTED) &&
              policy?.policy_type?.toLowerCase() === RENEWAL
            );
          }
        )
      );
    }
  }, [response]);

  const handleDownloadDocument = async (
    documentUrlPath: any,
    documentName: string
  ) => {
    const formData = new FormData();
    formData.append("document_download_path", documentUrlPath);
    formData.append("isDownload", "true");
    setDocumentNameForDownload(documentName);
    submit(formData, { method: "post" });
  };

  const handleDownloadCOIDocument = async () => {
    const formData = new FormData();
    formData.append("policyId", policyId);
    formData.append("isCOIDownload", "true");
    setDocumentNameForDownload("Certificate of Insurance");
    submit(formData, { method: "post" });
  };

  const navigate = useNavigate();

  const handlePolicyRenewal = () => {
    if (renewalPolicy?.policy_stage?.toLowerCase() === PRE_QUOTE) {
      navigate("/business-details-1?quoteId=" + renewalPolicy?.policy_id);
    } else if (renewalPolicy?.policy_stage?.toLowerCase() === QUOTED) {
      navigate("/quote?quoteId=" + renewalPolicy?.policy_id);
    }
  };

  return (
    <>
      {nothingFound ? (
        <NothingFound />
      ) : (
        <div>
          {response?.data?.policies[0]?.parent_policy &&
            !isDatePassed(
              response?.data?.policies[0]?.parent_policy?.effective_end_date
            ) && (
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

          {succeedingBoundOrCancelledPolicy ? (
            <div className="flex justify-center space-x-2 text-primaryBg px-4 py-3 bg-[#FFF3E6]">
              <div>
                <svg
                  className="mt-[2px]"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.8441 13.8147L9.00648 1.25773C8.89997 1.07667 8.75619 0.93289 8.57513 0.826384C8.39407 0.719878 8.20236 0.666626 8 0.666626C7.79764 0.666626 7.60593 0.719878 7.42487 0.826384C7.24381 0.93289 7.10535 1.07667 7.0095 1.25773L0.155863 13.8147C-0.0571496 14.1875 -0.0518244 14.5603 0.171839 14.9331C0.267694 15.1035 0.40615 15.2419 0.58721 15.3484C0.768271 15.4549 0.954654 15.5082 1.14636 15.5082H14.8536C15.0453 15.4975 15.2317 15.4443 15.4128 15.3484C15.5939 15.2526 15.7323 15.1141 15.8282 14.9331C16.0518 14.5603 16.0571 14.1875 15.8441 13.8147ZM9.11831 9.59712L9.27807 5.49133C9.27807 5.42743 9.25144 5.37417 9.19819 5.33157C9.12363 5.26767 9.04908 5.23572 8.97453 5.23572H7.02547C6.96157 5.23572 6.88702 5.26767 6.80181 5.33157C6.74856 5.37417 6.72193 5.43808 6.72193 5.52328L6.86572 9.59712C6.86572 9.65037 6.89767 9.6983 6.96157 9.7409C7.02547 9.78351 7.0947 9.79948 7.16926 9.78883H8.81477C8.89997 9.78883 8.97453 9.77285 9.03843 9.7409C9.10233 9.70895 9.12896 9.66102 9.11831 9.59712ZM9.13428 12.9201V11.2267C9.13428 11.1415 9.10766 11.0722 9.05441 11.019C9.00115 10.9657 8.93725 10.9391 8.8627 10.9391H7.1373C7.06275 10.9391 6.99885 10.9657 6.94559 11.019C6.89234 11.0722 6.86572 11.1415 6.86572 11.2267V12.9201C6.86572 13.0053 6.89234 13.0745 6.94559 13.1278C6.99885 13.181 7.06275 13.213 7.1373 13.2236H8.8627C8.93725 13.2236 9.00115 13.1917 9.05441 13.1278C9.10766 13.0639 9.13428 12.9946 9.13428 12.9201Z"
                    fill="#FD8204"
                  />
                </svg>
              </div>
              <p>
                Your policy is pending{" "}
                {succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                CANCELLATION
                  ? "cancellation"
                  : succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                    ENDORSEMENT
                  ? "endorsement"
                  : succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                    RENEWAL
                  ? "renewal"
                  : ""}
                . It will take effect on{" "}
                <span className="font-bold">
                  {succeedingBoundOrCancelledPolicy?.effective_date}
                </span>
                .{" "}
                {succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                CANCELLATION ? (
                  "We will send you an email to confirm your refund amount soon."
                ) : (
                  <span
                    className="text-secondary underline cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/my-policy?policyId=${succeedingBoundOrCancelledPolicy?.policy_id}`
                      )
                    }
                  >
                    Click here to view{" "}
                    {succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                    ENDORSEMENT
                      ? "endorsement"
                      : succeedingBoundOrCancelledPolicy?.policy_type?.toLowerCase() ===
                        RENEWAL
                      ? "renewal"
                      : ""}
                  </span>
                )}{" "}
              </p>
            </div>
          ) : (
            <div className="mt-[2px] md:mt-1"></div>
          )}
          <div className="flex justify-center bg-custom-gradient">
            <div className="max-w-[1536px] w-full">
              <div className="px-9 pt-12  text-white h-52 md:h-72 md:px-16 lg:px-48 md:pt-16">
                <div className="flex flex-col space-y-2">
                  <h1 className="font-black text-[1.625rem] md:text-[2.5rem]">
                    Hi {data?.insured_contact_name},
                  </h1>
                  <p className="font-bold text-[1.25rem] md:text-2xl">
                    Here's an overview of your policy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {renewalPolicy && (
            <div className="flex justify-center">
              <div className="max-w-[1536px] w-full">
                <div className="md:px-20 lg:px-40">
                  <div className="flex flex-col space-y-6 md:text-lg p-4 md:p-6 -mt-2 md:-mt-14 text-primaryBg bg-softBg rounded-lg border border-primaryBg md:space-y-0 md:flex-row md:justify-between md:items-center md:space-x-28 mb-16 md:mb-24">
                    <div>
                      <p className="font-bold">Policy is due for renewal</p>
                      <br />
                      <p>
                        {renewalPolicy?.policy_stage?.toLowerCase() === QUOTED
                          ? "You have an active quote for renewal. Click here to go to the quote."
                          : "Update and customize your policy for the year ahead. If you decide not to renew, the policy will lapse on the expiry date."}
                      </p>
                    </div>
                    <div className="w-44">
                      <Button
                        onClick={() => handlePolicyRenewal()}
                        label="Renew"
                        variant="filled"
                        disabled={false}
                        showTooltip={false}
                        tooltipContent=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <div className="max-w-[1536px] w-full">
              <div className="md:px-12 lg:px-40">
                <PolicyDetailsCard
                  responseData={data}
                  handleDownloadDocument={handleDownloadDocument}
                  policyId={policyId}
                  succeedingBoundOrCancelledPolicy={
                    succeedingBoundOrCancelledPolicy
                  }
                  isPolicyDueForRenewal={renewalPolicy ? true : false}
                  handleDownloadCOIDocument={handleDownloadCOIDocument}
                />
              </div>
            </div>
          </div>

          <div className="pt-[5.25rem]">
            <GetInTouchCard />
          </div>
        </div>
      )}
    </>
  );
};

export default MyPolicy;

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
  const policy_id = formData.get("policy_id");
  const policyId: any = formData.get("policyId");
  const isDownload = formData.get("isDownload") === "true";
  const isCOIDownload = formData.get("isCOIDownload") === "true";
  const isPolicyRenewal = formData.get("isPolicyRenewal") === "true";

  let response;
  let resData;

  if (isDownload == true) {
    const document_download_path = formData.get("document_download_path");
    let res;
    try {
      res = await downloadDocument(session, document_download_path);
    } catch (error) {
      console.error(error);
      return json(
        {
          response: error,
        },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    }
    const doc = JSON?.parse(JSON?.stringify(res));
    response = { data: doc, isDownload: true };
    return json(
      {
        response: response,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } else if (isPolicyRenewal) {
    const resData = await renewPolicy(session, { policy_id });
    if (resData?.status?.message === SUCCESS) {
      return json(
        {
          response: resData,
          isRenewalSucceed: true,
        },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
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
  } else if (isCOIDownload) {
    const res = await downloadCOIDocument(session, policyId);
    const doc = JSON.parse(JSON.stringify(res));
    const response = {
      data: doc,
      isCOIDownload: true,
      status: doc?.status ?? { statusCode: 200 },
    };
    return json(
      { response: response },
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
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
