const CryptoJS = require('crypto-js');

export const generateSignature = (data: any, secretKey: string): string => {
  const dataString = JSON.stringify(data);
  return CryptoJS.HmacSHA256(dataString, secretKey).toString();
};

export default generateSignature;