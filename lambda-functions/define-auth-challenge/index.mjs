export const handler = async (event) => {
    let emailCounts = {
      resetOtp: 0,
      failedVerification: 0,
    };
    let phoneCounts = {
      resetOtp: 0,
      failedVerification: 0,
    };
    event.request.session.forEach((challenge) => {
      if (
        challenge.challengeMetadata &&
        challenge.challengeMetadata.includes("EMAIL_RESET_OTP")
      )
        emailCounts.resetOtp += 1;
      else if (
        challenge.challengeMetadata &&
        challenge.challengeMetadata.includes("EMAIL_CONTINUE_OTP")
      )
        emailCounts.failedVerification += 1;
      else if (
        challenge.challengeMetadata &&
        challenge.challengeMetadata.includes("PHONE_RESET_OTP")
      )
        phoneCounts.resetOtp += 1;
      else if (
        challenge.challengeMetadata &&
        challenge.challengeMetadata.includes("PHONE_CONTINUE_OTP")
      )
        phoneCounts.failedVerification += 1;
    });
  
    if (
      event.request.session &&
      event.request.session.length &&
      event.request.session.slice(-1)[0].challengeResult == false &&
      (event.request.session.length >= 12 ||
        emailCounts.resetOtp >= 3 ||
        emailCounts.failedVerification >= 2 ||
        phoneCounts.failedVerification >= 2 ||
        phoneCounts.resetOtp >= 3)
    ) {
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
      event.request.session &&
      event.request.session.length &&
      event.request.session.slice(-1)[0].challengeName == "CUSTOM_CHALLENGE" && 
      event.request.session.slice(-1)[0].challengeResult == true &&
      (
        event.request.session.slice(-1)[0].challengeMetadata.includes("PHONE") ||
        event.request.userAttributes.phone_number_verified == undefined ||
        event.request.userAttributes.phone_number_verified == "false"
      )
    ) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    }

    return event;
  };
  