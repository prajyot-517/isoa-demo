import crypto from "crypto";

/*
  Method to encrypt any input data with given key
  Input: 
    key: A 256 bit encryption key
    data: Input data to be encrypted
  Output:
    Returns below values
    ciphertext: Encrypted text
    iv: The iv used for encryption
    tag: Authentication tag to verify data is not corrupt during decryption
*/
export const encryptSymmetric = (key, data, iv:string|null = null) => {
	if(!data)
		return {};
  iv = iv? iv: crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let ciphertext = cipher.update(data, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const tag = cipher.getAuthTag();
  ciphertext = `${ciphertext}:${tag.toString('base64')}`;
  return { ciphertext, iv };
};

/*
  Method to encrdecryptypt ciphertext
  Input: 
    key: A 256 bit encryption key
    ciphertext: Encrypted text
    iv: The iv used for encryption
    tag: Authentication tag to verify data is not corrupt during decryption
  Output:
    Returns decrypted data
*/
export const decryptSymmetric = (key, ciphertext, iv) => {
  const [ encryptedData, tag ] = ciphertext?.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let plaintext = decipher.update(encryptedData, "base64", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
};
