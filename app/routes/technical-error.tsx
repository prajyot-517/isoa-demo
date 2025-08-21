import { LoaderFunctionArgs, json } from "@remix-run/node";
import TechnicalErrorComponent from "~/components/common/TechnicalError";
import { destroySession, getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  let response = {};

  return json(response, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

const TechnicalError = () => {
  return <TechnicalErrorComponent />;
};

export default TechnicalError;
