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
import CalenderIcon from "~/components/FinalQuestionsForm/SVGIcons/CalenderIcon";
import Button from "~/components/common/Button";
import { CANCELLATION_REASONS } from "~/constants";
import { SUCCESS } from "~/constants/string";
import { useAppContext } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import { cancelPolicy, getPolicyById } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import {
  convertDateToDDMMYYYY,
  convertDateToYYYYMMDD,
  getMinimumCancellationDate,
  getTodaysDate,
} from "~/utils";

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

const CancelPolicyStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const policyId: any = searchParams.get("policyId");
  const { cancelPolicyData, setCancelPolicyData, setToastProps } =
    useAppContext();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const submit = useSubmit();
  const actionData: any = useActionData();
  const response: any = useLoaderData();

  useEffect(() => {
    if (
      cancelPolicyData?.cancel_reason?.trim()?.length > 0 &&
      cancelPolicyData?.cancel_reason?.toLowerCase() !== "other" &&
      cancelPolicyData?.cancellation_date?.length > 0
    ) {
      setNextButtonDisabled(false);
    } else if (
      cancelPolicyData?.cancel_reason?.toLowerCase() === "other" &&
      cancelPolicyData?.cancellation_comments?.trim() !== "" &&
      cancelPolicyData?.cancellation_date?.length > 0
    ) {
      setNextButtonDisabled(false);
    } else {
      setNextButtonDisabled(true);
    }
  }, [cancelPolicyData]);

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const date = e.target.value;
    setCancelPolicyData((data) => {
      return {
        ...data,
        cancellation_date:
          date === "" ? date : convertDateToDDMMYYYY(e.target.value),
      };
    });
  };

  const handleCancelReason = (value: string) => {
    setCancelPolicyData((data: any) => {
      return {
        ...data,
        cancel_reason: value,
        cancellation_comments: "",
      };
    });
  };

  const handleCancelPolicy = () => {
    const formData = new FormData();
    formData.append("policy_id", policyId);
    formData.append("cancellation_date", cancelPolicyData?.cancellation_date);
    formData.append(
      "cancellation_comments",
      cancelPolicyData?.cancellation_comments?.trim()
    );
    formData.append("cancel_reason", cancelPolicyData?.cancel_reason?.trim());
    submit(formData, { method: "post" });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[1536px] w-full">
        <div className="flex flex-col space-y-10 py-[120px] sm:px-10 lg:px-28 md:space-y-16 lg:pl-[9.875rem] lg:pr-[9.375rem] lg:py-[174px]">
          <div className="flex justify-center">
            <div className="relative px-6 pt-[7.5rem] pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[6.5rem] md:pb-20 md:px-[9.5rem]">
              {/* Logo icon */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="59.9375"
                    cy="59.0625"
                    r="59.0625"
                    fill="#C496FF"
                  />
                  <g clipPath="url(#clip0_975_45342)">
                    <path
                      d="M78.0369 38.59C77.8055 37.4485 76.1279 36.5012 75.3181 36.1702L71.8957 37.6068L69.4759 40.3256L71.0669 48.1732L60.0471 37.7807L49.8854 27.957L47.0317 28.5356L44.4673 30.5409L45.1905 34.108L39.8975 29.9819L36.61 28.4202L33.3322 30.5702L33.1973 33.5685L35.9258 39.7L31.6453 40.5678L30.0836 43.8554L31.5202 47.2778L34.9622 53.2647L31.5397 54.7013L30.4022 56.4174L31.1253 59.9844L45.5871 76.3637L57.6096 88.0384L65.4669 90.1591L72.8903 90.1396L79.4459 85.8396L86.8499 78.3966L86.9652 67.9749L82.0672 51.1422C80.8202 47.4337 78.2683 39.7314 78.0369 38.59Z"
                      fill="white"
                    />
                    <path
                      d="M86.8899 62.367L79.8035 38.8159C79.3761 37.4012 78.4235 36.2036 77.141 35.4691C75.8586 34.7346 74.3436 34.5188 72.9071 34.8661C71.4706 35.2133 70.2215 36.0973 69.4161 37.3365C68.6108 38.5757 68.3103 40.0762 68.5764 41.5299L69.0759 44.8946C63.8369 39.276 53.1741 27.8696 53.0468 27.7333C52.5218 27.1625 51.8876 26.703 51.1817 26.382C50.4758 26.061 49.7126 25.8851 48.9374 25.8647C48.1805 25.8408 47.4266 25.969 46.7202 26.2419C46.0138 26.5147 45.3695 26.9266 44.8253 27.4532C43.8743 28.3716 43.2644 29.5864 43.0959 30.8977L41.2039 28.8603C40.679 28.2896 40.0449 27.8301 39.3391 27.5091C38.6332 27.1881 37.8701 27.0121 37.095 26.9916C36.3379 26.9675 35.5836 27.0957 34.877 27.3686C34.1703 27.6415 33.5257 28.0536 32.9813 28.5804C31.8738 29.6707 31.2353 31.1499 31.2014 32.7036C31.1675 34.2574 31.7409 35.763 32.7997 36.9006L33.8779 38.0613C32.5567 38.1579 31.3113 38.7154 30.3591 39.6364C29.2517 40.7267 28.6131 42.2059 28.5792 43.7597C28.5453 45.3134 29.1187 46.8191 30.1776 47.9566L33.8653 51.9272C32.5437 52.0222 31.2978 52.5799 30.3465 53.5024C29.2389 54.5925 28.6001 56.0717 28.566 57.6255C28.5319 59.1793 29.1051 60.6851 30.1639 61.8228L50.0232 83.2178C55.5185 89.1337 64.2245 92.6412 72.3082 91.0023C75.4897 90.3572 78.459 88.9254 80.9449 86.8377C80.9649 86.8208 80.9848 86.8034 81.0039 86.785L82.5121 85.3329C86.2522 81.7308 88.1732 78.1244 88.7394 73.6412C89.1545 70.3612 88.4487 67.5915 87.6249 64.8083C87.2339 63.4844 86.8899 62.367 86.8899 62.367ZM86.5732 73.3673C86.0731 77.3219 84.3536 80.5265 80.9971 83.7594L79.5183 85.1833C70.7834 92.4195 58.4806 89.1153 51.623 81.7309L31.765 60.3367C31.0932 59.6197 30.7275 58.6691 30.7455 57.6867C30.7635 56.7043 31.1639 55.7677 31.8615 55.0759C32.5643 54.4278 33.4946 54.0837 34.4499 54.1186C35.4052 54.1534 36.308 54.5643 36.9617 55.2618L49.5915 68.8614C49.7911 69.0694 50.0637 69.1916 50.3517 69.2022C50.6397 69.2128 50.9206 69.1111 51.135 68.9184C51.24 68.8208 51.3248 68.7034 51.3845 68.573C51.4442 68.4426 51.4777 68.3017 51.4829 68.1584C51.4881 68.0151 51.4651 67.8722 51.4151 67.7378C51.3651 67.6033 51.2891 67.4801 51.1914 67.3751L31.7774 46.4703C31.1055 45.7534 30.7396 44.8027 30.7576 43.8204C30.7755 42.838 31.1758 41.9013 31.8735 41.2095C32.5766 40.5601 33.5083 40.2155 34.4647 40.251C35.4212 40.2866 36.3247 40.6993 36.9778 41.3991L56.3952 62.3071C56.5951 62.5144 56.8675 62.6362 57.1553 62.6469C57.4431 62.6576 57.7239 62.5564 57.9387 62.3646C58.0438 62.2669 58.1286 62.1496 58.1883 62.0192C58.248 61.8888 58.2814 61.7479 58.2866 61.6046C58.2919 61.4613 58.2688 61.3183 58.2188 61.1839C58.1688 61.0495 58.0928 60.9263 57.9952 60.8212L34.4003 35.4146C33.7282 34.6978 33.3622 33.747 33.3801 32.7645C33.398 31.782 33.7984 30.8452 34.4962 30.1533C35.1999 29.503 36.1327 29.1582 37.0902 29.1945C38.0477 29.2308 38.9518 29.6454 39.6041 30.3472L63.1985 55.7539C63.3982 55.9616 63.6707 56.0836 63.9587 56.0942C64.2466 56.1048 64.5274 56.0032 64.7419 55.8108C64.9541 55.6137 65.0792 55.3403 65.0899 55.0509C65.1006 54.7615 64.9959 54.4797 64.7989 54.2674L46.2429 34.2866C45.5708 33.5698 45.2048 32.619 45.2228 31.6365C45.2409 30.654 45.6415 29.7174 46.3395 29.0257C46.6752 28.701 47.0728 28.4471 47.5086 28.2791C47.9444 28.1111 48.4096 28.0325 48.8764 28.0479C49.3621 28.0612 49.8402 28.1719 50.2822 28.3736C50.7242 28.5753 51.1212 28.8638 51.4496 29.2219C51.6047 29.3882 67.0406 45.9011 69.872 48.9535C70.0306 49.1243 70.2398 49.2399 70.4688 49.2833C70.6979 49.3267 70.9348 49.2957 71.1449 49.1947C71.3551 49.0938 71.5274 48.9283 71.6366 48.7223C71.7459 48.5164 71.7864 48.2809 71.7522 48.0503L70.7329 41.1869C70.555 40.2786 70.7335 39.3366 71.2316 38.5565C71.7296 37.7764 72.5089 37.2179 73.4077 36.997C74.3065 36.7761 75.2558 36.9097 76.0588 37.3701C76.8617 37.8304 77.4566 38.5822 77.72 39.4695C77.72 39.4695 85.1421 64.1129 85.5311 65.4272C86.3149 68.0764 86.935 70.5031 86.5732 73.3673ZM39.3336 87.7307C36.7407 87.4102 34.174 85.2378 32.6358 83.3108C30.8415 81.0706 30.0005 78.2145 30.2946 75.3595C30.3263 75.0716 30.2424 74.7829 30.0613 74.5568C29.8802 74.3308 29.6167 74.186 29.3288 74.1543C29.041 74.1225 28.7523 74.2064 28.5262 74.3875C28.3002 74.5686 28.1554 74.8321 28.1236 75.12C27.7682 78.5495 28.7761 81.9812 30.9296 84.6739C31.8056 85.772 34.9837 89.3941 39.0661 89.8984C39.2085 89.9159 39.3529 89.9053 39.4911 89.867C39.6293 89.8288 39.7586 89.7637 39.8717 89.6755C39.9847 89.5873 40.0793 89.4776 40.15 89.3528C40.2207 89.2281 40.2661 89.0906 40.2837 88.9483C40.3012 88.8059 40.2906 88.6615 40.2524 88.5233C40.2141 88.3851 40.149 88.2558 40.0608 88.1427C39.9726 88.0296 39.8629 87.9351 39.7381 87.8644C39.6134 87.7937 39.4759 87.7483 39.3336 87.7307ZM40.9239 81.8366C39.5812 81.671 38.2268 80.5128 37.4053 79.4834C36.457 78.3004 36.0122 76.7919 36.1667 75.2836C36.1835 75.1406 36.1718 74.9957 36.1323 74.8572C36.0928 74.7188 36.0264 74.5895 35.9368 74.4768C35.8471 74.3641 35.7361 74.2702 35.61 74.2006C35.484 74.131 35.3454 74.0871 35.2023 74.0712C35.0592 74.0554 34.9143 74.068 34.7761 74.1084C34.6379 74.1488 34.5091 74.2161 34.397 74.3064C34.2849 74.3968 34.1917 74.5084 34.123 74.6349C34.0542 74.7614 34.0111 74.9003 33.9962 75.0435C33.7795 77.1262 34.3909 79.2105 35.6984 80.846C36.2272 81.5087 38.1476 83.6946 40.6565 84.0043C40.9434 84.0364 41.2314 83.9549 41.459 83.7772C41.6866 83.5996 41.8356 83.34 41.8742 83.0539C41.9095 82.7664 41.8292 82.4768 41.651 82.2485C41.4728 82.0203 41.2113 81.8721 40.9239 81.8366ZM87.0143 28.2223C86.0249 27.2441 82.483 24.0533 78.4466 24.0506C78.157 24.0504 77.8792 24.1653 77.6743 24.37C77.4694 24.5746 77.3542 24.8523 77.3541 25.1419C77.3539 25.4315 77.4688 25.7093 77.6734 25.9142C77.8781 26.1191 78.1558 26.2343 78.4454 26.2345C80.9915 26.2363 83.7481 28.065 85.4792 29.7757C87.5059 31.779 88.6779 34.4894 88.7493 37.3382C88.7519 37.4816 88.7827 37.6231 88.84 37.7546C88.8973 37.8861 88.9799 38.005 89.0832 38.1045C89.1865 38.2041 89.3083 38.2823 89.4418 38.3348C89.5753 38.3872 89.7178 38.4128 89.8612 38.4102C89.9277 38.4091 89.9939 38.4018 90.059 38.3884C90.3091 38.3375 90.5334 38.2005 90.693 38.0014C90.8526 37.8022 90.9374 37.5535 90.9327 37.2983C90.8494 33.8801 89.445 30.627 87.0143 28.2223ZM77.6428 30.0542C77.3531 30.0542 77.0753 30.1692 76.8704 30.3739C76.6656 30.5787 76.5504 30.8565 76.5503 31.1461C76.5503 31.4358 76.6652 31.7136 76.87 31.9185C77.0748 32.1234 77.3525 32.2385 77.6422 32.2386C78.9554 32.2397 80.4098 33.2149 81.3328 34.1269C82.4043 35.1854 83.0241 36.6178 83.0622 38.1235C83.0648 38.2669 83.0956 38.4084 83.1529 38.5398C83.2101 38.6713 83.2927 38.7902 83.3959 38.8897C83.4991 38.9893 83.6209 39.0675 83.7543 39.12C83.8878 39.1725 84.0303 39.1982 84.1736 39.1956C84.317 39.193 84.4585 39.1622 84.5899 39.1049C84.7214 39.0477 84.8403 38.9651 84.9398 38.8619C85.0394 38.7587 85.1176 38.6369 85.1701 38.5034C85.2226 38.37 85.2483 38.2275 85.2457 38.0842C85.1957 36.0088 84.3432 34.0335 82.8673 32.5736C82.2703 31.9832 80.1275 30.0557 77.6428 30.0542Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_975_45342">
                      <rect
                        width="69.8813"
                        height="69.8812"
                        fill="white"
                        transform="translate(18.4844 30.6094) rotate(-11.4606)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <div className="flex flex-col w-full space-y-10 text-primaryBg md:space-y-14">
                <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                  We’re sorry to see you go
                </h1>

                <form className="flex flex-col space-y-10 md:space-y-14">
                  <div className=" flex flex-col space-y-6">
                    <p className="font-bold md:text-xl">
                      When do you want the cancellation to take effect?
                    </p>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Select date"
                        className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                        value={cancelPolicyData?.cancellation_date}
                        readOnly
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                        <CalenderIcon />
                      </div>
                      <input
                        type="date"
                        min={getMinimumCancellationDate(
                          response?.data?.policies?.[0]?.effective_date
                        )}
                        max={convertDateToYYYYMMDD(
                          response?.data?.policies?.[0]?.effective_end_date
                        )}
                        value={
                          convertDateToYYYYMMDD(
                            cancelPolicyData?.cancellation_date
                          ) || ""
                        }
                        onChange={handleDateChange}
                        className="absolute top-0 left-0 pr-3 w-full h-full opacity-[0.00000000001]"
                      />
                    </div>
                  </div>

                  <div className=" flex flex-col space-y-6">
                    <p className="font-bold md:text-xl">
                      Please let us know why are you cancelling your policy?
                    </p>
                    <div className="relative">
                      <select
                        className="appearance-none px-4 py-[10px] w-full rounded-lg border border-grayCustom leading-tight focus:outline-none "
                        style={{
                          color: `${
                            cancelPolicyData?.cancel_reason === ""
                              ? "#B1B1B1"
                              : "#3B3B3B"
                          }`,
                        }}
                        value={cancelPolicyData?.cancel_reason}
                        onChange={(e) => {
                          e.target.style.color = "#3B3B3B";
                          handleCancelReason(e.target.value);
                        }}
                      >
                        <option value="" disabled hidden>
                          Select reason
                        </option>
                        {CANCELLATION_REASONS?.map((reason, index) => (
                          <option
                            key={index}
                            className="text-primaryBg"
                            value={reason}
                          >
                            {reason}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.8533 5.35807L12.6267 4.13141C12.5289 4.04252 12.4133 3.99807 12.28 3.99807C12.1467 3.99807 12.0356 4.04252 11.9467 4.13141L8 8.09141L4.05333 4.13141C3.95556 4.04252 3.84445 3.99807 3.72 3.99807C3.59555 3.99807 3.48444 4.04252 3.38667 4.13141L2.14667 5.35807C2.04889 5.45585 2 5.57141 2 5.70474C2 5.83807 2.04889 5.94918 2.14667 6.03807L7.66667 11.5581C7.76445 11.647 7.87556 11.6914 8 11.6914C8.12445 11.6914 8.23556 11.647 8.33333 11.5581L13.8533 6.03807C13.9511 5.9403 14 5.82919 14 5.70474C14 5.5803 13.9511 5.46474 13.8533 5.35807Z"
                            fill="#008375"
                          />
                        </svg>
                      </div>
                    </div>

                    {cancelPolicyData?.cancel_reason?.toLowerCase() ===
                      "other" && (
                      <input
                        type="text"
                        name="cancellation_comments"
                        onChange={(e) => {
                          setCancelPolicyData((data: any) => {
                            return {
                              ...data,
                              cancellation_comments: e.target.value,
                            };
                          });
                        }}
                        value={cancelPolicyData?.cancellation_comments}
                        className="px-4 py-[10px] w-full rounded-lg border border-grayCustom"
                        placeholder="Tell us more about it."
                        maxLength={1000}
                      />
                    )}
                  </div>
                </form>

                <div className="flex flex-col-reverse items-center w-full sm:flex-row sm:justify-between">
                  <div className="w-60 mt-3 sm:mt-0">
                    <Button
                      onClick={() => {
                        setCancelPolicyData({
                          policy_id: "",
                          cancellation_date: "",
                          cancellation_comments: "",
                          cancel_reason: "",
                        });
                        navigate("/cancel-policy/step-1?policyId=" + policyId);
                      }}
                      label="Back"
                      variant=""
                      disabled={false}
                      showTooltip={false}
                      tooltipContent=""
                    />
                  </div>
                  <div className="w-60">
                    <Button
                      onClick={() => {
                        handleCancelPolicy();
                      }}
                      label="Continue"
                      variant="filled"
                      disabled={isNextButtonDisabled}
                      showTooltip={isNextButtonDisabled}
                      tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPolicyStep2;

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
  const cancellation_date = formData.get("cancellation_date");
  const cancellation_comments = formData.get("cancellation_comments");
  const cancel_reason = formData.get("cancel_reason");

  const data = {
    policy_id: policy_id,
    cancellation_comments:
      cancellation_comments === "undefined" || cancellation_comments === "null"
        ? ""
        : cancellation_comments,
    cancellation_date:
      cancellation_date === "undefined" || cancellation_date === "null"
        ? ""
        : cancellation_date,
    cancel_reason:
      cancel_reason === "undefined" || cancel_reason === "null"
        ? ""
        : cancel_reason,
  };

  const resData = await cancelPolicy(session, data);

  if (resData?.status?.message === SUCCESS) {
    return redirect("/cancel-policy/step-3?policyId=" + policy_id, {
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
}
