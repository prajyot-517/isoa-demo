import { useEffect, useState } from "react";
import Autocomplete from "../common/Autocomplete";
import QuestionTooltip from "../common/QuestionTooltip";
import ToggleButtonGroup from "../common/ToggleButtonGroup";
import { Form } from "@remix-run/react";
import { useAppContext } from "~/context/ContextProvider";
import { formatAmount, removeCommas } from "~/utils";
import ToggleButton from "../common/ToggleButton";

interface props {
  handleChange: any;
  handleToggleChange: any;
  setIsOccupationLoading: any;
  handleGetOccupationOptions: any;
  isOccupationLoading: any;
  matchedIndustryList: any;
  setMatchedIndustryList: any;
  setIndustryInput: any;
  value: any;
}

const BusinessDetailsStep1Form: React.FC<props> = ({
  handleChange,
  handleToggleChange,
  setIsOccupationLoading,
  handleGetOccupationOptions,
  isOccupationLoading,
  matchedIndustryList,
  setMatchedIndustryList,
  setIndustryInput,
  value,
}: props) => {
  const { businessDetails, setBusinessDetails } = useAppContext();
  const [searchTerm, setSearchTerm] = useState(""); //Typed text
  const [itemSelected, setItemSelected] = useState(false);
  const [showList, setShowList] = useState(false);
  const [ageError, setAgeError] = useState("");

  const schoolList = [
  "Philander Smith College (AR)",
  "Mitchell College (CT)",
  "Smithsonian Institute (DC)",
  "Summit Christain School (FL)",
  "Summit Christain Academy (KS)",
  "Smith College (MA)",
  "Summit Christain Academy (KY)",
  "Summit University of Louisiana (LA)",
  "Massachusetts Institute of Technology (VA)",
  "University of Arkansas Fort Smith (AR)",
  "Smithsonians National Zoo and Conversation Biology Institute (DC)",
];

  useEffect(() => {
    setSearchTerm(value);
    if (value) {
      setItemSelected(true);
    }
  }, []);

  const filteredSchools =
    searchTerm.length >= 3
      ? schoolList.filter((school) =>
          school.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const handleSelectSchool = (school: string) => {
    setBusinessDetails({
      ...businessDetails,
      school: school,
    });
    setSearchTerm(school);
    setShowList(false);
  };

  const schoolDisableStatus = new Set(["Dependent F2/J2 visa", "Non-student"]);

  return (
    <div className="bg-white rounded-md border-0 shadow-custom">
      <div className="px-8 py-10 rounded-md md:py-20">
        <Form className="max-w-[760px] mx-auto">
          <div className="flex flex-col justify-center items-center font-extrabold text-2xl text-primary space-y-8">
            <div className="flex flex-col justify-center items-center sm:flex-row sm:space-x-4">
              <label htmlFor="industry_code">My visa status</label>
              <select
                name="visa_status"
                value={businessDetails?.visa_status || ""}
                onChange={(e) => {
                  handleChange(e, "text");
                  setBusinessDetails((prev) => ({
                    ...prev,
                    visa_status: e.target.value,
                    school: schoolDisableStatus.has(e.target.value)
                      ? ""
                      : prev?.visa_status ?? "",
                  }));
                  if (schoolDisableStatus.has(e.target.value)) {
                    setSearchTerm("");
                    setShowList(false);
                  }
                }}
                className="w-full mx-4 mt-[-4px] border-b-2 border-primaryBg text-lg outline-none lg:w-fit"
                id="visa"
              >
                <option value="" disabled hidden>
                  Select
                </option>
                <option value="International student">
                  International student
                </option>
                <option value="International student on J1 visa">
                  International student on J1 visa
                </option>
                <option value="J visa scholar">J visa scholar</option>
                <option value="OPT">OPT</option>
                <option value="Dependent F2/J2 visa">
                  Dependent F2/J2 visa
                </option>
                <option value="Non-student">Non-student</option>
              </select>
              {/* <div className="mt-[-4px] flex flex-col items-center justify-center">
                <Autocomplete
                  name={"insured_industry"}
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  setIsOccupationLoading={setIsOccupationLoading}
                  handleGetOccupationOptions={handleGetOccupationOptions}
                  isOccupationLoading={isOccupationLoading}
                  matchedIndustryList={matchedIndustryList}
                  setMatchedIndustryList={setMatchedIndustryList}
                  setIndustryInput={setIndustryInput}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                />
                {searchTerm && searchTerm?.length < 3 && (
                  <p className="text-red-500 ml-6 mt-1 text-sm font-normal">
                    Please type in at least three characters of your occupation
                  </p>
                )}
              </div> */}
            </div>

            {/* <div className="flex flex-col items-center sm:flex-row">
              <span>excluding myself, I have</span>
              <div className="flex">
                <input
                  type="text"
                  placeholder="e.g. 0 to 50"
                  name="num_employees"
                  min={0}
                  maxLength={10}
                  value={formatAmount(businessDetails?.num_employees)}
                  onChange={(e) => handleChange(e, "number")}
                  className="w-40 mx-4 mt-[-4px]  border-b-2 border-primaryBg outline-none lg:w-fit"
                  id="num_employees"
                />
                <span>employees</span>
              </div>
            </div> */}

            <div className="flex flex-col">
              <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
                <span className="whitespace-nowrap">My school</span>
                <div className="relative md:mt-[-4px] md:mx-4 w-full">
                  <input
                    type="text"
                    name="school"
                    value={searchTerm}
                    disabled={
                      businessDetails?.visa_status === "Dependent F2/J2 visa" ||
                      businessDetails?.visa_status === "Non-student"
                    }
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowList(true);
                    }}
                    placeholder="Search school"
                    className={`w-full bg-transparent border-b-2 border-primaryBg outline-none text-lg ${
                      businessDetails?.visa_status === "Dependent F2/J2 visa" ||
                      businessDetails?.visa_status === "Non-student"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {showList &&
                    searchTerm.length >= 3 &&
                    businessDetails?.visa_status !== "Dependent F2/J2 visa" &&
                    businessDetails?.visa_status !== "Non-student" && (
                      <>
                        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto shadow-md text-lg">
                          {filteredSchools.length > 0 ? (
                            filteredSchools.map((school, idx) => (
                              <li
                                key={idx}
                                className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSelectSchool(school)}
                              >
                                {school}
                              </li>
                            ))
                          ) : (
                            <li className="px-2 py-1 text-gray-500 select-none">
                              No matches
                            </li>
                          )}
                        </ul>
                      </>
                    )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col items-center sm:flex-row sm:space-x-4">
                <span>My age</span>
                <div className="relative md:mt-[-4px] md:mx-4">
                  {/* <span className="absolute inset-y-0 bottom-1 left-0 px-1 flex items-center">
                    $
                  </span> */}
                  <input
                    type="number"
                    min={0}
                    name="age"
                    onChange={(e) => handleChange(e, "number")}
                    onBlur={(e) => {
                      const age = parseInt(e.target.value, 10);
                      if (!age || age < 7 || age > 64) {
                        setAgeError("Age must be between 7 and 64.");
                      } else {
                        setAgeError("");
                      }
                    }}
                    className="w-full pl-6 bg-transparent border-b-2 border-primaryBg outline-none"
                    value={businessDetails?.age}
                    id="age"
                  />
                </div>
                {/* <div className="mt-3 hidden md:block">
                  <QuestionTooltip tooltipContent="Minimum revenue required is $1" />
                </div> */}
              </div>
              {/* <div className="flex justify-center mr-4 sm:mr-0 sm:justify-end">
                {parseFloat(
                  removeCommas(businessDetails?.total_annual_revenue)
                ) == 0 && (
                  <p className="text-red-500 text-base font-500 mr-14 sm:mr-0 sm:float-end sm:w-[41%]  md:w-[44%]">
                    Total revenue is less than $1.
                  </p>
                )}
              </div> */}

              <div className="flex justify-center mr-4 sm:mr-0">
                {ageError && (
                  <p className="text-red-500 text-sm font-medium whitespace-nowrap">
                    {ageError}
                  </p>
                )}
              </div>

            </div>
          </div>

          <div className="flex flex-col my-8 space-y-6">
            {/* <div className="text-primary font-700 text-lg">
              Of the total revenue above:
            </div> */}

            {/* <div className="flex flex-col space-x-2 space-y-4 items-center">
              <div className="flex space-x-2  justify-start w-full ">
                <div className="flex space-x-2 text-primary font-700 text-lg">
                  <span>A)</span>{" "}
                  <div>Is any of it generated from online activities?</div>
                </div>
                <div className="hidden md:block">
                  <QuestionTooltip tooltipContent="Online activities are defined as services or sales that are conducted over the internet, for example, e-commerce." />
                </div>
              </div>

              <div className="flex flex-col space-y-2 w-full sm:flex-row sm:space-x-0 lg:space-x-auto lg:justify-between sm:space-y-0 lg:pr-2">
                <span className="ml-5 text-primary sm:w-1/2">
                  If yes, please indicate the amount. If no, you may skip this
                  question.
                </span>

                <div className="sm:w-1/2 ">
                  <div className="relative ml-6">
                    <span className="absolute inset-y-0 left-0 bottom-1 px-1 flex items-center">
                      $
                    </span>
                    <input
                      type="text"
                      name="total_revenue_online"
                      onChange={(e) => handleChange(e, "number")}
                      min={0}
                      value={businessDetails?.total_revenue_online}
                      className="w-full pl-4 bg-transparent border-b-2 border-primaryBg outline-none"
                      id="total_revenue_online"
                    />
                  </div>

                  {parseFloat(
                    removeCommas(businessDetails?.total_annual_revenue)
                  ) <
                    parseFloat(
                      removeCommas(businessDetails?.total_revenue_online)
                    ) && (
                    <p className="text-red-500 ml-6 mt-1">
                      Online revenue cannot be more than total annual revenue
                    </p>
                  )}
                  {businessDetails?.total_revenue_online !== "" &&
                    parseFloat(
                      removeCommas(businessDetails?.total_revenue_online)
                    ) == 0 && (
                      <p className="text-red-500 ml-6 mt-1">
                        Online revenue is less than $1.
                      </p>
                    )}
                </div>
              </div>
            </div> */}

            {/* <div className="flex flex-col space-y-2 justify-between w-full sm:flex-row sm:space-y-0 sm:items-center">
              <span className="flex space-x-2 text-primary font-700 text-lg">
                <span> B)</span>{" "}
                <div> Is more than 50% derived from overseas?</div>
              </span>
              <div className="w-[289px] md:w-[335px]">
                <ToggleButtonGroup
                  name="has_50PCT_overseas_revenue"
                  value={businessDetails?.has_50PCT_overseas_revenue}
                  handleToggleChange={handleToggleChange}
                  id="has_50PCT_overseas_revenue"
                />
              </div>
            </div> */}

            <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
              <div className="md:w-[512px] xl:max-w-3xl">
                Do you need to waive out of the school health insurance?
              </div>

              <div className="w-[289px] md:w-[335px]">
                <ToggleButtonGroup
                  name="waive_out"
                  value={businessDetails?.waive_out}
                  handleToggleChange={handleToggleChange}
                  id="waive_out"
                />
              </div>
            </div>

            {businessDetails?.waive_out === "no" && (
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-x-4 md:space-y-0">
                  <div className="md:w-[512px] xl:max-w-3xl">
                    What best describes you?
                  </div>

                  <div className="w-[289px] md:w-[335px]">
                    <ToggleButton
                      name="description"
                      value={businessDetails?.description}
                      handleToggleChange={handleToggleChange}
                      id="description"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </Form>
      </div>
    </div>
  );
};

export default BusinessDetailsStep1Form;
