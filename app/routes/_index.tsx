import { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Loading from "~/assets/SVGIcons/Loading";
import { useAppContext } from "~/context/ContextProvider";

export const meta: MetaFunction = () => {
  return [
    { title: "MYOB Portal" },
    { name: "description", content: "Welcome to MYOB Portal!" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const { resetState } = useAppContext();
  const [showComponent, setShowComponent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponent(false);
      navigate("/business-details-1?quoteId=new-quote");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    resetState();
  });

  return (
    <div>
      {showComponent && (
        <div className="flex flex-col justify-center items-center mt-16">
          <Loading />

          <div className="flex gap-2 mt-12">
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader" />
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-200" />
            <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-400" />
          </div>
        </div>
      )}
    </div>
  );
}
