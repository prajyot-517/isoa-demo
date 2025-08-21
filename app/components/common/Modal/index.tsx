type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  footer: React.ReactNode;
  body: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  icon,
  footer,
  body,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primaryBg text-primaryBg bg-opacity-20 flex justify-center items-center backdrop-blur-sm sm:px-14">
      <div className="bg-white rounded-md shadow-custom max-w-4xl w-fit  px-6 md:px-12 pt-6 pb-14 md:pb-20">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 20.4362C23 20.9468 22.8341 21.3879 22.5023 21.7592L19.9804 24.4054C19.6264 24.7535 19.2061 24.9276 18.7195 24.9276C18.2328 24.9276 17.8125 24.7535 17.4585 24.4054L12.0166 18.6605L6.57466 24.4054C6.22071 24.7535 5.8004 24.9276 5.31373 24.9276C4.82705 24.9276 4.40674 24.7535 4.05279 24.4054L1.53092 21.7592C1.17697 21.3879 1 20.9468 1 20.4362C1 19.9255 1.17697 19.4845 1.53092 19.1131L6.97285 13.4031L1.53092 7.69306C1.17697 7.32167 1 6.88066 1 6.37C1 5.85934 1.17697 5.41833 1.53092 5.04694L4.05279 2.40083C4.40674 2.02944 4.82705 1.84375 5.31373 1.84375C5.8004 1.84375 6.22071 2.02944 6.57466 2.40083L12.0166 8.11086L17.4585 2.40083C17.8125 2.02944 18.2328 1.84375 18.7195 1.84375C19.2061 1.84375 19.6264 2.02944 19.9804 2.40083L22.5023 5.04694C22.8341 5.39512 23 5.83613 23 6.37C23 6.90387 22.8341 7.34488 22.5023 7.69306L17.0603 13.4031L22.5023 19.1131C22.8341 19.4613 23 19.9023 23 20.4362Z"
                fill="#272727"
              />
            </svg>
          </button>
        </div>

        <div className="pt-8 md:pt-[2.5rem] text-center">
          <div className="flex justify-center">{icon}</div>

          <div className="pt-8 sm:px-6 md:px-10 md:pt-10">{body}</div>
        </div>

        <div className="pt-8 md:pt-10">{footer}</div>
      </div>
    </div>
  );
};

export default Modal;
