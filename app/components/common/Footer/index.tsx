import { Link, useNavigate } from "@remix-run/react";
import iso_logo from "app/assets/icon/iso_logo.png"

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full min-h-[216px] px-6 m-0 leading-normal text-primaryBg bg-blue-brown-gradient shadow-2xl">
      <div className="h-full max-w-[1536px] mx-auto flex flex-col items-center space-y-10 px-[-8px] py-14 sm:px-2 md:px-14 3xl:px-40">
        <div className="w-full">
          <ul className=" flex flex-col justify-center items-center space-y-4 list-none m-0 p-0 font-medium text-base leading-6 underline sm:flex-row sm:space-y-0 md:justify-start">
            <button
              className="sm:mr-8 cursor-pointer"
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </button>
            <Link
              to="https://www.isoa.org/privacy-policy"
              className="sm:mr-8 cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </Link>
            <Link
              to="https://www.isoa.org/terms"
              className="sm:mr-8 cursor-pointer"
              target="_blank"
              rel="noreferrer"
            >
              Terms of Use
            </Link>
          </ul>
        </div>

        <div className="w-full flex flex-col space-y-10 items-center justify-center md:flex-row md:space-y-0 md:space-x-8 md:justify-between md:items-start">
          <div className="font-medium text-sm leading-5">
          ISOA Insurance is a health division of Unites States
            . This information is only intended as a guide. Policy limits
            and exclusions apply. Please refer to the policy wording for full
            terms and conditions.
          </div>

          <div className="w-[116px] flex-shrink-0 flex">
            <img
              src={iso_logo}
              alt="Logo"
              className="w-full h-[53px] md:mt-[-16px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
