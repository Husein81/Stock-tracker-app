import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (userId: string) => {
  const jwtSecret = process.env.NEXTAUTH_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign({ id: userId }, jwtSecret);
  return token;
};

/**
 * Generate a random verification token for email verification
 * @returns A random hex string token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Get verification token expiry time (24 hours from now)
 * @returns Date object 24 hours in the future
 */
export const getVerificationExpiry = (): Date => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
};

export default generateToken;
