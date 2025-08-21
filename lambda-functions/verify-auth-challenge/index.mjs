export const handler = async (event) => {
    const expectedAnswers = event.request.privateChallengeParameters["VerificationCode"].split(",");
    const result = expectedAnswers.some((ele) =>  ele == event.request.challengeAnswer);
    if (result) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    return event;
};