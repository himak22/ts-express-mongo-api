import crypto from "crypto";

const SECRET = "Himak-REST-API"; // Secret key for hashing
export const random = () => crypto.randomBytes(128).toString("base64"); // Generate a random string
export const authentication = (salt: string, password: string) => {
  // Hash a password
  return crypto
    .createHmac("sha256", [salt, password].join("/")) // Create a hash
    .update(SECRET) // Add the secret key
    .digest("hex"); // Return the hash as a hex string
};
