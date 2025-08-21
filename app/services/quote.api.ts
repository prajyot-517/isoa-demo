import {
  ACTIVE_POLICY_OR_QUOTE,
  API_PARAMS,
  BINDNZ,
  CANCEL,
  COI,
  CYBER,
  DOMAINCHECK,
  EDIT_QUOTE_OPTIONS,
  EMAIL_DOCUMENTS,
  ENGLISH,
  GENERAL_ENQUIRY,
  NZD,
  POLICIES,
  POLICY,
  PURCHASE,
  QUOTES,
  QUOTE_OPTION_ID,
  REFER,
  REJECT,
  RENEW,
  RESTART,
  STORE_WINDCAVE_SESSION,
  VALIDATE_PROMO_CODE,
  WINDCAVE_NOTIFICATION_CALLBACK,
} from "~/constants/string";
import {
  downloadDocumentGet,
  get,
  getOccupationSearch,
  paymentGatewayGet,
  paymentGatewayPost,
  post,
  put,
  unAuthenticatedPost,
} from "./request";
import { getAccessToken } from "./sf-auth.server";
import { Session } from "@remix-run/node";
import { TYPES_OF_PAYMENTS } from "~/constants";

const BASE_URL = process.env.SF_BASE_URL;
const UNAUTHENTICATED_BASE_URL = process.env.SF_UNAUTHENTICATED_BASE_URL;
const DOWNLOAD_DOCUMENT_ENDPOINT = BASE_URL?.slice(
  0,
  BASE_URL?.indexOf("/services") + 1
);
const PAYMENT_GATEWAY_CREATE_SESSION =
  process.env.PAYMENT_GATEWAY_CREATE_SESSION;

const PAYMENT_GATEWAY_FETCH_TRANSACTION_RESULT =
  process.env.PAYMENT_GATEWAY_FETCH_TRANSACTION_RESULT;

const OCCUPATION_LIST_URL = process.env.OCCUPATION_LIST_URL;

export const createPolicy = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICIES,
      body: JSON.stringify(body),
    };
    return await post(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const urlBlacklistCheck = async (body: any) => {
  try {
    const request = {
      url: UNAUTHENTICATED_BASE_URL + API_PARAMS + CYBER + "/" + DOMAINCHECK,
      body: JSON.stringify(body),
    };
    const response = await unAuthenticatedPost(request);
    return response;
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const getPolicyById = async (session: Session, policyId: string) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICIES + "/" + policyId,
    };
    return await get(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const updatePolicy = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICIES,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const getQuoteById = async (session: Session, quoteId: string) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + QUOTES + "/" + quoteId,
    };

    return await get(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const createQuote = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + QUOTES,
      body: JSON.stringify(body),
    };
    return await post(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const bindQuote = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + BINDNZ,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.log("error", error);
  }
};

export const referToUW = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + REFER,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.log("error", error);
  }
};

export const rejectQuote = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + REJECT,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.log("error", error);
  }
};

export const editQuote = async (
  session: Session,
  body: any,
  quoteId: string
) => {
  try {
    const request = {
      url: BASE_URL + QUOTES + "/" + quoteId,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.log("error", error);
  }
};

export const downloadDocument = async (
  session: Session,
  documentUrlPath: any
) => {
  try {
    const request = {
      url: DOWNLOAD_DOCUMENT_ENDPOINT + documentUrlPath,
    };
    return downloadDocumentGet(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const downloadCOIDocument = async (
  session: Session,
  policyId: string
) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + COI + "/" + policyId,
    };
    return await downloadDocumentGet(session, request, await getAccessToken());
  } catch (error) {
    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: "Internal server error",
      },
      data: {
        policies: [],
      },
    };
  }
};

export const editCoverageAndExcess = async (
  session: Session,
  body: any,
  quoteId: string
) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + EDIT_QUOTE_OPTIONS + "/" + quoteId,
      body: JSON.stringify(body),
    };
    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const cancelPolicy = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + CANCEL,
      body: JSON.stringify(body),
    };
    return await post(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const contactUs = async (body: any) => {
  try {
    const request = {
      url: UNAUTHENTICATED_BASE_URL + API_PARAMS + GENERAL_ENQUIRY,
      body: JSON.stringify({ ...body, enquiry_source: "Direct Portal" }),
    };
    return await unAuthenticatedPost(request);
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const createPaymentGatewaySession = async (
  session: Session,
  body: any
) => {
  const notificationUrl =
    UNAUTHENTICATED_BASE_URL +
    API_PARAMS +
    WINDCAVE_NOTIFICATION_CALLBACK +
    "?" +
    QUOTE_OPTION_ID +
    "=" +
    body?.quote_option_id;

  const paymentPayload = {
    type: PURCHASE,
    amount: Number(body?.amount).toFixed(2),
    currency: NZD,
    merchantReference: body?.quote_option_id, //Quote Option Id
    metaData: [body?.quote_id, body?.quote_number], // Quote id & Quote number
    callbackUrls: {
      approved: body?.payment_success_url,
      declined: body?.payment_failed_url,
      cancelled: body?.payment_failed_url,
    },
    notificationUrl: notificationUrl,
    language: ENGLISH,
    methods: TYPES_OF_PAYMENTS,
    storeCard: true,
  };
  try {
    const request = {
      url: PAYMENT_GATEWAY_CREATE_SESSION,
      body: JSON.stringify(paymentPayload),
    };
    return await paymentGatewayPost(request);
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const getPaymentGatewayResult = async (
  session: Session,
  sessionId: string
) => {
  try {
    const request = {
      url: PAYMENT_GATEWAY_FETCH_TRANSACTION_RESULT + sessionId,
    };
    return await paymentGatewayGet(request);
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const restartQuote = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + RESTART,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const emailQuote = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + EMAIL_DOCUMENTS,
      body: JSON.stringify(body),
    };
    return await post(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const getActivePolicyOrQuote = async (session: Session) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + ACTIVE_POLICY_OR_QUOTE,
    };
    return await get(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const renewPolicy = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + POLICY + "/" + RENEW,
      body: JSON.stringify(body),
    };
    return await post(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const storeWindcaveSession = async (session: Session, body: any) => {
  try {
    const request = {
      url: BASE_URL + API_PARAMS + STORE_WINDCAVE_SESSION,
      body: JSON.stringify(body),
    };

    return await put(session, request, await getAccessToken());
  } catch (error) {
    console.error(error);

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};

export const getOccupationsList = async (query: string) => {
  try {
    const body = {
      query: query,
      match_type_exact: true,
      match_type_fuzzy: true,
      match_type_semantic: true,
    };
    const request = {
      url: OCCUPATION_LIST_URL,
      body: JSON.stringify(body),
    };
    return await getOccupationSearch(request);
  } catch (error) {
    console.error(error);
    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: "An unexpected error has occurred. Please try again",
      },
      data: {
        occupation: [],
      },
    };
  }
};

export const validatePromoCode = async (body: any) => {
  try {
    const request = {
      url: UNAUTHENTICATED_BASE_URL + API_PARAMS + VALIDATE_PROMO_CODE,
      body: JSON.stringify(body),
    };
    return await unAuthenticatedPost(request);
  } catch (error) {
    console.error(error, "error in api");

    return {
      status: {
        statusCode: 500,
        message: "Error",
        description: error,
      },
      data: {
        policies: [],
      },
    };
  }
};
