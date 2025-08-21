import { ReactNode, useEffect } from "react";

interface VerificationProps {
  icon: ReactNode;
  resendDisabled: boolean;
  setResendDisabled: (value: boolean) => void;
  setCountdown: (value: number | ((prevState: number) => number)) => void;
  children: ReactNode;
}

const Verification: React.FC<VerificationProps> = ({
  icon,
  resendDisabled,
  setResendDisabled,
  setCountdown,
  children,
}) => {
  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setCountdown((currentCountdown: number) => {
          if (currentCountdown <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return currentCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  return (
    <div className="flex justify-center">
      <div className="relative px-8 pt-28 pb-10 w-full flex justify-center bg-white rounded-md border-0 shadow-custom md:pt-36 md:pb-20">
        {/* Logo icon */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {icon}
        </div>

        {/* Verification Card */}
        {children}
      </div>
    </div>
  );
};
export default Verification;
