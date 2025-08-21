import { useEffect, useState } from "react";
import UpgardLogo from "./Icons/UpgardLogo";
import { Link } from "@remix-run/react";
import { ENDORSEMENT, RENEWAL } from "~/constants/string";

const ScoreMeter = (score: any) => {
  if (score > 800) {
    return (
      <svg
        width="309"
        height="159"
        viewBox="0 0 309 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5938 159.195C11.0415 159.195 10.5934 158.747 10.5971 158.195C10.7824 130.032 18.7887 102.474 33.7227 78.596C34.0155 78.1278 34.6339 77.9895 35.1002 78.2854L77.7623 105.36C78.2286 105.656 78.3661 106.273 78.0749 106.743C68.48 122.203 63.3095 140 63.1266 158.195C63.121 158.747 62.6738 159.195 62.1215 159.195L11.5938 159.195Z"
          fill="#ADD191"
        />
        <path
          d="M303.594 155.195C304.146 155.195 304.594 154.747 304.59 154.195C304.405 126.032 296.399 98.4739 281.465 74.596C281.172 74.1278 280.554 73.9895 280.087 74.2854L237.425 101.36C236.959 101.656 236.821 102.273 237.113 102.743C246.708 118.203 251.878 136 252.061 154.195C252.066 154.747 252.514 155.195 253.066 155.195L303.594 155.195Z"
          fill="#69BE28"
        />
        <path
          d="M36.7561 72.864C36.3008 72.5514 36.1844 71.9295 36.5001 71.4763C53.3671 47.2627 78.152 26.8449 105.954 15.8734C106.473 15.6683 107.058 15.9339 107.251 16.4584L124.545 63.5871C124.732 64.0958 124.479 64.66 123.978 64.866C106.327 72.1225 90.7586 85.5698 79.801 101.214C79.4842 101.666 78.8624 101.782 78.4071 101.469L36.7561 72.864Z"
          fill="#ADD191"
        />
        <path
          d="M111.783 15.196C111.611 14.6711 111.898 14.106 112.424 13.9377C140.487 4.96416 170.553 4.33982 198.964 12.1406C199.497 12.2869 199.807 12.8396 199.657 13.3712L185.958 62.0067C185.809 62.5383 185.256 62.8472 184.723 62.7029C166.34 57.7239 146.913 58.1274 128.752 63.8652C128.226 64.0315 127.661 63.7458 127.489 63.2208L111.783 15.196Z"
          fill="#ADD191"
        />
        <path
          d="M204.587 14.4823C204.759 13.9447 205.343 13.6559 205.873 13.8487C234.718 24.3343 258.812 44.3923 276.013 68.7428C276.331 69.1939 276.22 69.8171 275.767 70.133L234.321 99.0341C233.868 99.35 233.244 99.2379 232.925 98.7874C221.788 83.0859 207.679 70.8966 189.784 63.8428C189.29 63.6482 189.027 63.1044 189.189 62.5988L204.587 14.4823Z"
          fill="#ADD191"
        />
        <path
          d="M151.929 110.107L211.003 122.501C235.937 128.791 247.466 131.025 252.504 131.541C258.004 132.5 255.1 130.226 254.504 130.001L158.459 99.4736C158.306 99.401 154.784 98.4538 154.608 98.404C152.142 97.7127 151.63 98.2806 150.21 103.391C149.087 107.434 148.918 109.306 151.387 110.001C151.564 110.05 151.743 110.085 151.929 110.107Z"
          fill="#3B3B3B"
        />
      </svg>
    );
  } else if (score > 600) {
    return (
      <svg
        width="309"
        height="159"
        viewBox="0 0 309 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5938 159.195C11.0415 159.195 10.5934 158.747 10.5971 158.195C10.7824 130.032 18.7887 102.474 33.7227 78.596C34.0155 78.1278 34.6339 77.9895 35.1002 78.2854L77.7623 105.36C78.2286 105.656 78.3661 106.273 78.0749 106.743C68.48 122.203 63.3095 140 63.1266 158.195C63.121 158.747 62.6738 159.195 62.1215 159.195L11.5938 159.195Z"
          fill="#DEE585"
        />
        <path
          d="M303.594 155.195C304.146 155.195 304.594 154.747 304.59 154.195C304.405 126.032 296.399 98.4739 281.465 74.596C281.172 74.1278 280.554 73.9895 280.087 74.2854L237.425 101.36C236.959 101.656 236.821 102.273 237.113 102.743C246.708 118.203 251.878 136 252.061 154.195C252.066 154.747 252.514 155.195 253.066 155.195L303.594 155.195Z"
          fill="#F5F5F5"
        />
        <path
          d="M36.7561 72.864C36.3008 72.5514 36.1844 71.9295 36.5001 71.4763C53.3671 47.2627 78.152 26.8449 105.954 15.8734C106.473 15.6683 107.058 15.9339 107.251 16.4584L124.545 63.5871C124.732 64.0958 124.479 64.66 123.978 64.866C106.327 72.1225 90.7586 85.5698 79.801 101.214C79.4842 101.666 78.8624 101.782 78.4071 101.469L36.7561 72.864Z"
          fill="#DEE585"
        />
        <path
          d="M111.783 15.196C111.611 14.6711 111.898 14.106 112.424 13.9377C140.487 4.96416 170.553 4.33982 198.964 12.1406C199.497 12.2869 199.807 12.8396 199.657 13.3712L185.958 62.0067C185.809 62.5383 185.256 62.8472 184.723 62.7029C166.34 57.7239 146.913 58.1274 128.752 63.8652C128.226 64.0315 127.661 63.7458 127.489 63.2208L111.783 15.196Z"
          fill="#DEE585"
        />
        <path
          d="M204.587 14.4823C204.759 13.9447 205.343 13.6559 205.873 13.8487C234.718 24.3343 258.812 44.3923 276.013 68.7428C276.331 69.1939 276.22 69.8171 275.767 70.133L234.321 99.0341C233.868 99.35 233.244 99.2379 232.925 98.7874C221.788 83.0859 207.679 70.8966 189.784 63.8428C189.29 63.6482 189.027 63.1044 189.189 62.5988L204.587 14.4823Z"
          fill="#AFC910"
        />
        <path
          d="M169.446 115.524L216.5 72.1563C217.387 71.3338 216.466 69.5216 215.5 70.158L164.688 103.988C164.539 104.07 161.702 106.36 161.558 106.474C159.548 108.061 159.706 108.809 163.003 112.964C165.612 116.25 167.027 117.488 169.041 115.9C169.185 115.787 169.318 115.662 169.446 115.524Z"
          fill="#3B3B3B"
        />
      </svg>
    );
  } else if (score > 400) {
    return (
      <svg
        width="309"
        height="159"
        viewBox="0 0 309 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5938 156.195C11.0415 156.195 10.5934 155.747 10.5971 155.195C10.7824 127.032 18.7887 99.4739 33.7227 75.596C34.0155 75.1278 34.6339 74.9895 35.1002 75.2854L77.7623 102.36C78.2286 102.656 78.3661 103.273 78.0749 103.743C68.48 119.203 63.3095 137 63.1266 155.195C63.121 155.747 62.6738 156.195 62.1215 156.195L11.5938 156.195Z"
          fill="#FFD755"
        />
        <path
          d="M303.594 152.195C304.146 152.195 304.594 151.747 304.59 151.195C304.405 123.032 296.399 95.4739 281.465 71.596C281.172 71.1278 280.554 70.9895 280.087 71.2854L237.425 98.3596C236.959 98.6555 236.821 99.2734 237.113 99.7427C246.708 115.203 251.878 133 252.061 151.195C252.066 151.747 252.514 152.195 253.066 152.195L303.594 152.195Z"
          fill="#F5F5F5"
        />
        <path
          d="M36.7561 69.864C36.3008 69.5514 36.1844 68.9295 36.5001 68.4763C53.3671 44.2627 78.152 23.8449 105.954 12.8734C106.473 12.6683 107.058 12.9339 107.251 13.4584L124.545 60.5871C124.732 61.0958 124.479 61.66 123.978 61.866C106.327 69.1225 90.7586 82.5698 79.801 98.2139C79.4842 98.6663 78.8624 98.7816 78.4071 98.469L36.7561 69.864Z"
          fill="#FFD755"
        />
        <path
          d="M111.783 12.196C111.611 11.6711 111.898 11.106 112.424 10.9377C140.487 1.96416 170.553 1.33982 198.964 9.14063C199.497 9.28686 199.807 9.83965 199.657 10.3712L185.958 59.0067C185.809 59.5383 185.256 59.8472 184.723 59.7029C166.34 54.7239 146.913 55.1274 128.752 60.8652C128.226 61.0315 127.661 60.7458 127.489 60.2208L111.783 12.196Z"
          fill="#FFB902"
        />
        <path
          d="M204.587 11.4823C204.759 10.9447 205.343 10.6559 205.873 10.8487C234.718 21.3343 258.812 41.3923 276.013 65.7428C276.331 66.1939 276.22 66.8171 275.767 67.133L234.321 96.0341C233.868 96.35 233.244 96.2379 232.925 95.7874C221.788 80.0859 207.679 67.8966 189.784 60.8428C189.29 60.6482 189.027 60.1044 189.189 59.5988L204.587 11.4823Z"
          fill="#F5F5F5"
        />
        <path
          d="M163.716 108.117L159.126 48.0702C159.034 46.8637 156.774 46.2103 156.671 47.3633L151.723 104.67C151.694 104.838 151.723 108.484 151.723 108.668C151.716 111.228 152.4 111.57 157.704 111.571C161.901 111.571 163.75 111.232 163.758 108.668C163.759 108.485 163.744 108.302 163.716 108.117Z"
          fill="#3B3B3B"
        />
      </svg>
    );
  } else if (score > 200) {
    return (
      <svg
        width="309"
        height="159"
        viewBox="0 0 309 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5938 156.195C11.0415 156.195 10.5934 155.747 10.5971 155.195C10.7824 127.032 18.7887 99.4739 33.7227 75.596C34.0155 75.1278 34.6339 74.9895 35.1002 75.2854L77.7623 102.36C78.2286 102.656 78.3661 103.273 78.0749 103.743C68.48 119.203 63.3095 137 63.1266 155.195C63.121 155.747 62.6738 156.195 62.1215 156.195L11.5938 156.195Z"
          fill="#FFC588"
        />
        <path
          d="M303.594 152.195C304.146 152.195 304.594 151.747 304.59 151.195C304.405 123.032 296.399 95.4739 281.465 71.596C281.172 71.1278 280.554 70.9895 280.087 71.2854L237.425 98.3596C236.959 98.6555 236.821 99.2734 237.113 99.7427C246.708 115.203 251.878 133 252.061 151.195C252.066 151.747 252.514 152.195 253.066 152.195L303.594 152.195Z"
          fill="#F5F5F5"
        />
        <path
          d="M36.7561 69.864C36.3008 69.5514 36.1844 68.9295 36.5001 68.4763C53.3671 44.2627 78.152 23.8449 105.954 12.8734C106.473 12.6683 107.058 12.9339 107.251 13.4584L124.545 60.5871C124.732 61.0958 124.479 61.66 123.978 61.866C106.327 69.1225 90.7586 82.5698 79.801 98.2139C79.4842 98.6663 78.8624 98.7816 78.4071 98.469L36.7561 69.864Z"
          fill="#FD8204"
        />
        <path
          d="M111.783 12.196C111.611 11.6711 111.898 11.106 112.424 10.9377C140.487 1.96416 170.553 1.33982 198.964 9.14063C199.497 9.28686 199.807 9.83965 199.657 10.3712L185.958 59.0067C185.809 59.5383 185.256 59.8472 184.723 59.7029C166.34 54.7239 146.913 55.1274 128.752 60.8652C128.226 61.0315 127.661 60.7458 127.489 60.2208L111.783 12.196Z"
          fill="#F5F5F5"
        />
        <path
          d="M204.587 11.4823C204.759 10.9447 205.343 10.6559 205.873 10.8487C234.718 21.3343 258.812 41.3923 276.013 65.7428C276.331 66.1939 276.22 66.8171 275.767 67.133L234.321 96.0341C233.868 96.35 233.244 96.2379 232.925 95.7874C221.788 80.0859 207.679 67.8966 189.784 60.8428C189.29 60.6482 189.027 60.1044 189.189 59.5988L204.587 11.4823Z"
          fill="#F5F5F5"
        />
        <path
          d="M153.956 111.27L102.368 73.4075C101.394 72.6889 102.108 70.7855 103.14 71.3103L157.4 99.276C157.557 99.3401 160.632 101.301 160.788 101.397C162.962 102.751 162.888 103.512 160.074 108.008C157.846 111.564 156.578 112.952 154.401 111.598C154.245 111.502 154.098 111.392 153.956 111.27Z"
          fill="#3B3B3B"
        />
      </svg>
    );
  } else {
    return (
      <svg
        width="309"
        height="159"
        viewBox="0 0 309 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5938 156.195C11.0415 156.195 10.5934 155.747 10.5971 155.195C10.7824 127.032 18.7887 99.4739 33.7227 75.596C34.0155 75.1278 34.6339 74.9895 35.1002 75.2854L77.7623 102.36C78.2286 102.656 78.3661 103.273 78.0749 103.743C68.48 119.203 63.3095 137 63.1266 155.195C63.121 155.747 62.6738 156.195 62.1215 156.195L11.5938 156.195Z"
          fill="#CC0000"
        />
        <path
          d="M303.594 152.195C304.146 152.195 304.594 151.747 304.59 151.195C304.405 123.032 296.399 95.4739 281.465 71.596C281.172 71.1278 280.554 70.9895 280.087 71.2854L237.425 98.3596C236.959 98.6555 236.821 99.2734 237.113 99.7427C246.708 115.203 251.878 133 252.061 151.195C252.066 151.747 252.514 152.195 253.066 152.195L303.594 152.195Z"
          fill="#F5F5F5"
        />
        <path
          d="M36.7561 69.864C36.3008 69.5514 36.1844 68.9295 36.5001 68.4763C53.3671 44.2627 78.152 23.8449 105.954 12.8734C106.473 12.6683 107.058 12.9339 107.251 13.4584L124.545 60.5871C124.732 61.0958 124.479 61.66 123.978 61.866C106.327 69.1225 90.7586 82.5698 79.801 98.2139C79.4842 98.6663 78.8624 98.7816 78.4071 98.469L36.7561 69.864Z"
          fill="#F5F5F5"
        />
        <path
          d="M111.783 12.196C111.611 11.6711 111.898 11.106 112.424 10.9377C140.487 1.96416 170.553 1.33982 198.964 9.14063C199.497 9.28686 199.807 9.83965 199.657 10.3712L185.958 59.0067C185.809 59.5383 185.256 59.8472 184.723 59.7029C166.34 54.7239 146.913 55.1274 128.752 60.8652C128.226 61.0315 127.661 60.7458 127.489 60.2208L111.783 12.196Z"
          fill="#F5F5F5"
        />
        <path
          d="M204.587 11.4823C204.759 10.9447 205.343 10.6559 205.873 10.8487C234.718 21.3343 258.812 41.3923 276.013 65.7428C276.331 66.1939 276.22 66.8171 275.767 67.133L234.321 96.0341C233.868 96.35 233.244 96.2379 232.925 95.7874C221.788 80.0859 207.679 67.8966 189.784 60.8428C189.29 60.6482 189.027 60.1044 189.189 59.5988L204.587 11.4823Z"
          fill="#F5F5F5"
        />
        <path
          d="M158.262 116.107L99.1888 128.501C74.2541 134.791 62.7251 137.025 57.6874 137.541C52.1875 138.5 55.0911 136.226 55.6877 136.001L151.732 105.474C151.886 105.401 155.407 104.454 155.584 104.404C158.049 103.713 158.561 104.281 159.981 109.391C161.104 113.434 161.273 115.306 158.804 116.001C158.628 116.05 158.448 116.085 158.262 116.107Z"
          fill="#3B3B3B"
        />
      </svg>
    );
  }
};

interface props {
  upguardScore: any;
  generationDate: string;
  information: JSX.Element;
  upguardIcon?: JSX.Element;
  upguardHeadingStyle?: string;
  policyType?: string;
}

const UpgardCyberRiskProfile: React.FC<props> = ({
  upguardScore,
  generationDate,
  information,
  upguardIcon = null,
  upguardHeadingStyle = "font-bold text-[1.75rem]",
  policyType = "",
}: props) => {
  const [risk, setRisk] = useState({
    riskColor: "",
    riskDescription: "",
    riskTitle: "",
  });

  useEffect(() => {
    if (upguardScore > 800) {
      setRisk({
        riskColor: "text-[#69BE28]",
        riskDescription:
          " Your business URL has a robust security profile and good attack surface management",
        riskTitle: "Low Risk",
      });
    } else if (upguardScore > 600) {
      setRisk({
        riskColor: "text-[#AFC910]",
        riskDescription:
          "	Your business URL has basic security controls in place but could have large gaps in it’s security profile.",
        riskTitle: "Medium Risk",
      });
    } else if (upguardScore > 400) {
      setRisk({
        riskColor: "text-[#FFB902]",
        riskDescription:
          "Your business URL has poor security controls and serious issues that need to be addressed.",
        riskTitle: "High Risk",
      });
    } else if (upguardScore > 200) {
      setRisk({
        riskColor: "text-[#FD8204]",
        riskDescription:
          "Your business URL has severe security issues and should not process any sensitive data.",
        riskTitle: "High Risk",
      });
    } else {
      setRisk({
        riskColor: "text-[#CC0000]",
        riskDescription:
          "Your business URL has not invested in basic security controls and should not engage in any online services.",
        riskTitle: "Severe Risk",
      });
    }
  }, [upguardScore]);

  return (
    <div className="relative flex flex-col space-y-12 text-primaryBg">
      {/* scorecard */}
      <div className=" bg-[#F5F5F5] py-7 md:px-16 ">
        <div className="flex sm:space-x-6 items-center space-x-0 px-6 md:px-0">
          {upguardIcon !== null && (
            <div className="hidden sm:block">{upguardIcon}</div>
          )}
          <div className="flex flex-col w-full md:flex-row md:justify-between md:items-center">
            <h1 className={upguardHeadingStyle}>UpGuard Cyber Risk Profile</h1>
            <h3 className=" text-primaryBg">Generated on {generationDate}</h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-6 space-y-12 md:flex-row sm:px-9 md:px-14 md:space-x-8 xl:space-x-20 md:justify-between md:space-y-0">
        {/* score meter */}
        <div className="flex flex-col space-y-12 md:flex-row md:space-x-2 md:space-y-0 xl:space-x-12">
          <div className="flex flex-col space-y-4 font-bold min-w-56">
            <p className=" text-[1.25rem]">Your business is at</p>
            <p className={`text-[2.5rem] ${risk?.riskColor}`}>
              {risk?.riskTitle}
            </p>
            <p className="text-[1.25rem] ">{risk?.riskDescription}</p>
          </div>

          <div className="flex flex-col items-center ">
            {ScoreMeter(upguardScore)}
            <div className="flex flex-col items-center -mt-4">
              <span className="font-bold text-primaryBg">UpGuard score</span>
              <div className="-mt-2">
                <span className="text-[2.5rem] font-black -mt-4">
                  {upguardScore}
                </span>
                <span className="text-xl font-bold">/950</span>
              </div>
            </div>
          </div>
        </div>

        {/* upgaurd description */}
        <div className="flex p-6 bg-[#FFF9E7] border w-full border-[#FFD755] rounded-lg flex-col space-y-2 h-fit min-md:w-[70%]">
          <h2 className="font-bold text-lg">How is the rating calculated?</h2>
          <div className="flex flex-col space-y-4">
            <p className="text-sm">
              UpGuard is a cyber security risk management software that detects
              cyber threats to your business in real time (including but not
              limited to malware susceptibility, email spoofing and phishing
              risk). We use it to gain insights into your business's cyber
              security risk profile.
            </p>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold">Want to know more about UpGuard?</p>
                <p>
                  Click{" "}
                  <Link
                    to="https://www.upguard.com/"
                    target="_blank"
                    className="text-secondary underline cursor-pointer"
                  >
                    here
                  </Link>{" "}
                  for more information.
                </p>
              </div>
              <UpgardLogo />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  px-6 md:px-14 md:space-y-10">
        <hr className="hidden md:block" />

        {/* score ratings */}
        <div className="mt-0 md:mt-8">
          <div>
            <h3 className=" text-primaryBg text-lg font-bold">
              How to read the rating?
            </h3>
          </div>
          {/* desktop view */}
          <div className="hidden min-[800px]:grid">
            <div className=" text-primaryBg font-medium grid grid-cols-5 mt-6">
              <div className=" pb-6 border-r border-r-[#CBD5E1]">
                <h3>Severe risk</h3>
              </div>
              <div className=" pl-4 lg:pl-6 pb-4 border-r border-r-[#CBD5E1]">
                <h3>Critical risk</h3>
              </div>
              <div className=" pl-4 lg:pl-6 pb-4 border-r border-r-[#CBD5E1]">
                <h3>High Risk</h3>
              </div>
              <div className=" pl-4 lg:pl-6 pb-4 border-r border-r-[#CBD5E1]">
                <h3>Medium Risk</h3>
              </div>
              <div className="pl-4 lg:pl-6 pb-4">
                <h3>Low Risk</h3>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#EE1F00] via-[#FFA102] via-[#FEDE00] via-[#84C32A]  to-[#26A84E]   h-1"></div>
            <div className="grid grid-cols-5 text-primaryBg">
              <div className=" pt-6 pr-4 border-r border-r-[#CBD5E1]">
                <h3 className="mb-2">0-200</h3>
                <p className="text-sm">
                  Your business URL has not invested in basic security controls
                  and should not engage in any online services.
                </p>
              </div>
              <div className=" pt-6 pl-4 lg:pl-6 pr-4 border-r border-r-[#CBD5E1]">
                <h3 className="mb-2">201-400</h3>
                <p className=" text-sm">
                  Your business URL has severe security issues and should not
                  process any sensitive data.
                </p>
              </div>
              <div className=" pt-6 pl-4 lg:pl-6 pr-4 border-r border-r-[#CBD5E1]">
                <h3 className=" mb-2 ">401-600</h3>
                <p className=" text-sm">
                  Your business URL has poor security controls and serious
                  issues that need to be addressed.
                </p>
              </div>
              <div className=" pt-6 pl-4 lg:pl-6 pr-4 border-r border-r-[#CBD5E1]">
                <h3 className="mb-2">601-800</h3>
                <p className=" text-sm">
                  Your business URL has basic security controls in place but
                  could have large gaps in it’s security profile.
                </p>
              </div>
              <div className=" pt-6 pl-4 lg:pl-6 pr-4 ">
                <h3 className="mb-2">801-950</h3>
                <p className=" text-sm">
                  Your business URL has a robust security profile and good
                  attack surface management.
                </p>
              </div>
            </div>
          </div>

          {/* small screen view*/}
          <div className=" mt-6 flex min-[800px]:hidden">
            <div className="bg-gradient-to-b from-[#EE1F00] via-[#FFA102] via-[#FEDE00] via-[#84C32A]  to-[#26A84E] w-3 min-[625px]:w-1.5 h-[100] rounded-md"></div>

            <div className=" grid grid-rows-5 pl-4 text-primaryBg">
              <div>
                <h3 className="text-sm font-semibold mb-2">Severe risk</h3>
                <h3 className="text-sm font-semibold mb-2">0-200</h3>
                <p className="text-xs mb-3">
                  Your business URL has not invested in basic security controls
                  and should not engage in any online services.
                </p>
                <hr />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 mt-2">
                  Critical risk
                </h3>
                <h3 className="text-sm font-semibold mb-2">201-400</h3>
                <p className="text-xs mb-3">
                  Your business URL has severe security issues and should not
                  process any sensitive data.
                </p>
                <hr />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 mt-2">High Risk</h3>
                <h3 className="text-sm font-semibold mb-2">401-600</h3>
                <p className="text-xs mb-3">
                  Your business URL has poor security controls and serious
                  issues that need to be addressed.
                </p>
                <hr />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 mt-2">Medium Risk</h3>
                <h3 className="text-sm font-semibold mb-2">601-800</h3>
                <p className="text-xs mb-3">
                  Your business URL has basic security controls in place but
                  could have large gaps in it’s security profile.
                </p>
                <hr />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 mt-2">Low Risk</h3>
                <h3 className="text-sm font-semibold mb-2">801-950</h3>
                <p className="text-xs mb-3">
                  Your business URL has a robust security profile and good
                  attack surface management.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-8" />

        {policyType?.toLowerCase() !== ENDORSEMENT &&
          policyType.toLowerCase() !== RENEWAL && (
            <div className="flex mt-8 text-grayCustom">
              <div className="flex space-x-2">
                <div className="-mt-[2px]">
                  <svg
                    width="17"
                    height="24"
                    viewBox="0 0 17 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.421 16.0093C16.1297 14.791 16.484 13.4546 16.484 12C16.5586 10.5454 16.2043 9.20902 15.421 7.99068C14.6378 6.77233 13.6681 5.80265 12.5119 5.08159C11.3558 4.36052 10.0193 4 8.50262 4C6.98591 4 5.64327 4.36052 4.47465 5.08159C3.30604 5.80265 2.34256 6.77233 1.58421 7.99068C0.825851 9.20902 0.465326 10.5454 0.502622 12C0.539919 13.4546 0.900443 14.791 1.58421 16.0093C2.26797 17.2277 3.23144 18.1974 4.47465 18.9184C5.71786 19.6395 7.0605 20 8.50262 20C9.94474 20 11.2812 19.6395 12.5119 18.9184C13.7427 18.1974 14.7124 17.2277 15.421 16.0093ZM9.82663 7.67366V6.01399C9.82663 5.91453 9.79555 5.83372 9.73339 5.77156C9.67123 5.7094 9.59042 5.67832 9.49097 5.67832H7.49563C7.39617 5.67832 7.31537 5.7094 7.25321 5.77156C7.19104 5.83372 7.15997 5.91453 7.15997 6.01399V7.67366C7.15997 7.77312 7.19104 7.85392 7.25321 7.91608C7.31537 7.97824 7.39617 8.00932 7.49563 8.00932H9.49097C9.59042 8.00932 9.67123 7.97824 9.73339 7.91608C9.79555 7.85392 9.82663 7.77312 9.82663 7.67366ZM11.1506 16.9977V15.338C11.1506 15.2385 11.1196 15.1577 11.0574 15.0956C10.9952 15.0334 10.9206 15.0023 10.8336 15.0023H9.82663V9.669C9.82663 9.56954 9.79555 9.48873 9.73339 9.42657C9.67123 9.36441 9.59042 9.33333 9.49097 9.33333H6.17162C6.07216 9.33333 5.99136 9.36441 5.9292 9.42657C5.86704 9.48873 5.83596 9.56954 5.83596 9.669V11.3287C5.83596 11.4281 5.86704 11.5089 5.9292 11.5711C5.99136 11.6333 6.07216 11.6643 6.17162 11.6643H7.15997V15.0023H6.17162C6.07216 15.0023 5.99136 15.0334 5.9292 15.0956C5.86704 15.1577 5.83596 15.2385 5.83596 15.338V16.9977C5.83596 17.0971 5.86704 17.1779 5.9292 17.2401C5.99136 17.3023 6.07216 17.3333 6.17162 17.3333H10.8336C10.9206 17.3333 10.9952 17.3023 11.0574 17.2401C11.1196 17.1779 11.1506 17.0971 11.1506 16.9977Z"
                      fill="#5841BF"
                    />
                  </svg>
                </div>
                {information}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default UpgardCyberRiskProfile;
