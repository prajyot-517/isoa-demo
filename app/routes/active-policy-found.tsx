import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import PolicyFoundIcon from "~/assets/SVGIcons/PolicyFoundIcon";
import AdditionalInsuranceCTA from "~/components/common/AdditionalInsuranceCTA";
import Button from "~/components/common/Button";
import { useToast } from "~/context/ContextProvider";
import { verifyAuthToken } from "~/services/authentication.server";
import { getPolicyById } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { isFutureDate } from "~/utils";

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

const ActivePolicyFound = () => {
  const navigate = useNavigate();
  const response = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const policyId = searchParams.get("policyId");
  const { setToastProps } = useToast();

  //For backend errors
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
    }
  }, [response]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col space-y-10 py-[120px] sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
            <div className="flex justify-center">
              <div className="relative px-6 md:px-10 pt-28 pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[8.75rem] md:pb-20">
                {/* Logo icon */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <PolicyFoundIcon />
                </div>

                <div className="flex flex-col w-full items-center  xl:px-16 space-y-10 text-primaryBg md:space-y-16">
                  <div className="flex flex-col  space-y-[0.625rem] md:space-y-4">
                    <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                      You've already got an existing policy with us
                    </h1>

                    <p className="font-bold md:text-2xl text-center">
                      Your policy{" "}
                      {isFutureDate(
                        response?.data?.policies[0]?.policy_inception_date
                      )
                        ? "will start"
                        : "started"}{" "}
                      on{" "}
                      <span className="text-primaryBg">
                        {response?.data?.policies[0]?.policy_inception_date}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="w-60">
                    <Button
                      onClick={() =>
                        navigate(`/my-policy?policyId=${policyId}`)
                      }
                      label="View policy"
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

      <AdditionalInsuranceCTA />
    </div>
  );
};

export default ActivePolicyFound;
