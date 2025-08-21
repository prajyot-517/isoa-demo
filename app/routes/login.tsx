import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import EmailAddressIcon from "~/assets/SVGIcons/EmailAddressIcon";
import TickIcon from "~/assets/SVGIcons/TickIcon";
import Button from "~/components/common/Button";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { authenticateUser } from "~/services/authentication.server";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  let response = {};

  if (session.has("error")) {
    response = {
      status: { statusCode: 400, description: session.get("error") },
    };
  } else if (session.has("success")) {
    response = {
      status: { statusCode: 200, description: session.get("success") },
    };
  }

  return json(response, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const submit = useSubmit();
  const { setToastProps } = useToast();
  const navigate = useNavigate();
  const actionData: any = useActionData();
  const response: any = useLoaderData();

  const { resetState } = useAppContext();

  useEffect(() => {
    resetState();
  }, []);

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
  }, [actionData]);

  useEffect(() => {
    if (response?.status?.statusCode === 400) {
      setToastProps({
        message: response?.status?.description,
        variant: "error",
      });
    }
  }, [response]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = event.target.value;
    setEmail(emailInput);
    setIsValidEmail(validateEmail(emailInput));
  };

  const handleNext = () => {
    const formData = new FormData();
    formData.append("email", email);
    submit(formData, { method: "post" });
  };

  const handleKeyDown = (e: any) => {
    if (e?.key === " ") {
      e.preventDefault();
    }
    if (e?.key === "Enter" && email !== "" && isValidEmail) {
      handleNext();
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="flex flex-col space-y-10 py-[120px] sm:px-10 md:px-28 md:space-y-16 lg:px-40 lg:py-[164px]">
            <div className="flex justify-center">
              <div className="relative px-8 pt-28 pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-[8.75rem] md:pb-20">
                {/* Logo icon */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <EmailAddressIcon styles="w-[120px] h-[120px] md:w-[164px] md:h-[164px]" />
                </div>

                <div className="flex flex-col w-full xl:px-16 space-y-10 text-primaryBg md:space-y-16">
                  <div className="flex flex-col  space-y-8 md:space-y-12">
                    <h1 className="font-black text-[1.625rem] text-center md:text-4xl">
                      To login, please provide your email
                    </h1>
                    <Form
                      method="post"
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          autoComplete="on"
                          value={email}
                          onChange={handleChange}
                          className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none ${
                            email !== "" && !isValidEmail
                              ? "border-[#CC0000]"
                              : email !== "" && isValidEmail
                              ? "border-primaryBg pr-10"
                              : "border-grayCustom"
                          }`}
                          placeholder="email@address.com"
                          onKeyDown={(e) => handleKeyDown(e)}
                        />
                        {email !== "" && isValidEmail && (
                          <span className="absolute inset-y-0 right-3 flex items-center">
                            <TickIcon />
                          </span>
                        )}
                        {!isValidEmail && (
                          <p className="text-[#CC0000] mt-1">
                            Please enter a valid email address.
                          </p>
                        )}
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full sm:justify-end">
              <div className="w-60">
                <Button
                  onClick={() => handleNext()}
                  label="Next"
                  variant="filled"
                  disabled={!isValidEmail || email === ""}
                  showTooltip={!isValidEmail || email === ""}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 md:px-6 text-primaryBg bg-white flex justify-center items-center">
        <p className="font-bold text-base md:text-xl">
          Don’t have a quote or policy?{" "}
          <span
            className="text-primaryBg underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Get a quote
          </span>
        </p>
      </div>
    </div>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));

  try {
    const formData = await request.formData();
    const email = formData.get("email");

    await authenticateUser(session, email);
    session.set("username", email);
    session.set("isExistingUser", true);

    return redirect("/verify-email", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        response: {
          status: {
            message: "Error",
            statusCode: 400,
            description: "Internal Server Error",
          },
        },
      },
      {
        headers: { "Set-Cookie": await commitSession(session) },
      }
    );
  }
};

export default Login;
