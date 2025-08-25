// import { useLocation, useNavigate } from "@remix-run/react";
// import { useState } from "react";

// export default function PaymentDetails() {
//   const [formData, setFormData] = useState({
//     cardNumber: "",
//     expiryMonth: "",
//     expiryYear: "",
//     cvv: "",
//     cardHolder: "",
//   });

//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { price, quote_id, quote_option_id, policy_id } = location.state || {
//     price: "",
//     quote_id:"",
//     quote_option_id:"",
//     policy_id:"",
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     if (name === "cardNumber") {
//       formattedValue = value
//         .replace(/\s/g, "")
//         .replace(/(\d{4})/g, "$1 ")
//         .trim();
//       formattedValue = formattedValue.substring(0, 19);
//     }

//     if (name === "cvv") {
//       formattedValue = value.replace(/\D/g, "").substring(0, 3);
//     }

//     setFormData({ ...formData, [name]: formattedValue });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//       setPaymentSuccess(true);
//     }, 2000);
//   };

//   const handleNewPayment = () => {
//     setPaymentSuccess(false);
//     setFormData({
//       cardNumber: "",
//       expiryMonth: "",
//       expiryYear: "",
//       cvv: "",
//       cardHolder: "",
//     });
//     navigate("/my-policy");
//   };

//   if (paymentSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-green-600 text-2xl">✓</span>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Payment Successful!
//           </h2>
//           <p className="text-gray-600 mb-4">Your insurance is now covered.</p>
//           <p className="text-gray-600 mb-4">
//             We'll send you an email with policy documents.
//           </p>
//           <button
//             onClick={handleNewPayment}
//             className="w-full bg-primaryBg text-white py-2 rounded-3xl"
//           >
//             View Policy
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
//         <h1 className="text-xl font-semibold text-gray-800 mb-1">
//           Payment Checkout
//         </h1>

//         <div className="mb-4 pb-3 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-700">Amount:</span>
//             <span className="text-lg font-semibold">{price} (USD)</span>
//           </div>
//         </div>

//         <h2 className="text-lg font-medium text-gray-800 mb-4">
//           Credit Card Payment
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Card Number:*
//             </label>
//             <input
//               type="text"
//               name="cardNumber"
//               value={formData.cardNumber}
//               onChange={handleInputChange}
//               placeholder="4111 1111 1111 1111"
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Name On Card:*
//             </label>
//             <input
//               type="text"
//               name="cardHolder"
//               value={formData.cardHolder}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm text-gray-700 mb-1">
//                 Expiry Date:*
//               </label>
//               <div className="flex gap-2">
//                 <select
//                   name="expiryMonth"
//                   value={formData.expiryMonth}
//                   onChange={handleInputChange}
//                   className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-500"
//                   required
//                 >
//                   <option value="">MM</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
//                       {String(i + 1).padStart(2, "0")}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   name="expiryYear"
//                   value={formData.expiryYear}
//                   onChange={handleInputChange}
//                   className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-500"
//                   required
//                 >
//                   <option value="">YY</option>
//                   {Array.from({ length: 10 }, (_, i) => (
//                     <option
//                       key={i}
//                       value={String(new Date().getFullYear() + i).slice(-2)}
//                     >
//                       {String(new Date().getFullYear() + i).slice(-2)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm text-gray-700 mb-1">CVC:*</label>
//               <input
//                 type="text"
//                 name="cvv"
//                 value={formData.cvv}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded text-white font-medium ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-primaryBg hover:bg-primaryBg"
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                 Processing...
//               </span>
//             ) : (
//               "Submit"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import {
  useNavigate,
  useSubmit,
  useActionData,
  useSearchParams,
} from "@remix-run/react";
import {
  getSession,
  commitSession,
  destroySession,
} from "~/services/session.server";
import { verifyAuthToken } from "~/services/authentication.server";
import { bindQuote } from "~/services/quote.api";
import { SUCCESS } from "~/constants/string";
import PolicyProgressBar from "~/components/common/PolicyProgressBar";
import { useAppContext } from "~/context/ContextProvider";

export default function PaymentDetails() {
  const { stepState, setStepState } = useAppContext();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardHolder: "",
  });

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData: any = useActionData();

  const [searchParams] = useSearchParams();

  const price = searchParams.get("price");
  const quoteId = searchParams.get("quote_id_for_bind");
  const quoteOptionId = searchParams.get("quote_option_id_for_bind");
  const policyId = searchParams.get("policy_id");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      formattedValue = formattedValue.substring(0, 19);
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 3);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bindForm = new FormData();
    bindForm.append(
      "bindQuotePayload",
      JSON.stringify({
        quote_id_for_bind:quoteId,
        policy_id:policyId,
        quote_option_id_for_bind:quoteOptionId,
      })
    );
    submit(bindForm, { method: "POST" });
  };

  useEffect(() => {
    if (!actionData) return;
    if (actionData.response?.isQuoteBound === true) {
      setPaymentSuccess(true);
    } else {
      console.error("BindQuote failed:", actionData.response);
    }
    setLoading(false);
  }, [actionData]);

  const handleNewPayment = () => {
    setPaymentSuccess(false);
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardHolder: "",
    });
    navigate(`/my-policy?policyId=${policyId}`);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-4">Your insurance is now covered.</p>
          <p className="text-gray-600 mb-4">
            We'll send you an email with policy documents.
          </p>
          <button
            onClick={handleNewPayment}
            className="w-full bg-primaryBg text-white py-2 rounded-3xl"
          >
            View Policy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div>
        <PolicyProgressBar
          currentStep={stepState?.currentStep}
          subStep={stepState?.subStep}
        />
      </div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            Payment Checkout
          </h1>

          <div className="mb-4 pb-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Amount:</span>
              <span className="text-lg font-semibold">{price} (USD)</span>
            </div>
          </div>

          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Credit Card Payment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Card Number:*
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="4111 1111 1111 1111"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Name On Card:*
              </label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Expiry Date:*
                </label>
                <div className="flex gap-2">
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleInputChange}
                    className="flex-1 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-500"
                    required
                  >
                    <option value="">YY</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option
                        key={i}
                        value={String(new Date().getFullYear() + i).slice(-2)}
                      >
                        {String(new Date().getFullYear() + i).slice(-2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  CVC:*
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primaryBg hover:bg-primaryBg"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  // if (!(await verifyAuthToken(session))) {
  //   return redirect("/login", {
  //     headers: { "Set-Cookie": await destroySession(session) },
  //   });
  // }

  const formData = await request.formData();
  const payload = JSON.parse(formData.get("bindQuotePayload") as string);

  const response = await bindQuote(session, payload);

  if (response?.status?.message === SUCCESS) {
    return json(
      { response: { isQuoteBound: true } },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  }
  return json(
    { response },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}
