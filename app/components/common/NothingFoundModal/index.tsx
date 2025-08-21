import NothingFoundIcon from "~/assets/SVGIcons/NothingFoundIcon";
import Button from "../Button";
import Modal from "../Modal";
import { useNavigate } from "@remix-run/react";

interface NothingFoundModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NothingFoundModal: React.FC<NothingFoundModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const navigate = useNavigate();
  return (
    <Modal
      isOpen={openModal}
      onClose={() => navigate("/")}
      icon={<NothingFoundIcon />}
      body={
        <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
          <h1 className="font-bold text-2xl md:text-[2.5rem]">Nothing found</h1>
          <p>
            We're unable to find an active quote or policy linked to this email.{" "}
            <br /> It's possible your quote has expired. <br /> <br />
            Would you like to get a quote?
          </p>
        </div>
      }
      footer={
        <div className="flex flex-col items-center space-y-8">
          <div className="w-60">
            <Button
              onClick={() => navigate("/business-details-1?quoteId=new-quote")}
              label="Yes, get quote"
              variant="filled"
              disabled={false}
              showTooltip={false}
              tooltipContent=""
            />
          </div>
          <div className="w-60">
            <Button
              onClick={() => {
                setOpenModal(false);
                navigate("/");
              }}
              label="No, back to home"
              variant=""
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

export default NothingFoundModal;
