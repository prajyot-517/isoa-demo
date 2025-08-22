// import {
//   ActionFunctionArgs,
//   LoaderFunctionArgs,
//   redirect,
// } from "@remix-run/node";
// import {
//   json,
//   useActionData,
//   useLoaderData,
//   useLocation,
//   useNavigate,
//   useSubmit,
// } from "@remix-run/react";
// import { useEffect, useState } from "react";
// import Button from "~/components/common/Button";
// import InformationCard from "~/components/common/InformationCard";
// import PolicyProgressBar from "~/components/common/PolicyProgressBar";
// import { useAppContext, useToast } from "~/context/ContextProvider";
// import { getPolicyById, updatePolicy } from "~/services/quote.api";
// import businessDetails2 from "./business-details-2";
// import {
//   OTP_LIMIT_REACHED,
//   PHONE_OTP_SENT,
//   PHONE_UPDATED,
//   SUCCESS,
//   TOO_MANY_REQUESTS,
// } from "~/constants/string";
// import {
//   formatNewzealandNumber,
//   normalizeMobileNumber,
//   processPhoneNumber,
//   validatePhoneNumber,
// } from "~/utils";
// import {
//   commitSession,
//   destroySession,
//   getSession,
// } from "~/services/session.server";
// import {
//   generatePhoneOTP,
//   // getVerifiedPhoneNumber,
//   // isPhoneVerified,
//   updateUserAttributes,
//   verifyAuthToken,
// } from "~/services/authentication.server";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const session = await getSession(request.headers.get("cookie"));

//   // if (!(await verifyAuthToken(session))) {
//   //   return redirect("/login", {
//   //     headers: {
//   //       "Set-Cookie": await destroySession(session),
//   //     },
//   //   });
//   // }

//   const { searchParams } = new URL(request.url);
//   const quoteId: any = searchParams.get("quoteId");

//   // const isPhoneNumberVerified = await isPhoneVerified(session);
//   // let verifiedPhoneNumber = null;

//   // if (isPhoneNumberVerified) {
//   //   verifiedPhoneNumber = await getVerifiedPhoneNumber(session);
//   // }
//   // const response = await getPolicyById(session, quoteId);
//   // return json(
//   //   {
//   //     response,
//   //     isPhoneNumberVerified,
//   //     verifiedPhoneNumber,
//   //     env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
//   //   },
//   //   { headers: { "Set-Cookie": await commitSession(session) } }
//   // );
// }

// const ContactDetails = () => {
//   const navigate = useNavigate();
//   const { stepState, contactDetails, setContactDetails, productDetails } =
//     useAppContext();
//   const loaderData = useLoaderData<typeof loader>();
//   const response: any = loaderData?.response;
//   // const isPhoneNumberVerified: any = loaderData?.isPhoneNumberVerified;
//   // const verifiedPhoneNumber: any = loaderData?.verifiedPhoneNumber;
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const quoteId = searchParams.get("quoteId");
//   const submit = useSubmit();
//   const [isValid, setIsValid] = useState(false);
//   const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
//   const alphabetRegex = /^[a-zA-Z\s]+$/;
//   const [isValidName, setValidName] = useState(false);
//   const actionData: any = useActionData();
//   const { setToastProps } = useToast();
//   const [countryCodeForPhone, setCountryCodeForPhone] = useState("+91");//Todo

//   //If fields already exist in backend
//   useEffect(() => {
//     if (response && !response.newQuote && response.data) {
//       const data = response.data.policies[0];

//       let phoneNumber: number = 0;

//       if (data?.insured_contact_phone?.includes("+61")) {
//         setCountryCodeForPhone("+61");
//         phoneNumber = data?.insured_contact_phone?.slice(
//           data?.insured_contact_phone?.indexOf("+61") + 3
//         );
//       } else if (data?.insured_contact_phone?.includes("+64")) {
//         setCountryCodeForPhone("+64");
//         phoneNumber = data?.insured_contact_phone?.slice(
//           data?.insured_contact_phone?.indexOf("+64") + 3
//         );
//       } else if (data?.insured_contact_phone?.includes("+91")) {
//         setCountryCodeForPhone("+91");
//         phoneNumber = data?.insured_contact_phone?.slice(
//           data?.insured_contact_phone?.indexOf("+91") + 3
//         );
//       }

//       const newData = {
//         insured_contact_name:
//           data?.insured_contact_name || contactDetails?.insured_contact_name,
//         insured_contact_phone:
//           phoneNumber || contactDetails?.insured_contact_phone,
//       };

//       setIsValid(
//         validatePhoneNumber(processPhoneNumber(newData?.insured_contact_phone))
//       );
//       setValidName(alphabetRegex.test(newData?.insured_contact_name));

//       // Check if the new data is different from the current state
//       if (JSON.stringify(newData) !== JSON.stringify(businessDetails2)) {
//         setContactDetails(newData);
//       }
//     }
//   }, [response]);

//   useEffect(() => {
//     if (!(isValid && isValidName)) setNextButtonDisabled(true);
//     else setNextButtonDisabled(false);
//   }, [contactDetails, response]);

//   //For backend errors
//   useEffect(() => {
//     if (
//       actionData?.response?.status?.statusCode !== 200 &&
//       actionData?.response?.status?.description
//     ) {
//       setToastProps({
//         message:
//           actionData?.response?.status?.message +
//           "-" +
//           (actionData?.response?.status?.description?.message ??
//             actionData?.response?.status?.description),
//         variant: "error",
//       });
//     }

//     //For backend errors
//     if (response?.status?.statusCode !== 200 && response?.status?.description) {
//       setToastProps({
//         message:
//           response?.status?.message +
//           "-" +
//           (response?.status?.description?.message ??
//             response?.status?.description),
//         variant: "error",
//       });
//     }
//   }, [actionData, response]);

//   const handleChange = (event: any) => {
//     const { name, value } = event.target;
//     let valueToBeStored = value;
//     const validateName = (value: string) => {
//       return alphabetRegex.test(value);
//     };

//     if (name === "insured_contact_name") {
//       const valid = validateName(valueToBeStored?.trim());
//       setValidName(valid);
//     }
//     if (name === "insured_contact_phone") {
//       valueToBeStored = valueToBeStored?.replace(/[^0-9]/g, "");
//       const valid = validatePhoneNumber(
//         processPhoneNumber(normalizeMobileNumber(valueToBeStored))
//       );
//       setIsValid(valid);
//     }
//     setContactDetails((data) => {
//       return {
//         ...data,
//         [name]:
//           name === "insured_contact_phone"
//             ? normalizeMobileNumber(valueToBeStored)
//             : valueToBeStored,
//       };
//     });
//   };

//   // Function to save data and move to next step
//   const handleSaveAndNextButton = () => {
//     const formData = new FormData();
//     formData.append(
//       "insured_contact_name",
//       contactDetails?.insured_contact_name?.trim()
//     );
//     formData.append(
//       "insured_contact_phone",
//       `${countryCodeForPhone}${processPhoneNumber(
//         contactDetails?.insured_contact_phone
//       )}`
//     );

//     // formData.append("isPhoneNumberVerified", isPhoneNumberVerified);

//     if (response && !response.newQuote && response?.data?.policies[0]) {
//       const data = response?.data?.policies[0];
//       formData.append("isUpdate", "true");
//       formData.append("response", JSON.stringify(data, null, 2));
//     }
//     formData.append("isSaveAndNext", "true");
//     submit(formData, { method: "post" });
//   };

//   // To check if the quote option selected is empty
//   useEffect(() => {
//     if (Object?.keys(productDetails?.quoteOptionSelected)?.length == 0) {
//       navigate("/quote?quoteId=" + quoteId);
//     }
//   }, [productDetails]);

//   useEffect(() => {
//     const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
//       event.preventDefault();
//       event.returnValue =
//         "Are you sure you want to leave? Your changes may not be saved.";
//     };

//     window.addEventListener("beforeunload", beforeUnloadHandler);

//     return () => {
//       window.removeEventListener("beforeunload", beforeUnloadHandler);
//     };
//   }, []);

//   // useEffect(() => {
//   //   if (isPhoneNumberVerified) {
//   //     setIsValid(true);
//   //     setContactDetails((data) => {
//   //       return {
//   //         ...data,
//   //         insured_contact_phone: normalizeMobileNumber(
//   //           verifiedPhoneNumber?.substring(3)
//   //         ),
//   //       };
//   //     });
//   //     setCountryCodeForPhone(verifiedPhoneNumber?.substring(0, 3));
//   //   }
//   // }, [isPhoneNumberVerified]);

//   return (
//     <div>
//       {/* Progress bar */}
//       <div>
//         <PolicyProgressBar
//           currentStep={stepState?.currentStep}
//           subStep={stepState?.subStep}
//         />
//       </div>

//       <div className="flex justify-center">
//         <div className="max-w-[1536px] w-full">
//           <div className="sm:px-10 md:px-28 lg:px-40">
//             <div className="flex flex-col space-y-6 px-4 pt-16 pb-10 text-primaryBg sm:px-0 md:pt-20 md:pb-16">
//               <h1 className="font-black text-3xl">
//                 Policy holder contact details
//               </h1>
//               <h3 className="font-bold text-xl">
//                 We need some details about yourself.
//               </h3>
//             </div>

//             {/* Contact details form */}
//             <div className="pb-10 md:pb-16">
//               <div className="bg-white rounded-md border-0 shadow-custom">
//                 <div className="px-6 py-10 rounded-md xl:px-16 xl:py-20 3xl:px-28">
//                   <form className="flex flex-col space-y-10 text-primaryBg">
//                     <div className="flex flex-col space-y-4">
//                       <div className="font-bold text-[1.25rem]">
//                         Name of contact person
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           name="insured_contact_name"
//                           value={contactDetails?.insured_contact_name}
//                           onChange={handleChange}
//                           className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-grayCustom`}
//                           placeholder="Full name"
//                           maxLength={255}
//                         />
//                         {!isValidName &&
//                           contactDetails?.insured_contact_name?.length > 0 && (
//                             <p className="text-red-500 text-xs mt-2">
//                               Please enter a valid name.
//                             </p>
//                           )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col space-y-2">
//                       <div className="flex flex-col space-y-4">
//                         <div className="font-bold text-[1.25rem]">
//                           Phone number
//                         </div>
//                         <p>
//                           We’ll send a one-time password to this mobile number.
//                         </p>

//                         <div className="flex flex-col justify-center ">
//                           <div
//                             className={`flex border border-grayCustom rounded-lg w-full`}
//                           >
//                             <span
//                               className="pl-4
//                          py-[10px]
//                           pr-2
//                           "
//                             >
//                               {/* {loaderData?.env?.REMOVE_PHONE_PREFIXES ===
//                               "false" ? (
//                                 <select
//                                   className={`  border-0 outline-none ${
//                                     isPhoneNumberVerified
//                                       ? "bg-gray-200 cursor-not-allowed opacity-60"
//                                       : ""
//                                   }`}
//                                   name="countryCodeForPhone"
//                                   disabled={isPhoneNumberVerified}
//                                   value={countryCodeForPhone}
//                                   onChange={(e) => {
//                                     e.target.style.color = "#3B3B3B";
//                                     setCountryCodeForPhone(e.target.value);
//                                   }}
//                                 >
//                                   <option value="+64">+64</option>
//                                   <option value="+61">+61</option>
//                                   <option value="+91">+91</option>
//                                 </select>
//                               ) : (
//                                 <span className="text-primaryBg">+61</span>
//                               )} */}
//                               <span className="text-primaryBg">+91</span>
//                             </span>
//                             <input
//                               type="tel"
//                               inputMode="numeric"
//                               name="insured_contact_phone"
//                               value={formatNewzealandNumber(
//                                 contactDetails?.insured_contact_phone
//                               )}
//                               onChange={handleChange}
//                               placeholder="xxx xxx"
//                               className={`outline-none py-[10px] rounded-r-lg w-full`}
//                               aria-label="Phone number"
//                               // disabled={isPhoneNumberVerified}
//                             />
//                           </div>
//                           {!isValid &&
//                             contactDetails?.insured_contact_phone?.length >
//                               0 && (
//                               <p className="text-red-500 text-xs mt-2">
//                                 Please enter a valid Australia phone number.
//                               </p>
//                             )}
//                         </div>
//                       </div>
//                       <p className="text-sm">
//                         We only cover businesses in Australia.
//                       </p>
//                     </div>
//                   </form>

//                   {/* Information card */}
//                   <div className="pt-10 md:pt-14">
//                     <InformationCard
//                       // title={
//                       //   isPhoneNumberVerified
//                       //     ? "Your Phone number has already been verified."
//                       //     : "Why do I need to verify my phone number?"
//                       // }
//                       // body={
//                       //   isPhoneNumberVerified
//                       //     ? "Your security and privacy are important to us. We have verified your phone number so that accessing your policy online in the future will be quick and simple by entering your email and phone number."
//                       //     : "Your security and privacy are important to us. We are verifying your phone number so that accessing your policy online in the future will be quick and simple by entering your email and phone number."
//                       // }
//                       iconColor="#5841BF"
//                       backgroundColor="#FAEFFC"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
//               <div className="w-60 mt-3 sm:mt-0">
//                 <Button
//                   onClick={() => navigate(`/quote?quoteId=${quoteId}`)}
//                   label="Back"
//                   variant=""
//                   disabled={false}
//                   showTooltip={false}
//                   tooltipContent=""
//                 />
//               </div>
//               <div className="w-60">
//                 <Button
//                   onClick={() => {
//                     handleSaveAndNextButton();
//                   }}
//                   label="Next"
//                   variant="filled"
//                   disabled={isNextButtonDisabled}
//                   showTooltip={isNextButtonDisabled}
//                   tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactDetails;

// export async function action({ request }: ActionFunctionArgs) {
//   const session = await getSession(request.headers.get("cookie"));
//   // if (!(await verifyAuthToken(session))) {
//   //   return redirect("/login", {
//   //     headers: {
//   //       "Set-Cookie": await destroySession(session),
//   //     },
//   //   });
//   // }
//   const formData = await request.formData();
//   const insured_contact_name = formData.get("insured_contact_name");
//   const insured_contact_phone = formData.get("insured_contact_phone");
//   const isUpdate = formData.get("isUpdate") == "true";
//   // const isPhoneNumberVerified = formData.get("isPhoneNumberVerified") == "true";

//   let response;
//   const data = {
//     insured_contact_name,
//     insured_contact_phone,
//   };
//   let resData;

//   // if (isPhoneNumberVerified) {
//   //   const responseData: any = formData.get("response");
//   //   response = JSON.parse(responseData);
//   //   response = { ...response, ...data };
//   //   //update policy
//   //   resData = await updatePolicy(session, response);

//   //   if (resData?.status?.message === SUCCESS) {
//   //     const policyId = resData?.data?.policies[0]?.policy_id;
//   //     return redirect("/final-questions?quoteId=" + policyId, {
//   //       headers: { "Set-Cookie": await commitSession(session) },
//   //     });
//   //   } else {
//   //     return json(
//   //       {
//   //         response: resData,
//   //       },
//   //       { headers: { "Set-Cookie": await commitSession(session) } }
//   //     );
//   //   }
//   // }
//   const updatePhoneResponse = await updateUserAttributes(session, [
//     {
//       Name: "phone_number",
//       Value: insured_contact_phone,
//     },
//   ]);
//   if (updatePhoneResponse != PHONE_UPDATED) {
//     return json(
//       {
//         response: {
//           status: {
//             statusCode: 400,
//             message: "Error",
//             description: " Phone update failed",
//           },
//         },
//       },
//       { headers: { "Set-Cookie": await commitSession(session) } }
//     );
//   } else if (updatePhoneResponse == PHONE_UPDATED) {
//     const generatePhoneOTPResponse = await generatePhoneOTP(session);
//     if (generatePhoneOTPResponse == OTP_LIMIT_REACHED) {
//       return json(
//         {
//           response: {
//             status: {
//               statusCode: 400,
//               message: "Error",
//               description:
//                 " OTP limit reached. Please try again after some time.",
//             },
//           },
//         },
//         { headers: { "Set-Cookie": await commitSession(session) } }
//       );
//     } else if (generatePhoneOTPResponse == TOO_MANY_REQUESTS) {
//       return json(
//         {
//           response: {
//             status: {
//               statusCode: 400,
//               message: "Error",
//               description:
//                 " Too many requests for OTP. Please try again after some time.",
//             },
//           },
//         },
//         { headers: { "Set-Cookie": await commitSession(session) } }
//       );
//     } else if (generatePhoneOTPResponse != PHONE_OTP_SENT) {
//       return json(
//         {
//           response: {
//             status: {
//               statusCode: 400,
//               message: "Error",
//               description: " OTP generation failed",
//             },
//           },
//         },
//         { headers: { "Set-Cookie": await commitSession(session) } }
//       );
//     }
//   }

//   if (isUpdate && updatePhoneResponse == PHONE_UPDATED) {
//     const responseData: any = formData.get("response");
//     response = JSON.parse(responseData);
//     response = { ...response, ...data };
//     //update policy
//     resData = await updatePolicy(session, response);

//     if (resData?.status?.message === SUCCESS) {
//       const policyId = resData?.data?.policies[0]?.policy_id;
//       return redirect("/verify-phone-number?quoteId=" + policyId, {
//         headers: { "Set-Cookie": await commitSession(session) },
//       });
//     } else {
//       return json(
//         {
//           response: resData,
//         },
//         { headers: { "Set-Cookie": await commitSession(session) } }
//       );
//     }
//   }
//   return json(
//     {
//       response: resData,
//     },
//     { headers: { "Set-Cookie": await commitSession(session) } }
//   );
// }

// // import {
// //   ActionFunctionArgs,
// //   LoaderFunctionArgs,
// //   json,
// //   redirect,
// // } from "@remix-run/node";
// // import {
// //   Form,
// //   useActionData,
// //   useLoaderData,
// //   useLocation,
// //   useNavigate,
// //   useSubmit,
// // } from "@remix-run/react";
// // import { useEffect, useState } from "react";
// // import BusinessDetailsStep3Form from "~/components/BusinessDetailsForms/BusinessDetailsStep3Form";
// // import Button from "~/components/common/Button";
// // import PolicyProgressBar from "~/components/common/PolicyProgressBar";
// // import { useAppContext, useToast } from "~/context/ContextProvider";
// // import { getPolicyById, validatePromoCode } from "~/services/quote.api";
// // import {
// //   formatNewzealandNumber,
// //   normalizeMobileNumber,
// //   processPhoneNumber,
// //   validateEmail,
// //   validatePhoneNumber,
// // } from "~/utils";
// // import {
// //   ACCOUNT_ALREADY_EXISTS,
// //   EMAIL_VERIFICATION_CODE_SENT,
// //   QUOTED,
// //   USER_ALREADY_EXISTS,
// //   USER_CREATION_FAILED,
// // } from "~/constants/string";
// // import {
// //   commitSession,
// //   destroySession,
// //   getSession,
// // } from "~/services/session.server";
// // import {
// //   authenticateUser,
// //   createUser,
// //   verifyAuthToken,
// // } from "~/services/authentication.server";
// // import Modal from "~/components/common/Modal";
// // import PolicyFoundIcon from "~/assets/SVGIcons/PolicyFoundIcon";
// // import ToggleButtonGroup from "~/components/common/ToggleButtonGroup";
// // import QuestionTooltip from "~/components/common/QuestionTooltip";
// // import PromoCodeValidationMessage from "~/components/BusinessDetailsForms/PromoCodeValidationMessage";
// // import Checkbox from "~/components/common/Checkbox";
// // import InformationCard from "~/components/common/InformationCard";

// // export async function loader({ request }: LoaderFunctionArgs) {
// //   const { searchParams } = new URL(request.url);
// //   const quoteId: any = searchParams.get("quoteId");
// //   let response: any;
// //   if (quoteId !== "new-quote") {
// //     const session = await getSession(request.headers.get("cookie"));
// //     // if (!(await verifyAuthToken(session))) {
// //     //   return redirect("/login", {
// //     //     headers: {
// //     //       "Set-Cookie": await destroySession(session),
// //     //     },
// //     //   });
// //     // }
// //     response = await getPolicyById(session, quoteId);
// //     return json(
// //       {
// //         response,
// //         env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
// //       },
// //       {
// //         headers: {
// //           "Set-Cookie": await commitSession(session),
// //         },
// //       }
// //     );
// //   } else {
// //     response = {
// //       newQuote: true,
// //     };
// //     return json({
// //       response,
// //       env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
// //     });
// //   }
// // }
// // export default function ContactDetails() {
// //   const navigate = useNavigate();
// //   const {
// //     stepState,
// //     setStepState,
// //     businessDetails3,
// //     businessDetails2,
// //     setBusinessDetails3,
// //     businessDetails,
// //     contactDetails,
// //     setContactDetails,
// //     countryCodeForPhoneInitialStep,
// //     setCountryCodeForPhoneInitialStep,
// //   } = useAppContext();
// //   const { setToastProps } = useToast();
// //   const actionData: any = useActionData();
// //   const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
// //   const [isValidEmail, setIsValidEmail] = useState(true);
// //   const [isAccountAlreadyExistModal, setAccountAlreadyExistModal] =
// //     useState(false);
// //   const loaderData = useLoaderData<typeof loader>();
// //   const response: any = loaderData?.response;
// //   const location = useLocation();
// //   const searchParams = new URLSearchParams(location.search);
// //   const quoteId = searchParams.get("quoteId");
// //   const submit = useSubmit();
// //   const alphabetRegex = /^[a-zA-Z\s]+$/;
// //   const [isValidName, setValidName] = useState(true);
// //   const [isValid, setIsValid] = useState(true);
// //   const [referralCodeValidationData, setReferralCodeValidationData] = useState({
// //     variant: "",
// //     message: "",
// //     isValid: false,
// //   });
// //   const [referralCode, setReferralCode] = useState("");
// //   const [borderColorForReferralInput, setBorderColorForReferralInput] =
// //     useState("border-grayCustom");

// //   //If fields already exist in backend
// //   useEffect(() => {
// //     if (response && !response.newQuote && response.data) {
// //       const data = response.data.policies[0];
// //       const newData = {
// //         insured_contact_email: data?.insured_contact_email || "",
// //       };
// //       // Check if the new data is different from the current state
// //       if (JSON.stringify(newData) !== JSON.stringify(businessDetails2)) {
// //         setBusinessDetails3(newData);
// //       }
// //     }
// //   }, [response]);

// //   useEffect(() => {
// //     if (
// //       isValidEmail &&
// //       businessDetails3?.insured_contact_email?.length > 0 &&
// //       isValid &&
// //       isValidName
// //     )
// //       setNextButtonDisabled(false);
// //     else setNextButtonDisabled(true);
// //   }, [businessDetails3, contactDetails]);

// //   //For backend errors
// //   useEffect(() => {
// //     if (
// //       actionData?.response?.status?.statusCode !== 200 &&
// //       actionData?.response?.status?.description
// //     ) {
// //       setToastProps({
// //         message:
// //           actionData?.response?.status?.message +
// //           "-" +
// //           (actionData?.response?.status?.description?.message ??
// //             actionData?.response?.status?.description),
// //         variant: "error",
// //       });
// //     }

// //     //For backend errors
// //     if (response?.status?.statusCode !== 200 && response?.status?.description) {
// //       setToastProps({
// //         message:
// //           response?.status?.message +
// //           "-" +
// //           (response?.status?.description?.message ??
// //             response?.status?.description),
// //         variant: "error",
// //       });
// //     }
// //   }, [actionData, response]);

// //   useEffect(() => {
// //     const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
// //       event.preventDefault();
// //       event.returnValue =
// //         "Are you sure you want to leave? Your changes may not be saved.";
// //     };

// //     window.addEventListener("beforeunload", beforeUnloadHandler);

// //     return () => {
// //       window.removeEventListener("beforeunload", beforeUnloadHandler);
// //     };
// //   }, []);

// //   //To check if the quote is in quoted stage
// //   useEffect(() => {
// //     if (response?.data?.policies?.length > 0) {
// //       const policyStage = response?.data?.policies[0]?.policy_stage;
// //       if (policyStage?.toLowerCase() == QUOTED) {
// //         navigate("/quote?quoteId=" + quoteId);
// //       }
// //     }
// //   }, [response]);

// //   useEffect(() => {
// //     if (
// //       actionData?.response?.status?.statusCode == 400 &&
// //       actionData?.response?.status?.description
// //         ?.toLowerCase()
// //         ?.includes(ACCOUNT_ALREADY_EXISTS)
// //     ) {
// //       setAccountAlreadyExistModal(true);
// //     }
// //     if (
// //       actionData?.response?.status?.statusCode == 200 &&
// //       actionData?.response?.isReferralCodeValidation
// //     ) {
// //       if (actionData?.response?.status?.message == "Success") {
// //         setBorderColorForReferralInput("border-[#69BE28]");
// //         setBusinessDetails3((data: any) => {
// //           return {
// //             ...data,
// //             referral_code: referralCode,
// //           };
// //         });
// //         setReferralCodeValidationData((data: any) => {
// //           return {
// //             ...data,
// //             variant: "success",
// //             message: actionData?.response?.status?.description,
// //             isValid: true,
// //           };
// //         });
// //       }
// //       if (actionData?.response?.status?.message == "Error") {
// //         setBorderColorForReferralInput("border-[#D14343]");
// //         setReferralCodeValidationData((data: any) => {
// //           return {
// //             ...data,
// //             variant: "error",
// //             message: actionData?.response?.status?.description,
// //             isValid: false,
// //           };
// //         });
// //       }
// //     }
// //   }, [actionData]);

// //   const handleChange = (e: any) => {
// //     const { name, value } = e?.target;
// //     if (name === "insured_contact_email") {
// //       const domainValid = validateEmail(value);
// //       setIsValidEmail(domainValid);
// //     }
// //     setBusinessDetails3((data: any) => {
// //       return {
// //         ...data,
// //         [name]: value,
// //       };
// //     });
// //   };

// //   const handleReferralCode = (e: any) => {
// //     const { value } = e?.target;
// //     const isValid = /^[a-zA-Z0-9]{0,6}$/.test(value);
// //     if (!isValid) {
// //       return;
// //     }
// //     setBorderColorForReferralInput("border-grayCustom");
// //     setReferralCodeValidationData((data: any) => {
// //       return {
// //         ...data,
// //         variant: "",
// //         message: "",
// //         isValid: false,
// //       };
// //     });

// //     if (value?.length > 0 && value.length < 6 && isValid) {
// //       setBorderColorForReferralInput("border-[#D14343]");
// //       setReferralCodeValidationData((data: any) => {
// //         return {
// //           ...data,
// //           variant: "error",
// //           message: "Referral code should be six characters only",
// //           isValid: false,
// //         };
// //       });
// //     }

// //     setBusinessDetails3((data: any) => {
// //       return {
// //         ...data,
// //         referral_code: "",
// //       };
// //     });
// //     if (isValid) {
// //       setReferralCode(value);
// //     }
// //   };

// //   const handleChangeForNameAndPhone = (event: any) => {
// //     const { name, value } = event.target;
// //     let valueToBeStored = value;
// //     const validateName = (value: string) => {
// //       return alphabetRegex.test(value);
// //     };

// //     if (name === "insured_contact_name") {
// //       const valid = validateName(valueToBeStored?.trim());
// //       setValidName(valid);
// //     }
// //     if (name === "insured_contact_phone") {
// //       valueToBeStored = valueToBeStored?.replace(/[^0-9]/g, "");
// //       const valid = validatePhoneNumber(
// //         processPhoneNumber(normalizeMobileNumber(valueToBeStored))
// //       );
// //       setIsValid(valid);
// //     }
// //     setContactDetails((data) => {
// //       return {
// //         ...data,
// //         [name]:
// //           name === "insured_contact_phone"
// //             ? normalizeMobileNumber(valueToBeStored)
// //             : valueToBeStored,
// //       };
// //     });
// //   };

// //   // Function to save data and go to the back
// //   const handleBackButton = () => {
// //     navigate("/business-details-1?quoteId=" + quoteId);
// //   };

// //   // Function to save data and move to next step
// //   const handleSaveAndNextButton = () => {
// //     const formData = new FormData();
// //     formData.append(
// //       "insured_contact_email",
// //       businessDetails3?.insured_contact_email
// //     );
// //     formData.append(
// //       "insured_contact_name",
// //       contactDetails?.insured_contact_name
// //     );

// //     if (response && !response.newQuote && response?.data?.policies[0]) {
// //       const data = response?.data?.policies[0];
// //       formData.append("isUpdate", "true");
// //       formData.append("response", JSON.stringify(data, null, 2));
// //     }
// //     formData.append("isSaveAndNext", "true");
// //     submit(formData, { method: "post" });
// //   };

// //   //To check if user has refreshed, if yes then redirect him to first page business details-1
// //   useEffect(() => {
// //     if (
// //       (Object?.keys(businessDetails?.visa_status)?.length == 0 ||
// //         businessDetails?.visa_status == "") &&
// //       businessDetails?.school?.length == 0 &&
// //       businessDetails?.age?.length == 0 &&
// //       businessDetails?.waive_out?.length == 0
// //     ) {
// //       navigate("/business-details-1?quoteId=" + quoteId);
// //     }
// //   }, []);

// //   const handleKeyDown = (e: any) => {
// //     if (e?.key === " ") {
// //       e.preventDefault();
// //     }
// //     if (
// //       e?.key === "Enter" &&
// //       businessDetails3?.insured_contact_email !== "" &&
// //       isValidEmail
// //     ) {
// //       handleSaveAndNextButton();
// //     }
// //   };

// //   const handleToggleChange = (name: string, value: string) => {
// //     if (name == "has_existing_business" && value == "no") {
// //       setBusinessDetails3((data: any) => {
// //         return {
// //           ...data,
// //           existing_policy_number: "",
// //         };
// //       });
// //     }
// //     setBusinessDetails3((data: any) => {
// //       return {
// //         ...data,
// //         [name]: value,
// //       };
// //     });
// //   };

// //   const handleReferralClear = () => {
// //     setReferralCode("");
// //     setBorderColorForReferralInput("border-[#FFA726]");
// //     setBusinessDetails3((data: any) => {
// //       return {
// //         ...data,
// //         referral_code: "",
// //       };
// //     });
// //     setReferralCodeValidationData((data: any) => {
// //       return {
// //         ...data,
// //         variant: "warning",
// //         message: "Removed referral code",
// //         isValid: false,
// //       };
// //     });
// //   };

// //   const handleApply = (e: any) => {
// //     e.preventDefault();
// //     const formData = new FormData();
// //     formData.append("isReferralCodeValidation", "true");
// //     formData.append("referral_code", referralCode);
// //     submit(formData, { method: "post" });
// //   };

// //   const handleContactConsent = () => {
// //     setBusinessDetails3((data: any) => {
// //       return {
// //         ...data,
// //         contact_consent: !businessDetails3?.contact_consent,
// //       };
// //     });
// //   };

// //   return (
// //     <div>
// //       {/* Progress bar */}
// //       <div>
// //         <PolicyProgressBar
// //           currentStep={stepState?.currentStep}
// //           subStep={stepState?.subStep}
// //         />
// //       </div>

// //       <div className="flex justify-center">
// //         <div className="max-w-[1536px] w-full">
// //           <div className="sm:px-10 md:px-28 lg:px-40">
// //             <div className="flex flex-col space-y-6 px-4 pt-16 pb-10 text-primaryBg sm:px-0 md:pt-20 md:pb-16">
// //               <h1 className="font-black text-3xl ">
// //                 What's your contact details?
// //               </h1>
// //               <h3 className="font-bold text-xl">
// //                 We'll use your email to send through your quote.
// //               </h3>
// //             </div>

// //             {/* Business details step 3 form */}
// //             <div className="pb-10 md:pb-16">
// //               <div className="bg-white rounded-md border-0 shadow-custom">
// //                 <div className="px-8 py-10 rounded-md xl:px-16 xl:py-20 3xl:px-28 ">

// //                   {/* contact details form */}
// //                   <form className="flex flex-col space-y-8 text-primary xl:px-9  mb-10">
// //                     <div className="flex flex-col space-y-4">
// //                       <div className="font-bold text-[1.25rem]">
// //                         Name of contact person
// //                       </div>
// //                       <div>
// //                         <input
// //                           type="text"
// //                           name="insured_contact_name"
// //                           value={contactDetails?.insured_contact_name}
// //                           onChange={handleChangeForNameAndPhone}
// //                           className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-grayCustom`}
// //                           placeholder="Full name"
// //                           maxLength={255}
// //                         />
// //                         {!isValidName &&
// //                           contactDetails?.insured_contact_name?.length > 0 && (
// //                             <p className="text-red-500 text-xs mt-2">
// //                               Please enter a valid name.
// //                             </p>
// //                           )}
// //                       </div>
// //                     </div>
// //                   </form>

// //                   <BusinessDetailsStep3Form
// //                     handleChange={handleChange}
// //                     isValidEmail={isValidEmail}
// //                     handleKeyDown={handleKeyDown}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
// //               <div className="w-60 mt-3 sm:mt-0">
// //                 <Button
// //                   onClick={() => {
// //                     handleBackButton();
// //                     setStepState((prevState) => ({
// //                       ...prevState,
// //                       subStep: 2,
// //                     }));
// //                   }}
// //                   label="Back"
// //                   variant=""
// //                   disabled={false}
// //                   showTooltip={false}
// //                   tooltipContent=""
// //                 />
// //               </div>
// //               <div className="w-60">
// //                 <Button
// //                   onClick={() => {
// //                     handleSaveAndNextButton();
// //                   }}
// //                   label="Next"
// //                   variant="filled"
// //                   disabled={isNextButtonDisabled}
// //                   showTooltip={isNextButtonDisabled}
// //                   tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
// //                 />
// //               </div>
// //             </div>

// //             {/* If account already exists for the input email */}
// //             <Modal
// //               isOpen={isAccountAlreadyExistModal}
// //               onClose={() => setAccountAlreadyExistModal(false)}
// //               icon={<PolicyFoundIcon />}
// //               body={
// //                 <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
// //                   <h1 className="font-bold text-2xl md:text-[2.5rem] md:leading-[3rem]">
// //                     You already have an existing account with us!
// //                   </h1>
// //                 </div>
// //               }
// //               footer={
// //                 <div className="flex justify-center ">
// //                   <div className="w-60">
// //                     <Button
// //                       onClick={() => {
// //                         navigate("/login");
// //                       }}
// //                       label={`Login`}
// //                       variant="filled"
// //                       disabled={false}
// //                       showTooltip={false}
// //                       tooltipContent=""
// //                     />
// //                   </div>
// //                 </div>
// //               }
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export async function action({ request }: ActionFunctionArgs) {
// //   const session = await getSession(request.headers.get("cookie"));
// //   try {
// //     const formData = await request.formData();
// //     const insuredContactEmail = String(formData.get("insured_contact_email"));
// //     const isReferralCodeValidation =
// //       formData.get("isReferralCodeValidation") == "true";

// //     if (isReferralCodeValidation) {
// //       const promocode = formData.get("referral_code");
// //       const validatePromoCodeBody = { promocode };
// //       const resData = await validatePromoCode(validatePromoCodeBody);

// //       return json(
// //         {
// //           response: {
// //             ...resData,
// //             isReferralCodeValidation: true,
// //           },
// //         },
// //         {
// //           headers: {
// //             "Set-Cookie": await commitSession(session),
// //           },
// //         }
// //       );
// //     }

// //     const createUserResponse = await createUser(session, insuredContactEmail);
// //     if (createUserResponse == USER_CREATION_FAILED) {
// //       return json(
// //         {
// //           response: {
// //             status: {
// //               statusCode: 400,
// //               message: "Error",
// //               description: " Account creation failed for this email",
// //             },
// //           },
// //         },
// //         {
// //           headers: {
// //             "Set-Cookie": await commitSession(session),
// //           },
// //         }
// //       );
// //     } else if (createUserResponse == USER_ALREADY_EXISTS) {
// //       const authenticateUserResponse = await authenticateUser(
// //         session,
// //         insuredContactEmail
// //       );
// //       if (authenticateUserResponse != EMAIL_VERIFICATION_CODE_SENT) {
// //         return json(
// //           {
// //             response: {
// //               status: {
// //                 statusCode: 400,
// //                 message: "Error",
// //                 description: "Account creation failed for this email",
// //               },
// //             },
// //           },
// //           { headers: { "Set-Cookie": await commitSession(session) } }
// //         );
// //       }
// //     }
// //     console.log(redirect,"redirect -1");
// //     return redirect("/quote-processing?quoteId=new-quote", {
// //       headers: { "Set-Cookie": await commitSession(session) },
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     return json(
// //       {
// //         response: {
// //           status: {
// //             statusCode: 400,
// //             message: "Error",
// //             description: "Internal Server Error",
// //           },
// //         },
// //       },
// //       { headers: { "Set-Cookie": await commitSession(session) } }
// //     );
// //   }
// // }

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import BusinessDetailsStep3Form from "~/components/BusinessDetailsForms/BusinessDetailsStep3Form";
import Button from "~/components/common/Button";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import { useAppContext, useToast } from "~/context/ContextProvider";
import { getPolicyById, validatePromoCode } from "~/services/quote.api";
import {
  formatNewzealandNumber,
  normalizeMobileNumber,
  processPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "~/utils";
import {
  ACCOUNT_ALREADY_EXISTS,
  EMAIL_VERIFICATION_CODE_SENT,
  QUOTED,
  USER_ALREADY_EXISTS,
  USER_CREATION_FAILED,
} from "~/constants/string";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/services/session.server";
import {
  authenticateUser,
  createUser,
  verifyAuthToken,
} from "~/services/authentication.server";
import Modal from "~/components/common/Modal";
import PolicyFoundIcon from "~/assets/SVGIcons/PolicyFoundIcon";
import ToggleButtonGroup from "~/components/common/ToggleButtonGroup";
import QuestionTooltip from "~/components/common/QuestionTooltip";
import PromoCodeValidationMessage from "~/components/BusinessDetailsForms/PromoCodeValidationMessage";
import Checkbox from "~/components/common/Checkbox";
import InformationCard from "~/components/common/InformationCard";
import FinalQuestionsForm from "~/components/FinalQuestionsForm";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const quoteId: any = searchParams.get("quoteId");
  let response: any;
  if (quoteId !== "new-quote") {
    const session = await getSession(request.headers.get("cookie"));
    // if (!(await verifyAuthToken(session))) {
    //   return redirect("/login", {
    //     headers: {
    //       "Set-Cookie": await destroySession(session),
    //     },
    //   });
    // }
    response = await getPolicyById(session, quoteId);
    return json(
      {
        response,
        env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } else {
    response = {
      newQuote: true,
    };
    return json({
      response,
      env: { REMOVE_PHONE_PREFIXES: process.env.REMOVE_PHONE_PREFIXES },
    });
  }
}
export default function ContactDetails() {
  const navigate = useNavigate();
  const {
    stepState,
    setStepState,
    businessDetails3,
    businessDetails2,
    setBusinessDetails3,
    businessDetails,
    contactDetails,
    setContactDetails,
    countryCodeForPhoneInitialStep,
    setCountryCodeForPhoneInitialStep,
    finalQuestionsDetails,
    setFinalQuestionsDetails,
  } = useAppContext();
  const { setToastProps } = useToast();
  const actionData: any = useActionData();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isAccountAlreadyExistModal, setAccountAlreadyExistModal] =
    useState(false);
  const loaderData = useLoaderData<typeof loader>();
  const response: any = loaderData?.response;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const quoteId = searchParams.get("quoteId");
  const submit = useSubmit();
  const alphabetRegex = /^[a-zA-Z\s]+$/;
  const [isValidName, setValidName] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [referralCodeValidationData, setReferralCodeValidationData] = useState({
    variant: "",
    message: "",
    isValid: false,
  });
  const [referralCode, setReferralCode] = useState("");
  const [borderColorForReferralInput, setBorderColorForReferralInput] =
    useState("border-grayCustom");

  //If fields already exist in backend
  useEffect(() => {
    if (response && !response.newQuote && response.data) {
      const data = response.data.policies[0];
      const newData = {
        insured_contact_email: data?.insured_contact_email || "",
      };
      // Check if the new data is different from the current state
      if (JSON.stringify(newData) !== JSON.stringify(businessDetails2)) {
        setBusinessDetails3(newData);
      }
    }
  }, [response]);

  useEffect(() => {
    if (
      isValidEmail &&
      businessDetails3?.insured_contact_email?.length > 0 &&
      isValid &&
      isValidName
    )
      setNextButtonDisabled(false);
    else setNextButtonDisabled(true);
  }, [businessDetails3, contactDetails]);

  //For backend errors
  useEffect(() => {
    if (
      actionData?.response?.status?.statusCode !== 200 &&
      actionData?.response?.status?.description
    ) {
      setToastProps({
        message:
          actionData?.response?.status?.message +
          "-" +
          (actionData?.response?.status?.description?.message ??
            actionData?.response?.status?.description),
        variant: "error",
      });
    }

    //For backend errors
    if (response?.status?.statusCode !== 200 && response?.status?.description) {
      setToastProps({
        message:
          response?.status?.message +
          "-" +
          (response?.status?.description?.message ??
            response?.status?.description),
        variant: "error",
      });
    }
  }, [actionData, response]);

  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your changes may not be saved.";
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //To check if the quote is in quoted stage
  useEffect(() => {
    if (response?.data?.policies?.length > 0) {
      const policyStage = response?.data?.policies[0]?.policy_stage;
      if (policyStage?.toLowerCase() == QUOTED) {
        navigate("/quote?quoteId=" + quoteId);
      }
    }
  }, [response]);

  useEffect(() => {
    if (
      actionData?.response?.status?.statusCode == 400 &&
      actionData?.response?.status?.description
        ?.toLowerCase()
        ?.includes(ACCOUNT_ALREADY_EXISTS)
    ) {
      setAccountAlreadyExistModal(true);
    }
    if (
      actionData?.response?.status?.statusCode == 200 &&
      actionData?.response?.isReferralCodeValidation
    ) {
      if (actionData?.response?.status?.message == "Success") {
        setBorderColorForReferralInput("border-[#69BE28]");
        setBusinessDetails3((data: any) => {
          return {
            ...data,
            referral_code: referralCode,
          };
        });
        setReferralCodeValidationData((data: any) => {
          return {
            ...data,
            variant: "success",
            message: actionData?.response?.status?.description,
            isValid: true,
          };
        });
      }
      if (actionData?.response?.status?.message == "Error") {
        setBorderColorForReferralInput("border-[#D14343]");
        setReferralCodeValidationData((data: any) => {
          return {
            ...data,
            variant: "error",
            message: actionData?.response?.status?.description,
            isValid: false,
          };
        });
      }
    }
  }, [actionData]);


  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    if (name === "insured_contact_email") {
      const domainValid = validateEmail(value);
      setIsValidEmail(domainValid);
    }
    setBusinessDetails3((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleFormDetailsChange = (e: any) => {
    const { name, value } = e?.target;
    // console.log(e, "event handler");
    // console.log(name,"conatct-details");
    setFinalQuestionsDetails((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };



  const handleReferralCode = (e: any) => {
    const { value } = e?.target;
    const isValid = /^[a-zA-Z0-9]{0,6}$/.test(value);
    if (!isValid) {
      return;
    }
    setBorderColorForReferralInput("border-grayCustom");
    setReferralCodeValidationData((data: any) => {
      return {
        ...data,
        variant: "",
        message: "",
        isValid: false,
      };
    });

    if (value?.length > 0 && value.length < 6 && isValid) {
      setBorderColorForReferralInput("border-[#D14343]");
      setReferralCodeValidationData((data: any) => {
        return {
          ...data,
          variant: "error",
          message: "Referral code should be six characters only",
          isValid: false,
        };
      });
    }

    setBusinessDetails3((data: any) => {
      return {
        ...data,
        referral_code: "",
      };
    });
    if (isValid) {
      setReferralCode(value);
    }
  };

  const handleChangeForNameAndPhone = (event: any) => {
    const { name, value } = event.target;
    let valueToBeStored = value;
    const validateName = (value: string) => {
      return alphabetRegex.test(value);
    };

    if (name === "insured_contact_name") {
      const valid = validateName(valueToBeStored?.trim());
      setValidName(valid);
    }
    if (name === "insured_contact_phone") {
      valueToBeStored = valueToBeStored?.replace(/[^0-9]/g, "");
      const valid = validatePhoneNumber(
        processPhoneNumber(normalizeMobileNumber(valueToBeStored))
      );
      setIsValid(valid);
    }
    setContactDetails((data) => {
      return {
        ...data,
        [name]:
          name === "insured_contact_phone"
            ? normalizeMobileNumber(valueToBeStored)
            : valueToBeStored,
      };
    });
  };

  // Function to save data and go to the back
  const handleBackButton = () => {
    navigate("/business-details-1?quoteId=" + quoteId);
  };

  // Function to save data and move to next step
  const handleSaveAndNextButton = () => {
    const formData = new FormData();
    formData.append(
      "insured_contact_email",
      businessDetails3?.insured_contact_email
    );
    formData.append(
      "insured_contact_name",
      contactDetails?.insured_contact_name
    );

    formData.append(
      "policy_inception_date",
      finalQuestionsDetails?.policy_inception_date
    );
    formData.append(
      "insured_company_name",
      finalQuestionsDetails?.insured_company_name
    );

    if (response && !response.newQuote && response?.data?.policies[0]) {
      const data = response?.data?.policies[0];
      formData.append("isUpdate", "true");
      formData.append("response", JSON.stringify(data, null, 2));
    }
    formData.append("isSaveAndNext", "true");
    submit(formData, { method: "post" });
  };

  //To check if user has refreshed, if yes then redirect him to first page business details-1
  useEffect(() => {
    if (
      (Object?.keys(businessDetails?.visa_status)?.length == 0 ||
        businessDetails?.visa_status == "") &&
      businessDetails?.school?.length == 0 &&
      businessDetails?.age?.length == 0 &&
      // businessDetails?.has_50PCT_overseas_revenue?.length == 0 &&
      // businessDetails?.description?.length ==0
      businessDetails?.waive_out?.length == 0 &&
      businessDetails?.waive_out == "no" &&
      businessDetails?.description?.length == 0
    ) {
      navigate("/business-details-1?quoteId=" + quoteId);
    }
  }, []);

  const handleKeyDown = (e: any) => {
    if (e?.key === " ") {
      e.preventDefault();
    }
    if (
      e?.key === "Enter" &&
      businessDetails3?.insured_contact_email !== "" &&
      isValidEmail
    ) {
      handleSaveAndNextButton();
    }
  };

  const handleToggleChange = (name: string, value: string) => {
    if (name == "has_existing_business" && value == "no") {
      setBusinessDetails3((data: any) => {
        return {
          ...data,
          existing_policy_number: "",
        };
      });
    }
    setBusinessDetails3((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const handleReferralClear = () => {
    setReferralCode("");
    setBorderColorForReferralInput("border-[#FFA726]");
    setBusinessDetails3((data: any) => {
      return {
        ...data,
        referral_code: "",
      };
    });
    setReferralCodeValidationData((data: any) => {
      return {
        ...data,
        variant: "warning",
        message: "Removed referral code",
        isValid: false,
      };
    });
  };

  const handleApply = (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("isReferralCodeValidation", "true");
    formData.append("referral_code", referralCode);
    submit(formData, { method: "post" });
  };

  const handleContactConsent = () => {
    setBusinessDetails3((data: any) => {
      return {
        ...data,
        contact_consent: !businessDetails3?.contact_consent,
      };
    });
  };

  return (
    <div>
      {/* Progress bar */}
      <div>
        <PolicyProgressBar
          currentStep={stepState?.currentStep}
          subStep={stepState?.subStep}
        />
      </div>

      <div className="flex justify-center">
        <div className="max-w-[1536px] w-full">
          <div className="sm:px-10 md:px-28 lg:px-40">
            <div className="flex flex-col space-y-6 px-4 pt-16 pb-10 text-primaryBg sm:px-0 md:pt-20 md:pb-16">
              <h1 className="font-black text-3xl ">
                What's your contact details?
              </h1>
              <h3 className="font-bold text-xl">
                We'll use your email to send through your quote.
              </h3>
            </div>

            {/* Business details step 3 form */}
            <div className="pb-10 md:pb-16">
              <div className="bg-white rounded-md border-0 shadow-custom">
                <div className="px-8 py-10 rounded-md xl:px-16 xl:py-20 3xl:px-28 ">
                  {/* is existing business */}
                  {/* <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4 xl:px-9 text-primary">
                    <p className="md:w-[512px] xl:max-w-3xl">
                      Do you currently have health insurance with ISOA?
                    </p>
                    <div className="w-[289px] md:w-[335px]">
                      <ToggleButtonGroup
                        name="has_existing_business"
                        value={businessDetails3?.has_existing_business}
                        handleToggleChange={handleToggleChange}
                        id="has_existing_business"
                      />
                    </div>
                  </div> */}
                  {/* if existing buisness is present */}
                  {/* {businessDetails3?.has_existing_business === "yes" && (
                    <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4 xl:px-9 my-10 text-grayCustom">
                      <div className="md:w-[512px] xl:max-w-3xl">
                        What is your existing business policy number?
                        <span className="align-middle">
                          <QuestionTooltip tooltipContent="If you can't provide your existing health insurance policy number, don't worry, you may leave this blank and we'll find it for you." />
                        </span>
                      </div>
                      <div className="md:w-[330px]">
                        <input
                          type="text"
                          name="existing_policy_number"
                          value={businessDetails3?.existing_policy_number}
                          onChange={handleChange}
                          className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-grayCustom`}
                          placeholder="Policy number"
                          maxLength={255}
                        />
                      </div>
                    </div>
                  )} */}
                  {/* promo code */}
                  {/* <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0 md:space-x-4 xl:px-9 my-10 text-primary">
                    <p className="md:w-[512px] xl:max-w-3xl">
                      Enter your referral code (optional)
                    </p>
                    <div className=" md:w-[330px]">
                      <div className=" relative w-full">
                        <input
                          type="text"
                          name="referralCode"
                          value={referralCode}
                          onChange={handleReferralCode}
                          className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none ${borderColorForReferralInput} pr-20`}
                          placeholder="Referral code"
                          maxLength={255}
                        />
                        {referralCode?.length > 0 && (
                          <button
                            onClick={handleReferralClear}
                            className={`absolute ${
                              referralCodeValidationData?.isValid
                                ? "right-28"
                                : "right-24"
                            } top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500`}
                          >
                            <svg
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
                          </button>
                        )}
                        <button
                          onClick={handleApply}
                          disabled={
                            referralCodeValidationData?.isValid ||
                            referralCode?.length != 6
                          }
                          className="absolute right-0 top-0 h-full px-5 bg-primaryBg text-white rounded-r-[4px] transition-all duration-300 hover:bg-opacity-80 hover:scale-105 hover:shadow-lg"
                        >
                          {referralCodeValidationData?.isValid
                            ? "Applied"
                            : "Apply"}
                        </button>
                      </div>
                      {referralCodeValidationData?.variant?.length > 0 &&
                        referralCodeValidationData?.message?.length > 0 && (
                          <PromoCodeValidationMessage
                            variant={referralCodeValidationData?.variant}
                            message={referralCodeValidationData?.message}
                          />
                        )}
                    </div>
                  </div> */}

                  {/* contact details form */}
                  <form className="flex flex-col space-y-8 text-primary xl:px-9  mb-10">
                    <div className="flex flex-col space-y-4">
                      <div className="font-bold text-[1.25rem]">
                        Name of contact person
                      </div>
                      <div>
                        <input
                          type="text"
                          name="insured_contact_name"
                          value={contactDetails?.insured_contact_name}
                          onChange={handleChangeForNameAndPhone}
                          className={`px-4 py-[10px] w-full rounded-lg border focus:outline-none border-grayCustom`}
                          placeholder="Full name"
                          maxLength={255}
                        />
                        {!isValidName &&
                          contactDetails?.insured_contact_name?.length > 0 && (
                            <p className="text-red-500 text-xs mt-2">
                              Please enter a valid name.
                            </p>
                          )}
                      </div>
                    </div>

                    {/* <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-4">
                        <div className="font-bold text-[1.25rem]">
                          Phone number
                        </div>
                        <div className="flex flex-col justify-center ">
                          <div
                            className={`flex border border-grayCustom rounded-lg w-full `}
                          >
                            <span
                              className="pl-4 
                         py-[10px]
                          pr-2 
                          "
                            > */}
                    {/* {loaderData?.env?.REMOVE_PHONE_PREFIXES ===
                              "false" ? (
                                <select
                                  className={`  border-0 outline-none`}
                                  name="countryCodeForPhone"
                                  value={countryCodeForPhoneInitialStep}
                                  onChange={(e) => {
                                    e.target.style.color = "#3B3B3B";
                                    setCountryCodeForPhoneInitialStep(
                                      e.target.value
                                    );
                                  }}
                                >
                                  {/* <option value="+64">+64</option> */}
                    {/* <option value="+61">+61</option> */}
                    {/* <option value="+91">+91</option>  */}
                    {/* </select>
                              ) : (
                                <span className="text-grayCustom">+61</span>
                              )} */}
                    {/* <span className="text-grayCustom">+1</span>
                            </span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              name="insured_contact_phone"
                              value={formatNewzealandNumber(
                                contactDetails?.insured_contact_phone
                              )}
                              onChange={handleChangeForNameAndPhone}
                              placeholder="xxx xxx xxxx"
                              className={`outline-none py-[10px] rounded-r-lg w-full`}
                              aria-label="Phone number"
                            />
                          </div>
                          {!isValid &&
                            contactDetails?.insured_contact_phone?.length >
                              0 && (
                              <p className="text-red-500 text-xs mt-2">
                                Please enter a valid USA phone number.
                              </p>
                            )}
                        </div>
                      </div>
                      <p className="text-sm">
                        We only cover businesses in USA.
                      </p>
                    </div> */}
                  </form>

                  <BusinessDetailsStep3Form
                    handleChange={handleChange}
                    isValidEmail={isValidEmail}
                    handleKeyDown={handleKeyDown}
                  />
                  {/* <div className=" xl:px-9 mt-8">
                    <div className="flex items-center gap-2 mb-8">
                      <Checkbox
                        id="contact_consent"
                        name="contact_consent"
                        label=""
                        checked={businessDetails3?.contact_consent}
                        onChange={handleContactConsent}
                      />
                      <p className="text-primary">
                        Contact consent
                      </p>
                    </div>
                    <InformationCard
                      title=""
                      body={
                        <span>
                          We may reach out to you regarding this quote using the
                          provided details. If you prefer not to be contacted,
                          please uncheck this box.
                          <svg
                            className="w-5 h-5 inline-block ml-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                        </span>
                      }
                      iconColor="#5841BF"
                      backgroundColor="#FAEFFC"
                    />
                  </div> */}

                  <div>
                    <FinalQuestionsForm
                      handleChange={handleFormDetailsChange}
                      handleToggleChange={handleToggleChange}
                      handleCheckBox={()=>{}}
                      isValidPostCode={true}
                      policyType={response?.data?.policies[0]?.policy_type}
                      parentPolicy={response?.data?.policies[0]?.parent_policy}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse items-center w-full pb-20 sm:flex-row sm:justify-between md:pb-40">
              <div className="w-60 mt-3 sm:mt-0">
                <Button
                  onClick={() => {
                    handleBackButton();
                    setStepState((prevState) => ({
                      ...prevState,
                      subStep: 2,
                    }));
                  }}
                  label="Back"
                  variant=""
                  disabled={false}
                  showTooltip={false}
                  tooltipContent=""
                />
              </div>
              <div className="w-60">
                <Button
                  onClick={() => {
                    handleSaveAndNextButton();
                  }}
                  label="Next"
                  variant="filled"
                  disabled={isNextButtonDisabled}
                  showTooltip={isNextButtonDisabled}
                  tooltipContent="Oops. Looks like some questions are incomplete. Please fill out all questions."
                />
              </div>
            </div>

            {/* If account already exists for the input email */}
            <Modal
              isOpen={isAccountAlreadyExistModal}
              onClose={() => setAccountAlreadyExistModal(false)}
              icon={<PolicyFoundIcon />}
              body={
                <div className=" flex flex-col space-y-4 md:space-y-6 items-center">
                  <h1 className="font-bold text-2xl md:text-[2.5rem] md:leading-[3rem]">
                    You already have an existing account with us!
                  </h1>
                </div>
              }
              footer={
                <div className="flex justify-center ">
                  <div className="w-60">
                    <Button
                      onClick={() => {
                        navigate("/login");
                      }}
                      label={`Login`}
                      variant="filled"
                      disabled={false}
                      showTooltip={false}
                      tooltipContent=""
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  try {
    const formData = await request.formData();
    const insuredContactEmail = String(formData.get("insured_contact_email"));
    const isReferralCodeValidation =
      formData.get("isReferralCodeValidation") == "true";

    if (isReferralCodeValidation) {
      const promocode = formData.get("referral_code");
      const validatePromoCodeBody = { promocode };
      const resData = await validatePromoCode(validatePromoCodeBody);

      return json(
        {
          response: {
            ...resData,
            isReferralCodeValidation: true,
          },
        },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    }

    const createUserResponse = await createUser(session, insuredContactEmail);
    if (createUserResponse == USER_CREATION_FAILED) {
      return json(
        {
          response: {
            status: {
              statusCode: 400,
              message: "Error",
              description: " Account creation failed for this email",
            },
          },
        },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    } else if (createUserResponse == USER_ALREADY_EXISTS) {
      const authenticateUserResponse = await authenticateUser(
        session,
        insuredContactEmail
      );
      if (authenticateUserResponse != EMAIL_VERIFICATION_CODE_SENT) {
        return json(
          {
            response: {
              status: {
                statusCode: 400,
                message: "Error",
                description: "Account creation failed for this email",
              },
            },
          },
          { headers: { "Set-Cookie": await commitSession(session) } }
        );
      }
    }
    return redirect("/quote-processing?quoteId=new-quote", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    console.error(error);
    return json(
      {
        response: {
          status: {
            statusCode: 400,
            message: "Error",
            description: "Internal Server Error",
          },
        },
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  }
}
