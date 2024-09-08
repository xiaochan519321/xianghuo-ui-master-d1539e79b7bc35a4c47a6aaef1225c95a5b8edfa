const CryptoJS = require('crypto-js');

// 十六位十六进制数作为密钥
const KEY = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');
// 十六位十六进制数作为密钥偏移量
const IV = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');

/**
 * ASE加密方法
 */
export const EncryptASE = (word) => {
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase();
};

/**
 * ASE解密方法
 */
export const DecryptASE = (word) => {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};

/**
 * 字符串进行加密
 */
export const CompileStr = (code) => {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
};

/**
 * 字符串进行解密
 */
export const UncompileStr = (code) => {
    code = unescape(code);
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
};

/**
 * BASE64进行加密
 */
export const EncryptBase64 = (code) => window.btoa(code);

/**
 * BASE64进行解密
 */
export const DecryptBase64 = (code) => window.atob(code);

/**
 * 加密方法
 */
export const Encrypt = (word) => {
    const encryptWord = EncryptASE(word);
    const encryptWordStr = CompileStr(encryptWord);
    return EncryptBase64(encryptWordStr);
};

/**
 * 解密方法
 */
export const Decrypt = (word) => {
    const decryptWordStrBase64 = DecryptBase64(word);
    const decryptWordStr = UncompileStr(decryptWordStrBase64);
    return DecryptASE(decryptWordStr);
};
