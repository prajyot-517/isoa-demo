import ExclamationMarkIcon from "~/assets/SVGIcons/ExclamationMarkIcon";
import Modal from "../Modal";
import Button from "../Button";

type RestartQuoteModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleRestartQuote: () => void;
};

const RestartQuoteModal: React.FC<RestartQuoteModalProps> = ({
  openModal,
  setOpenModal,
  handleRestartQuote,
}) => {
  return (
    <Modal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      icon={<ExclamationMarkIcon />}
      body={
        <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
          <h1 className="font-bold text-2xl md:text-[2.5rem]">
            Restart quote?
          </h1>
          <p>
            Any answers you have provided thus far will be discarded and you
            will need to fill the questionnaire again. Click Continue to restart
            your quote or close this popup to stay on this page.
          </p>
        </div>
      }
      footer={
        <div className="flex justify-center ">
          <div className="w-60">
            <Button
              onClick={handleRestartQuote}
              label="Continue"
              variant="filled"
              disabled={false}
              showTooltip={false}
              tooltipContent=""
            />
          </div>
        </div>
      }
    />
  );
};

export default RestartQuoteModal;
