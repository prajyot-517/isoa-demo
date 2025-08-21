import { useEffect, useState } from "react";
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
import QuoteFoundIcon from "~/assets/SVGIcons/QuoteFoundIcon";
import Button from "~/components/common/Button";
import { SUCCESS } from "~/constants/string";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { getQuoteById, restartQuote } from "~/services/quote.api";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import { verifyAuthToken } from "~/services/authentication.server";
import RestartQuoteModal from "~/components/common/RestartQuoteModal";

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
  const quoteId: any = searchParams.get("quoteId");
  const response = await getQuoteById(session, quoteId);
  return json(response, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const ActiveQuoteFound = () => {
  const [isRestartQuoteClikced, setIsRestartQuoteClikced] = useState(false);

  const navigate = useNavigate();
  const response = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const { setToastProps } = useToast();
  const submit = useSubmit();
  const actionData: any = useActionData();
  const { resetState } = useAppContext();

  const isPhoneVerified = true;

  //For backend errors
  useEffect(() => {
    if (
      response?.status?.statusCode !== 400 &&
      response?.status?.statusCode !== 200 &&
      response?.status?.description
    ) {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (actionData?.response?.isQuoteRestarted) {
        resetState();
        navigate("/");
      }
    }
  }, [actionData]);

  const handleRestartQuote = () => {
    const formData = new FormData();
    formData.append(
      "restartQuotePayload",
      JSON.stringify({ policy_id: quoteId })
    );
    formData.append("restartQuote", "true");
    submit(formData, { method: "POST" });
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col space-y-10 py-[120px] sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
            <div className="flex justify-center">
              <div className="relative px-6 pt-28 pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[8.75rem] md:pb-20">
                {/* Logo icon */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <QuoteFoundIcon />
                </div>

                <div className="flex flex-col w-full  xl:px-16 space-y-10 text-primaryBg md:space-y-16">
                  <div className="flex flex-col  space-y-[0.625rem] md:space-y-4">
                    <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                      You've already got an existing quote
                    </h1>
                    <p className="font-bold md:text-2xl text-center">
                      Your quote was generated on{" "}
                      {response?.data?.policies[0]?.created_date}.
                    </p>
                    <p className="font-bold md:text-2xl text-center">
                      It's valid until{" "}
                      <span className="text-primaryBg">
                        {
                          response?.data?.policies[0]?.quote
                            ?.quote_expiration_date
                        }
                      </span>
                      .
                    </p>
                  </div>

                  <p className="font-bold text-lg text-center">
                    Want to generate another quote?{" "}
                    <span
                      className="text-secondary underline cursor-pointer"
                      onClick={() => setIsRestartQuoteClikced(true)}
                    >
                      Restart quote
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between ">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() =>
                    isPhoneVerified
                      ? navigate("/verify-phone-number", {
                          state: { isActiveCustomer: true },
                        })
                      : navigate("/verify-email", {
                          state: { isActiveCustomer: true },
                        })
                  }
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={() => navigate(`/quote?quoteId=${quoteId}`)}
                  label="View quote"
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

      <RestartQuoteModal
        openModal={isRestartQuoteClikced}
        setOpenModal={setIsRestartQuoteClikced}
        handleRestartQuote={handleRestartQuote}
      />
    </div>
  );
};

export default ActiveQuoteFound;

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

  const restartQuotePayload: any = formData.get("restartQuotePayload");
  const isRestartQuote = formData.get("restartQuote") === "true";

  let response;
  let resData;

  const responseData: any = formData.get("response");
  response = JSON.parse(responseData);

  if (isRestartQuote) {
    const data = JSON.parse(restartQuotePayload);

    resData = await restartQuote(session, data);

    if (resData?.status?.message === SUCCESS) {
      return json(
        {
          response: { isQuoteRestarted: true },
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
  }
}
