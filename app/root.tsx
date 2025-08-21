import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import "./theme/tailwind.css";
import { ReactNode, useEffect } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import {
  AppProvider,
  useAppContext,
  useToast,
} from "./context/ContextProvider";
import Toast from "./components/common/Toast";
import FastLoader from "./components/common/FastLoader";
import TechnicalErrorComponent from "./components/common/TechnicalError";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

interface props {
  children: ReactNode;
}

const Layout: React.FC<props> = ({ children }: props) => {
  const location = useLocation();
  const { setStepState } = useAppContext();

  const { toastProps, setToastProps } = useToast();
  const isHomeRoute = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("business-details-1")) {
      setStepState({ currentStep: 1, subStep: 1 });
    } else if (pathname.includes("business-details-2")) {
      setStepState({ currentStep: 1, subStep: 2 });
    } else if (pathname.includes("business-details-3")) {
      setStepState({ currentStep: 1, subStep: 3 });
    } else if (pathname.includes("quote")) {
      setStepState({ currentStep: 2, subStep: 1 });
    } else if (pathname.includes("contact-details")) {
      setStepState({ currentStep: 3, subStep: 1 });
    } else if (pathname.includes("final-questions")) {
      setStepState({ currentStep: 4, subStep: 1 });
    } else if (pathname.includes("summary")) {
      setStepState({ currentStep: 5, subStep: 1 });
    }
  }, [location, setStepState]);

  return (
    <div className=" bg-[#F8FAFC] flex flex-col min-h-screen">
      <div>
        <Header />
      </div>
      <div className="">{children}</div>
      <div className="flex flex-1 items-end">{!isHomeRoute && <Footer />}</div>

      {/* toast component */}
      {toastProps && (
        <Toast
          label={toastProps.message}
          variant={
            ["success", "warning", "error"].includes(toastProps.variant)
              ? toastProps.variant
              : "warning"
          }
          onToastClose={() => {
            setToastProps(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  const navigation = useNavigation();
  const location = useLocation();

  const isFetchingData =
    navigation.formData?.get("isOccupationSearch") === "true" ||
    navigation.formData?.get("isPollingCall") === "true";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>MYOB Portal</title>
        <link rel="icon" href="/myob_icon.ico" />
      </head>
      <body>
        <AppProvider>
          <Layout>
            {navigation?.state !== "idle" &&
              !isFetchingData &&
              !location.pathname?.includes("quote-processing") && (
                <FastLoader />
              )}
            <Outlet />
          </Layout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </AppProvider>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (typeof window == "undefined") {
    console.error(error);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="icon" href="/myob_icon.ico" />
      </head>
      <body>
        <div>
          <Header />
        </div>
        <div className="">
          <TechnicalErrorComponent />
        </div>
        <div className="flex flex-1 items-end">
          <Footer />
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
      </body>
    </html>
  );
}
