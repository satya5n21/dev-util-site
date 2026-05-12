// pages/EncryptionDecryptionTool.jsx
import React, { useState } from "react";
import CryptoJS from "crypto-js";
import Editor from "../components/Editor"; // Adjust path if needed
import BackButton from "../components/BackButton";

export default function EncryptionDecryptionTool() {
  const [secretKey, setSecretKey] = useState("");
  const [plainJSON, setPlainJSON] = useState("");
  const [encryptedData, setEncryptedData] = useState("");

  // Base64 decode key
  const decodeBase64Key = (base64Key) => {
    return CryptoJS.enc.Base64.parse(base64Key);
  };

  // AES Encryption (CBC / PKCS5Padding)
  const handleEncrypt = async () => {
    try {
      const iv = CryptoJS.lib.WordArray.random(16);
      const parsedKey = decodeBase64Key(secretKey);
      const encryptedData = CryptoJS.AES.encrypt(plainJSON, parsedKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Combine IV + CipherText and encode in Base64
      const combined = iv.concat(encryptedData.ciphertext);
      const base64Result = CryptoJS.enc.Base64.stringify(combined);
      setEncryptedData(base64Result);
    } catch (err) {
      alert("Encryption failed: " + err.message);
    }
  };

  const handleDecrypt = async () => {
    try {
      const combined = CryptoJS.enc.Base64.parse(encryptedData);
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
      const ciphertext = CryptoJS.lib.WordArray.create(
        combined.words.slice(4),
        combined.sigBytes - 16
      );

      const parsedKey = decodeBase64Key(secretKey);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        parsedKey,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8).trim();

      try {
        const formatted = JSON.stringify(JSON.parse(decryptedText), null, 2);
        setPlainJSON(formatted);
      } catch (error) {
        setPlainJSON(decryptedText);
      }
    } catch (err) {
      alert("Decryption failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-white">
    
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-6">Encrypt / Decrypt Tool</h1>

      {/* Secret Key Input */}
      <div className="max-w-3xl mx-auto mb-6">
        <label className="block mb-2 text-lg font-medium">Secret Key</label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter secret key"
        />
      </div>

      {/* Editors */}
      <div className="flex flex-col md:flex-row gap-4 max-w-7xl mx-auto h-[60vh] mb-6">
        <Editor
          title="Plain JSON (to Encrypt or Decrypted Output)"
          value={plainJSON}
          onChange={setPlainJSON}
          wrap={true}
        />
        <Editor
          title="Encrypted Data (to Decrypt or Encrypted Output)"
          value={encryptedData}
          onChange={setEncryptedData}
          wrap={true}
        />
      </div>

      {/* Buttons */}
      <div className="mx-2 flex justify-around gap-8">
        <button
          onClick={handleEncrypt}
          className="w-full p-2 bg-green-600 hover:bg-green-700 transition-colors dark:text-white cursor-pointer rounded-lg"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 transition-colors dark:text-white cursor-pointer rounded-lg"
        >
          Decrypt
        </button>
      </div>
    </div>
  );
}
