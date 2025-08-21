import { createHmac } from "crypto";
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandOutput,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  NotAuthorizedException,
  RespondToAuthChallengeCommand,
  RespondToAuthChallengeCommandOutput,
  UserNotFoundException,
  UsernameExistsException,
  GetUserAttributeVerificationCodeCommand,
  VerifyUserAttributeCommand,
  UpdateUserAttributesCommand,
  CodeMismatchException,
  LimitExceededException,
  TooManyRequestsException,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";
import { Session } from "@remix-run/node";
import { v4 } from "uuid";
import {
  AUTHENTICATION_FAILED,
  AUTHENTICATION_SUCCESSFUL,
  EMAIL_VERIFICATION_CODE_SENT,
  INVALID_OTP,
  INVALID_PHONE_OTP,
  OTP_EXPIRED,
  OTP_LIMIT_REACHED,
  PHONE_OTP_GENERATION_FAILED,
  PHONE_OTP_SENT,
  PHONE_OTP_VERIFICATION_FAILED,
  PHONE_OTP_VERIFICATION_SUCCESSFUL,
  PHONE_UPDATED,
  PHONE_UPDATION_FAILED,
  RESEND_OTP_SUCCESSFUL,
  SF_UUID,
  TOO_MANY_REQUESTS,
  USER_ALREADY_EXISTS,
  USER_CREATED_SUCCESSFULLY,
  USER_CREATION_FAILED,
  USER_DOES_NOT_EXIST,
} from "~/constants/string";
import { DBHandler } from "./db.server";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { JwtExpiredError } from "aws-jwt-verify/error";
import { SimpleJwksCache } from "aws-jwt-verify/jwk";
import { SimpleJsonFetcher } from "aws-jwt-verify/https";

const client = new CognitoIdentityProviderClient();

// export const isPhoneVerified = async (session: Session) => {
//   const userDetails = await getCognitoUserDetails(session);
//   if (userDetails?.phone_number_verified == "true") return true;
//   return false;
// };

// export const getVerifiedPhoneNumber = async (session: Session) => {
//   const userDetails = await getCognitoUserDetails(session);
//   return userDetails?.phone_number;
// };

const getCognitoUserId = async (accessToken: string) => {
  let userId;
  const input = {
    AccessToken: accessToken,
  };
  const command = new GetUserCommand(input);
  const response = await client.send(command);
  if (
    response.$metadata.httpStatusCode >= 200 &&
    response.$metadata.httpStatusCode < 300
  ) {
    userId = response.UserAttributes?.find(
      (attribute) => attribute.Name == SF_UUID
    )?.Value;
  }
  return userId;
};

export const getUserId = async (session: Session) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve(process.env.SF_INTEGRATION_USERNAME);
      } else {
        reject("error");
      }
    }, 200);
  });

  // let dbHandler = await DBHandler.getConnection();
  // try {
  //   const accessToken = session.get("accessToken");
  //   let userId = await dbHandler.getClientUserId(session.get("sessionId"));
  //   if (userId) {
  //     return userId;
  //   }
  //   return await getCognitoUserId(accessToken);
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // } finally {
  //   dbHandler.closeConnection();
  // }
};

const getSecretHash = (username: String) => {
  const hasher = createHmac("sha256", process.env.APP_CLIENT_SECRET);
  hasher.update(`${username}${process.env.APP_CLIENT_ID}`);
  return hasher.digest("base64");
};

const generatePassword = () => {
  const getRandomNumber = (n: number) => {
    return Math.floor(Math.random() * n);
  };

  const insertCharAtRandomPos = (inputString: string, inputChar: string) => {
    let randomNum = getRandomNumber(inputString.length);
    inputString =
      inputString.slice(0, randomNum) +
      inputChar +
      inputString.slice(randomNum);
    return inputString;
  };

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@-#$?";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters[getRandomNumber(characters.length)];
  }
  password = insertCharAtRandomPos(password, characters[getRandomNumber(10)]);
  password = insertCharAtRandomPos(
    password,
    characters[10 + getRandomNumber(26)]
  );
  password = insertCharAtRandomPos(
    password,
    characters[36 + getRandomNumber(26)]
  );
  password = insertCharAtRandomPos(
    password,
    characters[62 + getRandomNumber(7)]
  );

  return password;
};

const getUsernameFromAccessToken = (session: Session) => {
  let accessToken = session.get("accessToken");
  let payload = JSON?.parse(atob(accessToken?.split(".")[1]));
  return payload?.username;
};

export const adminUpdateUserAttributes = async (
  session: Session,
  attributeData
) => {
  const attributeVerificationResponse = await client.send(
    new AdminUpdateUserAttributesCommand({
      UserAttributes: attributeData,
      Username: getUsernameFromAccessToken(session),
      UserPoolId: process.env.USER_POOL_ID,
    })
  );
  return true;
};

/*
    Method: 
        Fetches details of current logged in user from cognito
    Input: 
        accessToken: Accesstoken for current logged in user
    Output:
        Returns userId for current user
*/
// export const getCognitoUserDetails = async (session: Session) => {
//   let accessToken = session.get("accessToken");
//   let userDetails = {};
//   const input = {
//     AccessToken: accessToken,
//   };
//   const command = new GetUserCommand(input);
//   const response = await client.send(command);
//   if (
//     response.$metadata.httpStatusCode >= 200 &&
//     response.$metadata.httpStatusCode < 300
//   ) {
//     response.UserAttributes?.forEach((attribute) => {
//       userDetails[attribute.Name] = attribute.Value;
//     });
//   }
//   return userDetails;
// };

/*
    Method: 
        Refreshes tokens using refreshToken
    Input: 
        refreshToken: RefreshToken for current logged in user
    Output:
        Returns new accessToken, refreshToken, userId
*/
const refreshAccessToken = async (dbHandler: DBHandler, session: Session) => {
  let accessToken;
  const sessionId = session.get("sessionId");
  const refreshToken = await dbHandler.getClientRefreshToken(sessionId);
  const username = getUsernameFromAccessToken(session);
  let secretHash = getSecretHash(username);
  const input = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: process.env.APP_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
      SECRET_HASH: secretHash,
    },
  };
  const command = new InitiateAuthCommand(input);
  const response = await client.send(command);
  if (
    response.$metadata.httpStatusCode >= 200 &&
    response.$metadata.httpStatusCode < 300
  ) {
    const idToken = response.AuthenticationResult?.IdToken;
    accessToken = response.AuthenticationResult?.AccessToken;
    session.set("accessToken", accessToken);
    let userId = await getCognitoUserId(accessToken);
    await dbHandler.updateClientSessionTokens(
      sessionId,
      accessToken,
      idToken,
      userId
    );
  }
  return true;
};

/*
    Method: 
        Verifies if the accessToken is valid. Refreshes tokens if it is expired
    Input: 
        session: Session object for the current session
    Output:
        Returns true if verification is successful.
*/
export const verifyAuthToken = async (session: Session) => {
  return true;
  // if (!session.has("accessToken")) return false;
  // let dbHandler = await DBHandler.getConnection();

  // let accessToken = session.get("accessToken");
  // try {
  //   let storedAccessToken = await dbHandler.getClientAccessToken(
  //     session.get("sessionId")
  //   );
  //   let verifier = CognitoJwtVerifier.create(
  //     {
  //       userPoolId: process.env.USER_POOL_ID,
  //       tokenUse: "access",
  //       clientId: process.env.APP_CLIENT_ID,
  //     },
  //     {
  //       jwksCache: new SimpleJwksCache({
  //         fetcher: new SimpleJsonFetcher({
  //           defaultRequestOptions: { responseTimeout: 3000 },
  //         }),
  //       }),
  //     }
  //   );
  //   try {
  //     const payload = await verifier.verify(accessToken);
  //     if (accessToken != storedAccessToken && payload) {
  //       const updateAccessTokenResult = await dbHandler.updateClientAccessToken(
  //         session.get("sessionId"),
  //         accessToken
  //       );
  //       if (updateAccessTokenResult == "INVALID_SESSION_ID") return false;
  //     }
  //   } catch (err) {
  //     if (err instanceof JwtExpiredError) {
  //       try {
  //         await refreshAccessToken(dbHandler, session);
  //       } catch (err) {
  //         console.error("Error", err);
  //         return false;
  //       }
  //     } else {
  //       console.error("Error:", err);
  //       return false;
  //     }
  //   }
  //   return true;
  // } catch (error) {
  //   console.error(error);
  // } finally {
  //   await dbHandler.closeConnection();
  // }
};

const userConfirmation = async (
  session: Session,
  username: string,
  temporaryPassword: string
) => {
  try {
    const adminSetUserPasswordResponse = await client.send(
      new AdminSetUserPasswordCommand({
        Password: generatePassword(),
        Permanent: true,
        Username: username,
        UserPoolId: process.env.USER_POOL_ID,
      })
    );
    if (adminSetUserPasswordResponse?.$metadata?.httpStatusCode != 200) {
      console.log(
        "User Confirmation Failed, Response:",
        JSON.stringify(adminSetUserPasswordResponse)
      );
      return "USER_CONFIRMATION_FAILED";
    }
    return "USER_CONFIRMATION_SUCCESSFUL";
  } catch (error) {
    console.error(error);

    return "USER_CONFIRMATION_FAILED";
  }
};

export const createUser = async (session: Session, username: string) => {
  try {
    const temporaryPassword = generatePassword();
    const createUserResponse: AdminCreateUserCommandOutput = await client.send(
      new AdminCreateUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        UserAttributes: [
          {
            Name: "email",
            Value: username,
          },
        ],
        MessageAction: "SUPPRESS",
        TemporaryPassword: temporaryPassword,
        DesiredDeliveryMediums: ["EMAIL"],
      })
    );
    if (
      createUserResponse?.$metadata?.httpStatusCode < 200 ||
      createUserResponse?.$metadata?.httpStatusCode >= 300
    )
      return USER_CREATION_FAILED;
    const userConfirmationResponse = await userConfirmation(
      session,
      username,
      temporaryPassword
    );
    if (userConfirmationResponse == "USER_CONFIRMATION_FAILED")
      return USER_CREATION_FAILED;
    const authenticateUserResponse = await authenticateUser(session, username);
    if (authenticateUserResponse == EMAIL_VERIFICATION_CODE_SENT)
      return USER_CREATED_SUCCESSFULLY;
    else return USER_CREATION_FAILED;
  } catch (error) {
    console.error(error);

    if (error instanceof UsernameExistsException) {
      return USER_ALREADY_EXISTS;
    }
  }
};

export const authenticateUser = async (session: Session, username: any) => {
  try {
    const secretHash = getSecretHash(username);
    const authResponse: InitiateAuthCommandOutput = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "CUSTOM_AUTH",
        ClientId: process.env.APP_CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          SECRET_HASH: secretHash,
        },
      })
    );
    if (authResponse.ChallengeName == "CUSTOM_CHALLENGE") {
      session.set("username", authResponse?.ChallengeParameters?.USERNAME);
      session.set(
        "deliveryEmail",
        authResponse?.ChallengeParameters?.DeliveryEmail
      );
      session.set("authSession", authResponse?.Session);
    }
    return EMAIL_VERIFICATION_CODE_SENT;
  } catch (error) {
    console.error(error);

    if (error instanceof UserNotFoundException) {
      return USER_DOES_NOT_EXIST;
    }
    throw error;
  }
};

/*
    Method: 
        Verifies if the authentication code is valid
    Input: 
        session: Session object for the current session
        verificationCode: Verification code entered by user
        resendVerificatioCode: Can be true or false. This parameter controls if user wants a new verification code
    Output:
        Returns one of the set (AUTHENTICATION_SUCCESSFUL, INVALID_OTP, PHONE_OTP_SENT, RESEND_OTP_SUCCESSFUL, AUTHENTICATION_FAILED)
*/
export const verifyAuthCode = async (
  session: Session,
  verificationCode: string,
  resendVerificationCode: boolean = false,
  currentChallengeType: string = "EMAIL"
) => {
  const dbHandler = await DBHandler.getConnection();
  try {
    if (resendVerificationCode || verificationCode == "")
      verificationCode = "invalid";
    const authSession = session.get("authSession");
    const username = session.get("username");
    const verificationOutput: RespondToAuthChallengeCommandOutput =
      await client.send(
        new RespondToAuthChallengeCommand({
          ChallengeName: "CUSTOM_CHALLENGE",
          ClientId: process.env.APP_CLIENT_ID,
          ChallengeResponses: {
            USERNAME: username,
            ANSWER: verificationCode,
            SECRET_HASH: getSecretHash(username),
          },
          ClientMetadata: {
            resendVerificationCode: String(resendVerificationCode),
          },
          Session: authSession,
        })
      );
    if (
      verificationOutput.$metadata.httpStatusCode == 200 &&
      verificationOutput.AuthenticationResult?.AccessToken
    ) {
      const accessToken = verificationOutput.AuthenticationResult?.AccessToken;
      const idToken = verificationOutput.AuthenticationResult?.IdToken;
      const refreshToken =
        verificationOutput.AuthenticationResult?.RefreshToken;
      const userId = await getCognitoUserId(
        verificationOutput.AuthenticationResult?.AccessToken
      );
      const sessionId = v4();

      session.unset("username");
      session.unset("authSession");
      session.unset("deliveryEmail");
      session.unset("deliveryPhone");
      session.set("sessionId", sessionId);
      session.set("accessToken", accessToken);

      await dbHandler.addClientSessionRecord(
        sessionId,
        accessToken,
        idToken,
        refreshToken,
        userId
      );
      return AUTHENTICATION_SUCCESSFUL;
    } else if (
      verificationOutput.$metadata.httpStatusCode == 200 &&
      verificationOutput.ChallengeName == "CUSTOM_CHALLENGE" &&
      verificationOutput?.ChallengeParameters?.DeliveryMedium === "PHONE"
    ) {
      session.set("authSession", verificationOutput.Session);
      session.set(
        "deliveryPhone",
        verificationOutput?.ChallengeParameters?.Destination
      );
      session.unset("deliveryEmail");
      if (resendVerificationCode) {
        return RESEND_OTP_SUCCESSFUL;
      } else if (currentChallengeType === "PHONE") {
        return INVALID_OTP;
      }
      return PHONE_OTP_SENT;
    } else if (
      verificationOutput.$metadata.httpStatusCode == 200 &&
      verificationOutput.ChallengeName == "CUSTOM_CHALLENGE"
    ) {
      session.set("authSession", verificationOutput.Session);
      session.set(
        "deliveryEmail",
        verificationOutput?.ChallengeParameters?.Destination
      );

      if (resendVerificationCode) {
        return RESEND_OTP_SUCCESSFUL;
      } else {
        return INVALID_OTP;
      }
    } else {
      return AUTHENTICATION_FAILED;
    }
  } catch (error) {
    console.error(error);

    if (error instanceof NotAuthorizedException) {
      return AUTHENTICATION_FAILED;
    }
    throw error;
  } finally {
    await dbHandler.closeConnection();
  }
};

export const generatePhoneOTP = async (session: Session) => {
  try {
    const accessToken = session.get("accessToken");
    const command = new GetUserAttributeVerificationCodeCommand({
      AccessToken: accessToken,
      AttributeName: "phone_number",
    });
    const generateOTPResponse: any = await client.send(command);
    if (
      generateOTPResponse?.$metadata?.httpStatusCode < 200 ||
      generateOTPResponse?.$metadata?.httpStatusCode >= 300
    )
      return PHONE_OTP_GENERATION_FAILED;
    const codeDeliveryDetails = generateOTPResponse.CodeDeliveryDetailsList;
    if (codeDeliveryDetails && codeDeliveryDetails.length > 0) {
      codeDeliveryDetails.forEach((ele) => {
        if (ele.DeliveryMedium == "SMS") {
          session.set("deliveryPhone", ele.Destination);
        } else if (ele.DeliveryMedium == "EMAIL") {
          session.set("deliveryEmail", ele.Destination);
        }
      });
    }
    return PHONE_OTP_SENT;
  } catch (error) {
    console.error(error);
    if (error instanceof LimitExceededException) {
      return OTP_LIMIT_REACHED;
    } else if (error instanceof TooManyRequestsException) {
      return TOO_MANY_REQUESTS;
    }
  }
};

export const verifyPhoneOTP = async (
  session: Session,
  verificationCode: string
) => {
  try {
    const accessToken = session.get("accessToken");
    const command = new VerifyUserAttributeCommand({
      AccessToken: accessToken,
      AttributeName: "phone_number",
      Code: verificationCode,
    });
    const verifyOTPResponse = await client.send(command);
    if (
      verifyOTPResponse?.$metadata?.httpStatusCode < 200 ||
      verifyOTPResponse?.$metadata?.httpStatusCode >= 300
    )
      return PHONE_OTP_VERIFICATION_FAILED;
    else if (verifyOTPResponse?.$metadata?.httpStatusCode == 200)
      session.unset(
        "deliveryPhone",
        verifyOTPResponse?.CodeDeliveryDetails?.Destination
      );
    return PHONE_OTP_VERIFICATION_SUCCESSFUL;
  } catch (error) {
    if (error instanceof CodeMismatchException) {
      return INVALID_PHONE_OTP;
    } else if (error instanceof TooManyRequestsException) {
      return TOO_MANY_REQUESTS;
    } else if (error instanceof LimitExceededException) {
      return OTP_LIMIT_REACHED;
    } else if (error instanceof ExpiredCodeException) {
      return OTP_EXPIRED;
    }
    console.error(error);
  }
};

export const updateUserAttributes = async (session: Session, attributeData) => {
  try {
    const accessToken = session?.get("accessToken");
    const command = new UpdateUserAttributesCommand({
      UserAttributes: attributeData,
      AccessToken: accessToken,
    });
    const updateUserAttributeResponse = await client.send(command);
    if (
      updateUserAttributeResponse?.$metadata?.httpStatusCode < 200 ||
      updateUserAttributeResponse?.$metadata?.httpStatusCode >= 300
    )
      return PHONE_UPDATION_FAILED;
    return PHONE_UPDATED;
  } catch (error) {
    console.error(error);
  }
};
