import crypto from "crypto";
import { render } from 'ejs';
import * as fs from "fs";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const handler = async (event) => {
  let verificationCode, challengeName;
  let previousChallenge, previousChallengeMetadata, verificationCodes;
  if(event.request.session.length > 0){
    previousChallenge = event.request.session.slice(-1)[0];
    previousChallengeMetadata = previousChallenge.challengeMetadata;
  }

  if (event.request.session.length == 0) {
    verificationCode = generateVerificationCode();
    await sendMail(
      event.request.userAttributes["email"],
      event.request.userAttributes["name"],
      verificationCode
    );
    challengeName = "EMAIL_INITIAL_OTP";
    event.response.challengeMetadata = challengeName + ":" + verificationCode;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCode,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "EMAIL",
      Destination: event.request.userAttributes["email"],
    };
  } else if (previousChallengeMetadata.includes("EMAIL") && previousChallenge.challengeResult == true) {
    verificationCode = generateVerificationCode();
    await sendMessage(
      event.request.userAttributes["phone_number"],
      verificationCode
    );
    challengeName = "PHONE_INITIAL_OTP";
    event.response.challengeMetadata = challengeName + ":" + verificationCode;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCode,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "PHONE",
      Destination: maskPhone(event.request.userAttributes["phone_number"]),
    };
  } else if (previousChallengeMetadata.includes("EMAIL") && event.request.clientMetadata?.resendVerificationCode === "true") {
    challengeName = "EMAIL_RESET_OTP";
    verificationCode = generateVerificationCode();
    await sendMail(
      event.request.userAttributes["email"],
      event.request.userAttributes["name"],
      verificationCode
    );
    verificationCodes = previousChallengeMetadata.split(":")[1];
    event.response.challengeMetadata =
      challengeName + ":" + verificationCodes + "," + verificationCode;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCodes + "," + verificationCode,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "EMAIL",
      Destination: event.request.userAttributes["email"],
    };
  } else if (previousChallengeMetadata.includes("PHONE") && event.request.clientMetadata?.resendVerificationCode === "true") {
    challengeName = "PHONE_RESET_OTP";
    verificationCode = generateVerificationCode();
    await sendMessage(
      event.request.userAttributes["phone_number"],
      verificationCode
    );
    verificationCodes = previousChallengeMetadata.split(":")[1];
    event.response.challengeMetadata =
      challengeName + ":" + verificationCodes + "," + verificationCode;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCodes + "," + verificationCode,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "PHONE",
      Destination: maskPhone(event.request.userAttributes["phone_number"]),
    };
  } else if(previousChallengeMetadata.includes("EMAIL")){
    // If the user makes a mistake, we pick code from the previous session instead of sending new code
    verificationCodes = previousChallengeMetadata.split(":")[1];
    challengeName = "EMAIL_CONTINUE_OTP";
    event.response.challengeMetadata = challengeName + ":" + verificationCodes;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCodes,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "EMAIL",
      Destination: event.request.userAttributes["email"],
    };
  }
  else if(previousChallengeMetadata.includes("PHONE")){
    // If the user makes a mistake, we pick code from the previous session instead of sending new code
    verificationCodes = previousChallengeMetadata.split(":")[1];
    challengeName = "PHONE_CONTINUE_OTP";
    event.response.challengeMetadata = challengeName + ":" + verificationCodes;
    event.response.privateChallengeParameters = {
      VerificationCode: verificationCodes,
    };
    event.response.publicChallengeParameters = {
      DeliveryMedium: "PHONE",
      Destination: maskPhone(event.request.userAttributes["phone_number"]),
    };
  }

  return event;
};

const maskPhone = (phoneNumber) => {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  const maskedNumber = '*'.repeat(cleanedNumber.length - 4) + cleanedNumber.slice(-4);
  return maskedNumber;
}

const createEmailTemplate = async (
  templateName,
  senderEmail,
  receiverEmail,
  userFullName,
  verificationCode
) => {
  const templateContent = fs.readFileSync("./template/" + templateName, 'utf-8');
  const templateData = {
    "codePlaceHolder": verificationCode,
    "contactUs": `${process.env.PORTAL_URL}/contact-us`,
    "amiPrivacyPolicy": "https://www.isoa.org/privacy-policy",
    "amiTermsOfUse": "https://www.isoa.org/terms",
    "policyWording": process.env.POLICY_WORDING_URL,
    "baseImageUrl": process.env.BASE_IMAGE_URL,
    "phones": {
      "enquiry": "(800) 244-1180"
    },
    "emails": {
        "contact": "customercare@isoa.org"
    }
  }
  const renderedBody = render(templateContent, templateData);
  const mailTemplate = {
    Source: senderEmail,
    Destination: {
      ToAddresses: [receiverEmail],
    },
    Message: {
      Subject: {
        Data: "ISOA Cyber Insurance: Verify your Email",
      },
      Body: {
        Html: {
          Data: renderedBody,
        },
      },
    },
  };
  return mailTemplate;
};

const sendMail = async (receiverEmail, userFullName, verificationCode) => {
  const senderEmail = process.env.SENDER_EMAIL;
  const templateName = "mfa_verification_template.html";
  const mailTemplate = await createEmailTemplate(
    templateName,
    senderEmail,
    receiverEmail,
    userFullName,
    verificationCode
  );
  const sendEmailCommand = new SendEmailCommand(mailTemplate);
  try {
    return await new SESClient({ region: "ap-southeast-2" }).send(
      sendEmailCommand
    );
  } catch (error) {
    console.error(error);
    console.error("Failed to send email authentication code");
    throw error;
  }
};

const generateVerificationCode = () => {
  const n = crypto.randomInt(0, 1000000);
  const verificationCode = n.toString().padStart(6, "0");
  return verificationCode;
};

const sendMessage = async(receiverPhoneNumber, verificationCode) => {
  try {
    const textMessage = `Your ISOA OTP is ${verificationCode}`;
    const messageDetails = {
      PhoneNumber : receiverPhoneNumber,
      Message : textMessage,
      Subject : "ISOA portal phone authentication code"
    }
  return await new SNSClient().send(new PublishCommand(messageDetails));
  } catch (error) {
    console.error(error);
    console.error("Failed to send phone authentication code");
    throw error;
  }
}