import YourQuoteIcon from "./Icons/YourQuoteIcon";

const YourQuoteCard = ({ quoteCardData }: any) => {
  return (
    <div className="text-white flex flex-col pl-3 space-y-10 sm:px-0 md:flex-row md:space-x-10 md:space-y-0 w-full">
      <YourQuoteIcon />
      <div className="flex flex-col space-y-6 w-full">
        <h1 className="font-black text-[2rem] md:text-[2.5rem]">Your quote</h1>
        <div className="flex flex-col space-y-3 text-xl sm:text-2xl w-full">
          <p className="break-words w-full">
            Your quote is valid until{" "}
            <span className="text-secondary">{quoteCardData?.quote_expiration_date}</span>
          </p>
          <p className="break-words w-full">
            Prepared for{" "}
            <span className="text-secondary">{quoteCardData?.insured_contact_email}</span>
          </p>
          <p className="break-words w-full">
            Quote number <span className="text-secondary">{quoteCardData?.quote_number}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default YourQuoteCard;
