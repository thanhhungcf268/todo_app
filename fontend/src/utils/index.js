import dayjs from 'dayjs'
import CryptoJS from "crypto-js";

export const backLogIn = () => {
    localStorage.clear();
    window.location.href = window.location.origin + "/login";
}

// import timezone from 'dayjs/plugin/timezone.js';
// dayjs.extend(timezone);


export const getDayTZ = () => {
  // Current time in the Node.js server's local timezone
  const localTime = dayjs();

  // Convert to a specific timezone
//   const newYorkTime = localTime.tz("America/New_York");
  return localTime.format('YYYY-MM-DD HH:mm:ss');
};


export const decryptDataCrypto = (textEncrypt) => {
  try {
    if (!textEncrypt) return null;
    const bytes = CryptoJS.AES.decrypt(textEncrypt, import.meta.env.VITE_PERMISSION_KEY_SECRET);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    // Chuyển ngược từ string về mảng/object
    return decryptedString;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
export const encryptDataCrypto = (data) => {
  try {
    // Chuyển data (mảng/object) thành string trước khi mã hóa
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, import.meta.env.VITE_PERMISSION_KEY_SECRET).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};


export const handleAPI = (promise) => {
  return promise
    .then(data => [data, undefined])
    .catch(error => [undefined, error]);
};