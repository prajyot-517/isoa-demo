/**
 * Description- Mask email address with *
 * @param {string} email
 * @returns {string} masked email
 */

export function maskEmail(email: string): string {
  if (email.length <= 4) {
    return email;
  } else {
    const masked =
      email.substring(0, 2) +
      email.substring(2, email.length - 4).replace(/[a-z\d]/gi, "*") +
      email.substring(email.length - 4, email.length);
    return masked;
  }
}

/**
 * Description- Mask phone number with *
 * @param {string} phone
 * @returns {string} masked phone
 */

export function maskPhone(phone: string) {
  if (phone.length <= 4) {
    return phone;
  } else {
    const masked =
      phone.substring(0, phone?.length - 4)?.replace(/[0-9\d]/gi, "*") +
      phone.substring(phone?.length - 4, phone?.length);
    return masked;
  }
}

/**
 * Description- Validate domain with regex pattern
 * @param {string} url
 * @returns {boolean} Returns true if domain matches
 */

export function domainValidation(url: any) {
  const urlRegex =
    /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;
  if (urlRegex?.test(url)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Description- Validate email address using regex pattern
 * @param {string} email
 * @returns {boolean} true if email is valid
 */

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Description-Function to return current date
 * @returns {any} return the current date
 */

export const getTodaysDate = () => {
  const today = new Date(Date.now());
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 because January is 0
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

/**
 * Get the maximum date allowed, which is 2 months from today.
 * @returns {string} The maximum date in "YYYY-MM-DD" format.
 */
export const getMaxDateForPolicyInception = () => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate?.setDate(today?.getDate() + 60); // Add 60 days to today's date
  return maxDate?.toISOString()?.split("T")[0]; // Convert to YYYY-MM-DD format
};

/**
 * Description- Function to download document using api data
 * @param {any} response - response object from server
 * @param {string} documentName - Name of the document
 * @returns {any}
 */

export const downloadDocumentUtil = async (
  response: any,
  documentName: string
) => {
  try {
    if (response != null && typeof window !== "undefined") {
      const data = Uint8Array.from(response.data);
      const pdfUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = documentName; // Set the desired filename
      link.click();
      URL.revokeObjectURL(pdfUrl);
    }
  } catch (error) {
    console.error(error);

    throw error;
  }
};

function isValidDate(dateStr) {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  const regexYMD = /^\d{4}-\d{2}-\d{2}$/;

  const dateFormat = regex.test(dateStr)
    ? "DD-MM-YYYY"
    : regexYMD.test(dateStr)
    ? "YYYY-MM-DD"
    : null;

  if (!dateFormat) {
    return false;
  }

  const parts = dateStr.split("-");
  let year, month, day;

  if (dateFormat === "DD-MM-YYYY") {
    [day, month, year] = parts;
  } else {
    [year, month, day] = parts;
  }

  const date = new Date(year, month - 1, day);
  return (
    date &&
    date.getMonth() + 1 === parseInt(month) &&
    date.getDate() === parseInt(day) &&
    date.getFullYear() === parseInt(year)
  );
}

export const formatDate = (inputDate: any) => {
  if (isValidDate(inputDate)) {
    const [day, month, year] = inputDate?.split("-")?.map(Number);
    const dateObject = new Date(year, month - 1, day);

    const formattedDate = `${dateObject.getDate()} ${dateObject
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase()} ${dateObject.getFullYear()}`;

    return formattedDate;
  } else {
    return "";
  }
};

export const convertDateToDDMMYYYY = (inputDate: any) => {
  if (isValidDate(inputDate)) {
    const [year, month, day] = inputDate?.split("-");
    return `${day}-${month}-${year}`;
  } else {
    return "";
  }
};

export const convertDateToYYYYMMDD = (inputDate: any) => {
  if (isValidDate(inputDate)) {
    const [day, month, year] = inputDate?.split("-");
    return `${year}-${month}-${day}`;
  } else {
    return "";
  }
};

export const calculatePolicyDateRange = (startDate: any) => {
  if (isValidDate(startDate)) {
    const [day, month, year] = startDate.split("-").map(Number);
    const start = new Date(year, month - 1, day);

    const minDate = new Date(start);
    const maxDate = new Date(start);

    // Set minimum date 9 months from start date
    minDate.setMonth(start.getMonth() + 9);

    // Set maximum date 15 months from start date
    maxDate.setMonth(start.getMonth() + 15);

    const formatDate = (inputDateString) => {
      const date = new Date(inputDateString);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;

      return `${year}-${formattedMonth}-${formattedDay}`;
    };

    return {
      minDate: formatDate(minDate),
      maxDate: formatDate(maxDate),
    };
  } else {
    return {
      minDate: "",
      maxDate: "",
    };
  }
};

/**
 * Description-Validate phone number using regex pattern
 * @param {string} number
 * @returns {boolean} true if number is valid
 */

export const validatePhoneNumber = (number: string) => {
  if (number.match(RegExp(".*[a-zA-Z].*"))) {
    return false;
  }
  return number?.length >= 8 && number?.length < 15;
};

/**
 * Description- Format amount string into comma separated string after every 3 digits
 * @param {any} amount
 * @returns {any} comma separated string representation of amount
 */

export const formatAmount = (amount: any) => {
  // Convert the number to a string
  let formattedAmount = amount?.toString();
  // Use regular expressions to add commas every three digits from the right
  formattedAmount = formattedAmount?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedAmount;
};

export const removeCommas = (formattedNumber: string) => {
  // Remove commas from the formatted number string
  return formattedNumber?.replace(/,/g, "");
};

/**
 * Checks if the policy expiry date is near within 30 days from today.
 * @param {string} expiryDate - The expiry date of the policy in "YYYY-MM-DD" format.
 * @returns {boolean} Returns true if the expiry date is less than or equal to 30 days away from today, otherwise false.
 */
export const isPolicyExpiryNear = (expiryDate: string) => {
  if (expiryDate) {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const today = new Date();

    const parts = expiryDate?.split("-");
    const expiry = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

    // Calculate the difference in days between today and the expiry date
    const differenceInDays = Math.round((expiry - today) / millisecondsInADay);

    return differenceInDays <= 30;
  } else {
    return false;
  }
};

/**
 * Description- Capitalizes the first letter of the parameter and returns it
 * @param {string} input
 * @returns {string} capitalized first letter of the paramter
 */

export const capitalizeFirstLetter = (input: string) => {
  return input?.charAt(0)?.toUpperCase() + input?.slice(1);
};

/**
 * Checks if the provided date has passed compared to the current date.
 * @param {string} dateString - The date string to be checked in "DD-MM-YYYY" format.
 * @returns {boolean} Returns true if the provided date has passed (is before the current date), otherwise false.
 */
export const isDatePassed = (dateString: string) => {
  const parts = dateString?.split("-");
  if (parts) {
    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

    const today = new Date();

    // Compare the dates
    return date < today;
  } else {
    return false;
  }
};

/**
 * Returns the minimum cancellation date for a policy.
 *
 * The minimum cancellation date is the later of two dates:
 * 1. 30 days before today's date.
 * 2. The policy inception date.
 *
 * @param {string} policyInceptionDate - The policy inception date in the format 'DD-MM-YYYY'.
 * @returns {string} - The minimum cancellation date in the format 'YYYY-MM-DD'.
 */
export const getMinCancellationDate = (policyInceptionDate: string) => {
  if (policyInceptionDate) {
    const [day, month, year] = policyInceptionDate?.split("-");

    const policyInception = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    const minDate = new Date(Math.max(thirtyDaysAgo, policyInception));

    return minDate.toISOString().split("T")[0];
  } else {
    return getTodaysDate();
  }
};

/**
 * Checks if a given date in the format 'DD-MM-YYYY' is a future date.
 *
 * @param {string} date - The date string in the format 'DD-MM-YYYY'.
 * @returns {boolean} - Returns true if the date is in the future, false otherwise.
 */
export const isFutureDate = (date: string) => {
  if (isValidDate(date)) {
    const [day, month, year] = date?.split("-");
    const givenDate = new Date(`${year}-${month}-${day}T00:00:00`);
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return givenDate > today;
  } else {
    return false;
  }
};

export const formatNewzealandNumber = (inputValue: string) => {
  // Add space every three digits from right to left
  return inputValue?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const normalizeMobileNumber = (formattedValue: string) => {
  // Remove spaces from the formatted value
  return formattedValue?.replace(/\s/g, "");
};

export const handleDownloadPolicyWording = async (documentLink: any) => {
  try {
    const response = await fetch(documentLink);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "ISOA-Health-Insurance-Policy-Wording.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);

    throw new Error(`Could not download file`);
  }
};

/**
 * Compares two objects deeply to determine if they are equal.
 * This function checks if all properties and their values in both objects are the same.
 *
 * @param {Object} obj1 - The first object to compare.
 * @param {Object} obj2 - The second object to compare.
 * @returns {boolean} - Returns true if both objects are deeply equal, false otherwise.
 */
export const objectsAreEqual = (obj1: any, obj2: any) => {
  // If both objects are strictly equal, return true
  if (obj1 === obj2) return true;

  // If either object is null or undefined, return false
  if (obj1 == null || obj2 == null) return false;
  // If the objects have different constructors (e.g., Array vs Object), return false
  if (obj1?.constructor !== obj2?.constructor) return false;

  // If obj1 is an object (and not null), proceed with deep comparison
  if (obj1 instanceof Object) {
    // Iterate over all properties in obj1
    for (let key in obj1) {
      if (obj1?.hasOwnProperty(key)) {
        // If obj2 does not have a matching property, return false
        if (!obj2?.hasOwnProperty(key)) return false;
        // Recursively compare the properties of both objects
        if (!objectsAreEqual(obj1[key], obj2[key])) return false;
      }
    }
    // Ensure obj2 does not have any extra properties that obj1 lacks
    for (let key in obj2) {
      if (obj2?.hasOwnProperty(key) && !obj1?.hasOwnProperty(key)) return false;
    }
    // All properties match, return true
    return true;
  }

  // For non-object values, return false (they are not equal if they reach here)
  return false;
};

/**
 * Checks if a given object exists in an array of objects by comparing the 'quote_option_id' property
 * and then performing a deep comparison of the objects.
 *
 * @param {Array} array - The array of objects to search within.
 * @param {Object} object - The object to check for in the array.
 * @returns {boolean} - Returns true if the object is found in the array, false otherwise.
 */
export const isObjectInArray = (array: any, object: any) => {
  const filteredArray = array?.filter(
    (item: any) => item?.quote_option_id === object?.quote_option_id
  );

  for (let i = 0; i < filteredArray?.length; i++) {
    if (objectsAreEqual(filteredArray[i], object)) {
      return true;
    }
  }
  return false;
};

export const isDateInRangeOf60Days = (dateString: any) => {
  if (isValidDate(dateString)) {
    const [day, month, year] = dateString?.split("-")?.map(Number);
    const inputDate = new Date(year, month - 1, day);

    const today = new Date();
    today?.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate?.setDate(futureDate?.getDate() + 60);

    // Check if the input date is between today and 60 days from today
    return inputDate >= today && inputDate <= futureDate;
  } else {
    return false;
  }
};

/**
 * Function to get the minimum cancellation date for a policy.
 * The minimum date is either today or the policy start date, whichever is later.
 *
 * @param {string} policyStartDate - The policy start date in the format dd-mm-yyyy.
 * @returns {Date} - The minimum date for policy cancellation.
 */
export const getMinimumCancellationDate = (policyStartDate: any) => {
  if (isValidDate(policyStartDate)) {
    const [day, month, year] = policyStartDate?.split("-")?.map(Number);
    const policyStart = new Date(year, month - 1, day);
    policyStart?.setHours(0, 0, 0, 0); // Ensure the time is set to midnight

    // Get today's date
    const today = new Date();
    today?.setHours(0, 0, 0, 0); // Ensure the time is set to midnight

    // Compare the policy start date with today's date and return the later date
    const minDate = policyStart > today ? policyStart : today;

    // Format the date as yyyy-mm-dd
    const yyyy = minDate?.getFullYear();
    const mm = String(minDate?.getMonth() + 1)?.padStart(2, "0");
    const dd = String(minDate?.getDate())?.padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return formattedDate;
  } else {
    getTodaysDate();
  }
};

/**
 * Determines whether to show a COI based on the current date and the provided policy start and end dates.
 *
 * @param {string} policyStartDate - The start date of the policy in the format 'dd-mm-yyyy'.
 * @param {string} policyEndDate - The end date of the policy in the format 'dd-mm-yyyy'.
 * @returns {boolean} - Returns true if today's date is greater than or equal to the policy start date
 *                      and less than or equal to the policy end date, otherwise returns false.
 *
 * The function works by:
 * 1. Splitting the policy start and end dates into day, month, and year components.
 * 2. Converting these components into Date objects.
 * 3. Creating a Date object for today's date.
 * 4. Comparing today's date with the start and end dates to determine if it falls within the specified range.
 */
export const shouldShowCOI = (policyStartDate: any, policyEndDate: any) => {
  if (isValidDate(policyStartDate) && isValidDate(policyEndDate)) {
    const [startDay, startMonth, startYear] = policyStartDate
      .split("-")
      .map(Number);
    const [endDay, endMonth, endYear] = policyEndDate.split("-").map(Number);

    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const today = new Date();

    return today >= startDate && today <= endDate;
  } else {
    return false;
  }
};

/**
 * This function processes a given phone number string to remove all leading zeros, if present.
 *
 * @param {string} phoneNumber - The phone number to be processed.
 * @returns {string} - The processed phone number with all leading zeros removed.
 *
 * The function handles undefined or null inputs gracefully and uses a regular expression to match and remove all leading zeros from the phone number.
 */
export const processPhoneNumber = (phoneNumber: any) => {
  // Check if the phone number is undefined or null
  if (!phoneNumber) {
    return phoneNumber;
  }

  // Regular expression to match and remove all leading zeros
  const processedNumber = phoneNumber?.replace(/^0+/, "");

  return processedNumber;
};
