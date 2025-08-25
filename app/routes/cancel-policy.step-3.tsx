import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Button from "~/components/common/Button";
import { CANCELLATION, CANCELLED } from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import { getPolicyById } from "~/services/quote.api";
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
  const { searchParams } = new URL(request.url);
  const policyId: any = searchParams.get("policyId");
  const response = await getPolicyById(session, policyId);
  return json(response, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const CancelPolicyStep3 = () => {
  const navigate = useNavigate();
  const response: any = useLoaderData();
  const { setToastProps } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const policyId = searchParams.get("policyId");
  const [effectiveDate, setEffectiveDate] = useState("");
  const { setCancelPolicyData } = useAppContext();

  function findQuotedCancellationPolicy(policies: any) {
    return policies?.find((policy: any) => {
      return (
        policy.policy_stage?.toLowerCase() === CANCELLED &&
        policy.policy_type?.toLowerCase() === CANCELLATION
      );
    });
  }

  // Reset cancellation data
  useEffect(() => {
    setCancelPolicyData({
      policy_id: "",
      cancellation_date: "",
      cancellation_comments: "",
      cancel_reason: "",
    });
  }, []);

  //For backend errors from loader
  useEffect(() => {
    if (response?.status?.statusCode !== 200 && response?.status?.description) {
      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ??
            response?.status?.description),
        variant: "error",
      });
    } else {
      const policy = response?.data?.policies[0];
      const succeedingCancelledPolicy = findQuotedCancellationPolicy(
        policy?.succeeding_policies
      );
      setEffectiveDate(succeedingCancelledPolicy?.effective_date);
    }
  }, [response]);

  return (
    <div className="flex justify-center">
      <div className="max-w-[1536px] w-full">
        <div className="flex flex-col space-y-10 py-[120px] sm:px-10 lg:px-28 md:space-y-16 lg:pl-[9.875rem] lg:pr-[9.375rem] lg:py-[174px]">
          <div className="flex justify-center">
            <div className="relative px-8 pt-[7.5rem] pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[6.5rem] md:pb-20 md:px-36">
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
                  <g clipPath="url(#clip0_3623_70542)">
                    <path
                      d="M78.0369 38.59C77.8055 37.4485 76.1279 36.5012 75.3181 36.1702L71.8957 37.6068L69.4759 40.3256L71.0669 48.1732L60.0471 37.7807L49.8854 27.957L47.0317 28.5356L44.4673 30.5409L45.1905 34.108L39.8975 29.9819L36.61 28.4202L33.3322 30.5702L33.1973 33.5685L35.9258 39.7L31.6453 40.5678L30.0836 43.8554L31.5202 47.2778L34.9622 53.2647L31.5397 54.7013L30.4022 56.4174L31.1253 59.9844L45.5871 76.3637L57.6096 88.0384L65.4669 90.1591L72.8903 90.1396L79.4459 85.8396L86.8499 78.3966L86.9652 67.9749L82.0672 51.1422C80.8202 47.4337 78.2683 39.7314 78.0369 38.59Z"
                      fill="white"
                    />
                    <path
                      d="M86.886 62.367L79.7995 38.8159C79.3722 37.4012 78.4196 36.2036 77.1371 35.4691C75.8547 34.7346 74.3397 34.5188 72.9032 34.8661C71.4667 35.2133 70.2175 36.0973 69.4122 37.3365C68.6069 38.5757 68.3064 40.0762 68.5725 41.5299L69.072 44.8946C63.833 39.276 53.1702 27.8696 53.0429 27.7333C52.5179 27.1625 51.8837 26.703 51.1778 26.382C50.4719 26.061 49.7087 25.8851 48.9335 25.8647C48.1766 25.8408 47.4227 25.969 46.7163 26.2419C46.0099 26.5147 45.3656 26.9266 44.8213 27.4532C43.8704 28.3716 43.2605 29.5864 43.092 30.8977L41.2 28.8603C40.6751 28.2896 40.041 27.8301 39.3351 27.5091C38.6293 27.1881 37.8662 27.0121 37.0911 26.9916C36.334 26.9675 35.5797 27.0957 34.873 27.3686C34.1664 27.6415 33.5218 28.0536 32.9774 28.5804C31.8699 29.6707 31.2314 31.1499 31.1975 32.7036C31.1636 34.2574 31.737 35.763 32.7958 36.9006L33.874 38.0613C32.5528 38.1579 31.3074 38.7154 30.3552 39.6364C29.2477 40.7267 28.6092 42.2059 28.5753 43.7597C28.5414 45.3134 29.1148 46.8191 30.1737 47.9566L33.8614 51.9272C32.5398 52.0222 31.2939 52.5799 30.3426 53.5024C29.235 54.5925 28.5962 56.0717 28.5621 57.6255C28.528 59.1793 29.1012 60.6851 30.16 61.8228L50.0193 83.2178C55.5146 89.1337 64.2206 92.6412 72.3043 91.0023C75.4858 90.3572 78.4551 88.9254 80.941 86.8377C80.961 86.8208 80.9809 86.8034 81 86.785L82.5082 85.3329C86.2483 81.7308 88.1693 78.1244 88.7355 73.6412C89.1506 70.3612 88.4448 67.5915 87.621 64.8083C87.23 63.4844 86.886 62.367 86.886 62.367ZM86.5693 73.3673C86.0692 77.3219 84.3497 80.5265 80.9932 83.7594L79.5144 85.1833C70.7795 92.4195 58.4767 89.1153 51.6191 81.7309L31.7611 60.3367C31.0893 59.6197 30.7236 58.6691 30.7416 57.6867C30.7596 56.7043 31.16 55.7677 31.8576 55.0759C32.5604 54.4278 33.4907 54.0837 34.446 54.1186C35.4013 54.1534 36.3041 54.5643 36.9578 55.2618L49.5876 68.8614C49.7872 69.0694 50.0598 69.1916 50.3478 69.2022C50.6358 69.2128 50.9167 69.1111 51.1311 68.9184C51.2361 68.8208 51.3209 68.7034 51.3806 68.573C51.4403 68.4426 51.4737 68.3017 51.479 68.1584C51.4842 68.0151 51.4612 67.8722 51.4112 67.7378C51.3612 67.6033 51.2852 67.4801 51.1875 67.3751L31.7735 46.4703C31.1016 45.7534 30.7357 44.8027 30.7537 43.8204C30.7716 42.838 31.1719 41.9013 31.8696 41.2095C32.5727 40.5601 33.5043 40.2155 34.4608 40.251C35.4173 40.2866 36.3208 40.6993 36.9738 41.3991L56.3913 62.3071C56.5912 62.5144 56.8636 62.6362 57.1514 62.6469C57.4392 62.6576 57.72 62.5564 57.9348 62.3646C58.0399 62.2669 58.1247 62.1496 58.1844 62.0192C58.2441 61.8888 58.2775 61.7479 58.2827 61.6046C58.288 61.4613 58.2649 61.3183 58.2149 61.1839C58.1649 61.0495 58.0889 60.9263 57.9912 60.8212L34.3964 35.4146C33.7243 34.6978 33.3583 33.747 33.3762 32.7645C33.3941 31.782 33.7945 30.8452 34.4923 30.1533C35.196 29.503 36.1288 29.1582 37.0863 29.1945C38.0438 29.2308 38.9479 29.6454 39.6002 30.3472L63.1946 55.7539C63.3943 55.9616 63.6668 56.0836 63.9548 56.0942C64.2427 56.1048 64.5235 56.0032 64.738 55.8108C64.9502 55.6137 65.0753 55.3403 65.086 55.0509C65.0967 54.7615 64.992 54.4797 64.795 54.2674L46.239 34.2866C45.5669 33.5698 45.2009 32.619 45.2189 31.6365C45.237 30.654 45.6376 29.7174 46.3356 29.0257C46.6713 28.701 47.0689 28.4471 47.5047 28.2791C47.9405 28.1111 48.4057 28.0325 48.8725 28.0479C49.3582 28.0612 49.8363 28.1719 50.2783 28.3736C50.7203 28.5753 51.1173 28.8638 51.4457 29.2219C51.6008 29.3882 67.0367 45.9011 69.8681 48.9535C70.0267 49.1243 70.2359 49.2399 70.4649 49.2833C70.694 49.3267 70.9309 49.2957 71.141 49.1947C71.3511 49.0938 71.5235 48.9283 71.6327 48.7223C71.742 48.5164 71.7825 48.2809 71.7483 48.0503L70.729 41.1869C70.5511 40.2786 70.7296 39.3366 71.2277 38.5565C71.7257 37.7764 72.505 37.2179 73.4038 36.997C74.3026 36.7761 75.2519 36.9097 76.0549 37.3701C76.8578 37.8304 77.4527 38.5822 77.7161 39.4695C77.7161 39.4695 85.1382 64.1129 85.5272 65.4272C86.311 68.0764 86.9311 70.5031 86.5693 73.3673ZM39.3297 87.7307C36.7368 87.4102 34.1701 85.2378 32.6319 83.3108C30.8376 81.0706 29.9966 78.2145 30.2907 75.3595C30.3224 75.0716 30.2385 74.7829 30.0574 74.5568C29.8763 74.3308 29.6128 74.186 29.3249 74.1543C29.0371 74.1225 28.7483 74.2064 28.5223 74.3875C28.2963 74.5686 28.1515 74.8321 28.1197 75.12C27.7643 78.5495 28.7722 81.9812 30.9257 84.6739C31.8017 85.772 34.9798 89.3941 39.0622 89.8984C39.2046 89.9159 39.3489 89.9053 39.4872 89.867C39.6254 89.8288 39.7547 89.7637 39.8678 89.6755C39.9808 89.5873 40.0754 89.4776 40.1461 89.3528C40.2168 89.2281 40.2622 89.0906 40.2798 88.9483C40.2973 88.8059 40.2867 88.6615 40.2484 88.5233C40.2102 88.3851 40.1451 88.2558 40.0569 88.1427C39.9687 88.0296 39.859 87.9351 39.7342 87.8644C39.6095 87.7937 39.472 87.7483 39.3297 87.7307ZM40.92 81.8366C39.5773 81.671 38.2229 80.5128 37.4014 79.4834C36.4531 78.3004 36.0083 76.7919 36.1628 75.2836C36.1796 75.1406 36.1679 74.9957 36.1284 74.8572C36.0889 74.7188 36.0225 74.5895 35.9328 74.4768C35.8432 74.3641 35.7322 74.2702 35.6061 74.2006C35.4801 74.131 35.3415 74.0871 35.1984 74.0712C35.0553 74.0554 34.9104 74.068 34.7722 74.1084C34.634 74.1488 34.5051 74.2161 34.3931 74.3064C34.281 74.3968 34.1878 74.5084 34.1191 74.6349C34.0503 74.7614 34.0072 74.9003 33.9923 75.0435C33.7756 77.1262 34.387 79.2105 35.6945 80.846C36.2233 81.5087 38.1437 83.6946 40.6526 84.0043C40.9395 84.0364 41.2275 83.9549 41.4551 83.7772C41.6827 83.5996 41.8317 83.34 41.8703 83.0539C41.9056 82.7664 41.8253 82.4768 41.6471 82.2485C41.4689 82.0203 41.2074 81.8721 40.92 81.8366ZM87.0103 28.2223C86.021 27.2441 82.4791 24.0533 78.4427 24.0506C78.1531 24.0504 77.8753 24.1653 77.6704 24.37C77.4655 24.5746 77.3503 24.8523 77.3501 25.1419C77.35 25.4315 77.4649 25.7093 77.6695 25.9142C77.8742 26.1191 78.1519 26.2343 78.4415 26.2345C80.9876 26.2363 83.7442 28.065 85.4753 29.7757C87.502 31.779 88.674 34.4894 88.7454 37.3382C88.748 37.4816 88.7788 37.6231 88.8361 37.7546C88.8934 37.8861 88.976 38.005 89.0793 38.1045C89.1825 38.2041 89.3044 38.2823 89.4379 38.3348C89.5714 38.3872 89.7139 38.4128 89.8573 38.4102C89.9238 38.4091 89.99 38.4018 90.0551 38.3884C90.3052 38.3375 90.5295 38.2005 90.6891 38.0014C90.8487 37.8022 90.9335 37.5535 90.9287 37.2983C90.8455 33.8801 89.4411 30.627 87.0103 28.2223ZM77.6389 30.0542C77.3492 30.0542 77.0714 30.1692 76.8665 30.3739C76.6616 30.5787 76.5465 30.8565 76.5464 31.1461C76.5463 31.4358 76.6613 31.7136 76.8661 31.9185C77.0709 32.1234 77.3486 32.2385 77.6383 32.2386C78.9515 32.2397 80.4059 33.2149 81.3289 34.1269C82.4004 35.1854 83.0202 36.6178 83.0583 38.1235C83.0609 38.2669 83.0917 38.4084 83.1489 38.5398C83.2062 38.6713 83.2888 38.7902 83.392 38.8897C83.4952 38.9893 83.617 39.0675 83.7504 39.12C83.8839 39.1725 84.0264 39.1982 84.1697 39.1956C84.3131 39.193 84.4546 39.1622 84.586 39.1049C84.7175 39.0477 84.8364 38.9651 84.9359 38.8619C85.0355 38.7587 85.1137 38.6369 85.1662 38.5034C85.2187 38.37 85.2444 38.2275 85.2418 38.0842C85.1918 36.0088 84.3393 34.0335 82.8634 32.5736C82.2663 31.9832 80.1236 30.0557 77.6389 30.0542Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3623_70542">
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

              <div className="flex flex-col space-y-10 text-primaryBg md:space-y-14">
                <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                  Your cancellation request has been sent to a Health Insurance
                  Specialist
                </h1>

                <div className="text-center md:text-lg text-primaryBg">
                  <p>
                    Your cancellation has been requested and it will take effect
                    on
                    <span className="font-bold"> {effectiveDate}</span> at 4 PM.
                  </p>
                  <br />
                  <p>
                    We’ll send you an email to confirm your cancellation soon.
                    You’ll be refunded via your credit card within 5-10 business
                    days. Once the refund has been processed, we’ll send you a
                    final cancellation confirmation email with a credit note
                    attached.
                  </p>
                </div>

                <div className="flex w-full flex-row justify-center">
                  <div className="w-[10.5rem]">
                    <Button
                      onClick={() => {
                        navigate(`/my-policy?policyId=${policyId}`);
                      }}
                      label="Back to home"
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
        </div>
      </div>
    </div>
  );
};

export default CancelPolicyStep3;
