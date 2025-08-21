import { useState, useRef } from "react";
import AutocompleteTooltip from "../AutocompleteTooltip";

type Props = {
  setBusinessDetails: (details: any) => void;
  name: string;
  businessDetails: any;
  setIsOccupationLoading: any;
  handleGetOccupationOptions: any;
  isOccupationLoading: any;
  matchedIndustryList: any;
  setMatchedIndustryList: any;
  setIndustryInput: any;
  searchTerm: any;
  setSearchTerm: any;
  itemSelected: any;
  setItemSelected: any;
};

const Autocomplete = ({
  setBusinessDetails,
  name,
  setIsOccupationLoading,
  handleGetOccupationOptions,
  isOccupationLoading,
  matchedIndustryList,
  setMatchedIndustryList,
  setIndustryInput,
  searchTerm,
  setSearchTerm,
  itemSelected,
  setItemSelected,
}: Props) => {
  const [showSuggestions, setShowSuggestions] = useState(false); //dropdown
  const inputRef = useRef<HTMLInputElement>(null);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const debouncedGetOccupationOptions = debounce((inputValue: string) => {
    handleGetOccupationOptions(inputValue);
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOccupationLoading(true);
    setSearchTerm(event.target.value);
    setShowSuggestions(true);
    setItemSelected(false);
    setIndustryInput({});
    setBusinessDetails((data: any) => {
      return {
        ...data,
        [name]: "",
        industry_name: "",
      };
    });
    if (event.target.value?.trim()?.length > 2) {
      debouncedGetOccupationOptions(event.target.value);
    }
  };

  const handleSelect = (industry: any) => {
    setIndustryInput(industry);
    setSearchTerm(industry?.title);
    setShowSuggestions(false);
    setItemSelected(true);
    setBusinessDetails((data: any) => {
      return {
        ...data,
        [name]: industry?.code,
        industry_name: industry?.title,
      };
    });
  };

  const handleClose = () => {
    setSearchTerm("");
    setItemSelected(false);
    setShowSuggestions(false);
    setIndustryInput({});
    setBusinessDetails((data: any) => {
      return {
        ...data,
        [name]: "",
        industry_name: "",
      };
    });
    setMatchedIndustryList([]);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      if (!itemSelected) {
        setSearchTerm("");
        setMatchedIndustryList([]);
        setIndustryInput({});
      }
    }, 100);
  };

  return (
    <div className="relative w-fit">
      <div className="flex items-center border-b-2 border-primaryBg focus-within:border-secondaryBg group">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="p-2 pb-1 w-full outline-none"
          placeholder="e.g. manufacturing"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          title={searchTerm}
        />
        <span className="p-2">
          {searchTerm ? (
            <svg
              onClick={handleClose}
              className="w-6 h-6 cursor-pointer text-primaryBg group-hover:text-primaryBg group-focus-within:text-primaryBg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L17.94 6M18 18L6.06 6"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700 group-hover:text-primaryBg group-focus-within:text-primaryBg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={showSuggestions ? "m5 15 7-7 7 7" : "m19 9-7 7-7-7"}
              />
            </svg>
          )}
        </span>
      </div>
      {searchTerm?.trim()?.length > 2 && showSuggestions && !itemSelected && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
          {isOccupationLoading ? (
            <div role="status" className="flex justify-center items-center">
              <div className="flex gap-2 p-4 pt-7">
                <div className="h-[0.625rem] w-[0.625rem] sm:h-[0.75rem] sm:w-[0.75rem] md:h-[0.875rem] md:w-[0.875rem] bg-secondaryBg rounded-full animate-loader" />
                <div className="h-[0.625rem] w-[0.625rem] sm:h-[0.75rem] sm:w-[0.75rem] md:h-[0.875rem] md:w-[0.875rem] bg-secondaryBg rounded-full animate-loader animation-delay-200" />
                <div className="h-[0.625rem] w-[0.625rem] sm:h-[0.75rem] sm:w-[0.75rem] md:h-[0.875rem] md:w-[0.875rem] bg-secondaryBg rounded-full animate-loader animation-delay-400" />
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          ) : matchedIndustryList?.exact?.count +
              matchedIndustryList?.fuzzy?.count +
              matchedIndustryList?.semantic?.count >
            0 ? (
            <>
              {[
                ...matchedIndustryList?.exact?.matches,
                ...matchedIndustryList?.fuzzy?.matches,
              ]?.map((industry: any, index: number) => (
                <li
                  key={index}
                  className="p-2 hover:bg-softBg hover:border-l-2 hover:border-[#00A591] cursor-pointer text-sm font-normal"
                  onMouseDown={() => handleSelect(industry)}
                >
                  <span className="font-semibold">{industry?.title}</span>
                  <span className="align-middle ml-1">
                    <AutocompleteTooltip
                      tooltipContent={industry?.primary_activities}
                    />
                  </span>
                </li>
              ))}
              {matchedIndustryList?.exact?.count +
                matchedIndustryList?.fuzzy?.count >
                0 &&
                matchedIndustryList?.semantic?.count > 0 && (
                  <hr className="my-2 border-t-[1px] border-gray-300 shadow-md mx-2" />
                )}

              {matchedIndustryList?.semantic?.count > 0 &&
                [...matchedIndustryList?.semantic?.matches]?.map(
                  (industry: any, index: number) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-softBg hover:border-l-2 hover:border-[#00A591] cursor-pointer text-sm font-normal"
                      onMouseDown={() => handleSelect(industry)}
                    >
                      <span className="font-semibold">{industry?.title}</span>
                      <span className="align-middle ml-1">
                        <AutocompleteTooltip
                          tooltipContent={industry?.primary_activities}
                        />
                      </span>
                    </li>
                  )
                )}
            </>
          ) : (
            <li className="p-2 text-gray-500 text-sm font-normal">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
