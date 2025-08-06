import { useCallback } from "react";

export function useEncryption() {
  const generateKeyPair = useCallback(async () => {
    return await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  }, []);

  const generateAESKey = useCallback(async () => {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }, []);

  const encryptMessage = useCallback(async (message: string) => {
    try {
      // Generate a new AES key for each message
      const aesKey = await generateAESKey();
      
      // Encrypt the message with AES
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        aesKey,
        data
      );

      // Export the AES key
      const exportedKey = await window.crypto.subtle.exportKey("raw", aesKey);
      
      // Combine IV, key, and encrypted data
      const combined = new Uint8Array(
        iv.length + exportedKey.byteLength + encryptedData.byteLength
      );
      combined.set(iv, 0);
      combined.set(new Uint8Array(exportedKey), iv.length);
      combined.set(new Uint8Array(encryptedData), iv.length + exportedKey.byteLength);
      
      // Return as base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }, [generateAESKey]);

  const decryptMessage = useCallback(async (encryptedMessage: string) => {
    try {
      // Decode from base64
      const combined = new Uint8Array(
        atob(encryptedMessage).split('').map(c => c.charCodeAt(0))
      );
      
      // Extract IV, key, and encrypted data
      const iv = combined.slice(0, 12);
      const keyData = combined.slice(12, 12 + 32); // 256 bits = 32 bytes
      const encryptedData = combined.slice(12 + 32);
      
      // Import the AES key
      const aesKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        "AES-GCM",
        false,
        ["decrypt"]
      );
      
      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        aesKey,
        encryptedData
      );
      
      // Decode the message
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }, []);

  return {
    generateKeyPair,
    generateAESKey,
    encryptMessage,
    decryptMessage
  };
}
