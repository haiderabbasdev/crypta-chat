export class CryptoUtils {
  static async generateKeyPair(): Promise<CryptoKeyPair> {
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
  }

  static async exportPublicKey(keyPair: CryptoKeyPair): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    return JSON.stringify(exported);
  }

  static async importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyData = JSON.parse(keyString);
    return await window.crypto.subtle.importKey(
      "jwk",
      keyData,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"]
    );
  }

  static async encryptForRecipient(message: string, recipientPublicKey: string): Promise<string> {
    try {
      const publicKey = await this.importPublicKey(recipientPublicKey);
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        data
      );
      
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    } catch (error) {
      console.error('Encryption for recipient failed:', error);
      throw error;
    }
  }

  static async decryptFromSender(encryptedMessage: string, privateKey: CryptoKey): Promise<string> {
    try {
      const encrypted = new Uint8Array(
        atob(encryptedMessage).split('').map(c => c.charCodeAt(0))
      );
      
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        encrypted
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption from sender failed:', error);
      throw error;
    }
  }

  static generateSessionId(): string {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Legacy exports for backwards compatibility
export const generateRSAKeyPair = CryptoUtils.generateKeyPair;
export const encryptMessage = CryptoUtils.encryptForRecipient;
export const decryptMessage = CryptoUtils.decryptFromSender;
