import axios, { AxiosError } from "axios";
import { Session } from "@remix-run/node";
import { getUserId } from "./authentication.server";
import { getNewAccessToken } from "./sf-auth.server";

interface postRequest {
  url: string;
  body: any;
}

interface getRequest {
  url: string;
}

const paymentGatewayUserKey = process.env.PAYMENT_GATEWAY_USER_KEY;
const maxRetry = 3;

export const post = async (
  session: Session,
  request: postRequest,
  accessToken: any,
  numRetries: number = 0
) => {
  try {
    const userId = await getUserId(session);
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Solvefins-Cylo-BP/1.0",
      Authorization: "Bearer " + accessToken || "",
      "X-Auth-Customer-Id": "22355ae0-8116-403e-b58e-95eb4014542f",
    };
    const res = await axios.post(request.url, request.body, { headers });
    return res.data;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      if (numRetries >= maxRetry) throw Error("Internal Server Error");
      return await post(
        session,
        request,
        await getNewAccessToken(),
        numRetries + 1
      );
    } else throw error;
  }
};

export const get = async (
  session: Session,
  request: getRequest,
  accessToken: string,
  numRetries: number = 0
) => {
  try {
    const userId = await getUserId(session);
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Solvefins-Cylo-BP/1.0",
      Authorization: "Bearer " + accessToken || "",
      "X-Auth-Customer-Id": "22355ae0-8116-403e-b58e-95eb4014542f",
    };
    const res = await axios.get(request.url, { headers });
    return res.data;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      if (numRetries >= maxRetry) throw Error("Internal Server Error");
      return await get(
        session,
        request,
        await getNewAccessToken(),
        numRetries + 1
      );
    } else throw error;
  }
};

export const put = async (
  session: Session,
  request: postRequest,
  accessToken: any,
  numRetries: number = 0
) => {
  try {
    const userId = await getUserId(session);
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Solvefins-Cylo-BP/1.0",
      Authorization: "Bearer " + accessToken || "",
      "X-Auth-Customer-Id": "22355ae0-8116-403e-b58e-95eb4014542f",
    };

    const res = await axios.put(request.url, request.body, { headers });
    return res.data;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      if (numRetries >= maxRetry) throw Error("Internal Server Error");
      return await put(
        session,
        request,
        await getNewAccessToken(),
        numRetries + 1
      );
    } else throw error;
  }
};

export const downloadDocumentGet = async (
  session: Session,
  request: getRequest,
  accessToken: any,
  numRetries: number = 0
) => {
  try {
    const userId = await getUserId(session);
    const headers = {
      "Content-Type": "application/octet-stream",
      "User-Agent": "Solvefins-Cylo-BP/1.0",
      Authorization: "Bearer " + accessToken || "",
      "X-Auth-Customer-Id": "22355ae0-8116-403e-b58e-95eb4014542f",
    };

    const res = await axios.get(request.url, {
      headers,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      if (numRetries >= maxRetry) throw Error("Internal Server Error");
      return await downloadDocumentGet(
        session,
        request,
        await getNewAccessToken(),
        numRetries + 1
      );
    } else throw error;
  }
};

export const paymentGatewayPost = async (request: postRequest) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${paymentGatewayUserKey}`,
  };
  const res = await axios.post(request.url, request.body, {
    headers,
  });
  return { data: res.data, status: res.status };
};

export const paymentGatewayGet = async (request: getRequest) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${paymentGatewayUserKey}`,
  };
  const res = await axios.get(request.url, {
    headers,
  });
  return { data: res.data, status: res.status };
};

export const unAuthenticatedPost = async (request: postRequest) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const res = await axios.post(request.url, request.body, { headers });
  return res.data;
};

export const getOccupationSearch = async (request: {
  url: string | undefined;
  body: string;
}) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "525a514d-6b65-4156-975d-c30370ddbfb4",
  };

  try {
    const response = await axios.post(request?.url, request?.body, { headers });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      throw Error("Internal Server Error");
    } else {
      throw error;
    }
  }
};

