import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
	json,
	useLoaderData,
	useNavigate
} from "@remix-run/react";
import { useEffect, useState } from "react";
import PaymentFailedIcon from "~/assets/SVGIcons/PaymentFailedIcon";
import Button from "~/components/common/Button";
import { verifyAuthToken } from "~/services/authentication.server";
import { getPaymentGatewayResult } from "~/services/quote.api";
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
  const sessionId: any = searchParams.get("sessionId");
  const response = await getPaymentGatewayResult(session, sessionId);

  if (response?.status == 200) {
    return json(response, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json(
      {
        response: {
          status: 400,
          message: "Error-Payment gateway data not retrieved!",
        },
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}

const PaymentFailed = () => {
  const navigate = useNavigate();
  const loaderData: any = useLoaderData();
  const [quoteId, setQuoteId] = useState("");

  useEffect(() => {
    if (loaderData?.data?.metaData?.length > 0) {
      const quoteId = loaderData?.data?.metaData[0];
      setQuoteId(quoteId);
    }
  }, [loaderData]);

  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <PaymentFailedIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            Payment failed
          </h1>
          <p className="font-bold text-center md:text-lg">
            We're sorry, there is an error processing your payment.
            <br />
            Please try again.
          </p>
        </div>

        <div className="w-60">
          <Button
            onClick={() => {
              navigate("/quote?quoteId=" + quoteId);
            }}
            label="Try again"
            variant="filled"
            disabled={false}
            showTooltip={false}
            tooltipContent=""
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
