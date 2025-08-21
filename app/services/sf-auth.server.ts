import crypto from "crypto";
import { v4 } from "uuid";
import axios from "axios";
import { DBHandler } from './db.server';

const getSignedJWTToken = () => {
  let token = "";

  const header = '{"alg":"RS256"}';
  // Encode the JWT Header and add it to our string to sign
  token += Buffer.from(header).toString("base64url");

  // Separate with a period
  token += ".";

  // Creates the JWT Claims Object
  const currentTime = Math.floor(Date.now() / 1000);
  const exp = currentTime + 300;
  const jti = v4();
  let claims = {
    iss: process.env.SF_CONNECTED_APP_CLIENT_ID,
    sub: process.env.SF_INTEGRATION_USERNAME,
    aud: process.env.SF_AUTH_AUDIENCE_URL,
    exp: exp,
    jti: jti,
  };
  
  // Add the encoded claims object
  token += Buffer.from(JSON.stringify(claims)).toString("base64url");

  // Load the private key
  // const keyBytes = readFileSync(path.join(path.resolve('.'), '/server.pass.key'));
  const keyBytes = process.env.SF_PRIVATE_KEY;
  // const decryptedKey = crypto.privateDecrypt(keyBytes, "mKpQr247#!sD");
  // const privateKey  = crypto.createPrivateKey(decryptedKey);

  // Sign the JWT Header + "." + JWT Claims Object
  const signer = crypto.createSign("sha256");
  signer.update(token);
  const signature = signer.sign(
    { key: keyBytes, passphrase: process.env.SF_KEY_PASSPHRASE },
    "base64url"
  );

  // Separate with a period
  token += ".";

  // Add the encoded signature
  token += signature;

  return token;
};

export const getNewAccessToken = async () => {
  const dbHandler = await DBHandler.getConnection();
  try {
    const sfURL = process.env.SF_BASE_URL + "oauth2/token";
    const signedToken = getSignedJWTToken();
    const paramBody = 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+signedToken ;
    const response = await axios.post(sfURL, paramBody );
    const accessToken = response.data.access_token;
    await dbHandler.updateServerToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    await dbHandler.closeConnection();
  }
}

export const getAccessToken = async () => {
  let dbHandler = await DBHandler.getConnection();
  try {
    let accessToken = await dbHandler.getServerToken();
    if (!accessToken)
      getNewAccessToken();
    return accessToken;
  }
  catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbHandler.closeConnection();
  }
}
