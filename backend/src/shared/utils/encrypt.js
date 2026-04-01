import CryptoJS from 'crypto-js'
import Bcrypt from 'bcrypt'
import data_env from '../../config/env.config.js'

export const encrypt = async (str) => {
    const salt = await Bcrypt.genSalt(10);
    const enc = await Bcrypt.hash(str, salt);
    return enc
}

export const encryptDataCrypto = (data) => {
  try {
    // Chuyển data (mảng/object) thành string trước khi mã hóa
    const stringData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, data_env.PERMISSION_KEY_SECRET).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};