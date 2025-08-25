import React from "react";
import InformationCard from "../common/InformationCard";
import EmailAddressIcon from "./SVGIcons/EmailAddressIcon";
import TickIcon from "./SVGIcons/TickIcon";
import { useAppContext } from "~/context/ContextProvider";
import { Form } from "@remix-run/react";

interface props {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isValidEmail: boolean;
  handleKeyDown: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const BusinessDetailsStep3Form: React.FC<props> = ({
  handleChange,
  isValidEmail,
  handleKeyDown,
}: props) => {
  const { businessDetails3 } = useAppContext();

  return (
    
        <div className="flex flex-col space-y-16 xl:px-9 text-primaryBg">
          <div className="flex flex-col space-y-9">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <EmailAddressIcon />
                <h1 className="font-bold text-2xl"> Email address </h1>
              </div>
              <p className="text-primary">
                A one-time password will be sent to this email address for
                verification.
              </p>
            </div>
            <Form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="relative">
                <input
                  type="email"
                  name="insured_contact_email"
                  value={businessDetails3?.insured_contact_email}
                  onChange={handleChange}
                  className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none ${
                    businessDetails3?.insured_contact_email !== "" &&
                    !isValidEmail
                      ? "border-[#CC0000]"
                      : businessDetails3?.insured_contact_email !== "" &&
                        isValidEmail
                      ? "border-primaryBg pr-10"
                      : "border-grayCustom"
                  }`}
                  placeholder="email@address.com"
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                {businessDetails3?.insured_contact_email !== "" &&
                  isValidEmail && (
                    <span className="absolute inset-y-0 right-3 flex items-center">
                      <TickIcon />
                    </span>
                  )}
                {!isValidEmail &&
                  businessDetails3?.insured_contact_email.length > 0 && (
                    <p className="text-[#CC0000] mt-1">
                      Please enter a valid email address.
                    </p>
                  )}
              </div>
            </Form>
            {/* <InformationCard
              title="Why do I need to verify my email?"
              body="Your security is important to us. This allows us to verify your email address and authenticate your identity each time you login.
                We will also use this email to send you any important documents and updates about your policy. "
              iconColor="#5841BF"
              backgroundColor="#FAEFFC"
            /> */}
          </div>
        </div>
     
  );
};

export default BusinessDetailsStep3Form;
