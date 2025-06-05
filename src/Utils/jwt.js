import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

export const generateToken = (payload, secret, options) => {
  return sign(payload, secret, options);
};

export const verifyToken = (token, secret) => {
  return verify(token, secret);
};
