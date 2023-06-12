// Arquivo que vai lidar com a criptografia

const SALT_RANDOMS = 8;

import { genSalt, hash, compare } from "bcryptjs";

const hashPassword = async (password: string) => {
  const saltgenerated = await genSalt(SALT_RANDOMS);
  return await hash(password, saltgenerated);
}


const verifyPassword = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword);
}

export const PasswordCrypto = {
  hashPassword,
  verifyPassword
};