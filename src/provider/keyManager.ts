import CryptoJS from "crypto-js";
import { ethers, utils } from "ethers";
import { HDNode } from "ethers/lib/utils";

class KeyManager {
	static encryptData(dataToEncrypt: string, secretKey: string): string {
		return CryptoJS.AES.encrypt(dataToEncrypt, secretKey).toString();
	}

	static decryptData(encryptedData: string, secretKey: string): string {
		return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
	}

	// Function to get all public keys from a mnemonic
	static getPublicKeys(mnemonic: string, numberOfKeys: number): string[] {
		const masterNode = HDNode.fromMnemonic(mnemonic);
		const publicKeys: string[] = [];

		for (let i = 0; i < numberOfKeys; i++) {
			const childNode = masterNode.derivePath(`m/44'/60'/0'/0/${i}`);
			const publicKey = utils.computeAddress(childNode.publicKey);
			publicKeys.push(publicKey);
		}

		return publicKeys;
	}

	// Function to get all public keys from a mnemonic
	static getPrivateKeys(mnemonic: string, numberOfKeys: number): string[] {
		const masterNode = HDNode.fromMnemonic(mnemonic);
		const privatekeys: string[] = [];

		for (let i = 0; i < numberOfKeys; i++) {
			const childNode = masterNode.derivePath(`m/44'/60'/0'/0/${i}`);
			privatekeys.push(childNode.privateKey);
		}

		return privatekeys;
	}

	static unlockWalletData(encryptedWalletData: EncryptedWalletData, unlockPassword: string): WalletData {
		const walletData = JSON.parse(KeyManager.decryptData(encryptedWalletData.encryptedData, unlockPassword));
		return walletData
	}

	static unlockMnemonic(encryptedMnemonic: string, privatePassword: string): string {
		const mnemonic = KeyManager.decryptData(encryptedMnemonic, privatePassword);
		return mnemonic;
	}

	static createEncryptedWalletData(keyData: WalletKeyData): EncryptedWalletData {
		const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
		const [publickKey] = KeyManager.getPublicKeys(mnemonic, 1);

		const encryptedMnemonic = KeyManager.encryptData(mnemonic, keyData.privatePassword); // lock mnemonic data
		const walletData: WalletData = {
			publicKey: publickKey,
			encryptedMnemonic: encryptedMnemonic
		}

		// lock wallet data
		const encryptedWalletData = KeyManager.encryptData(JSON.stringify(walletData), keyData.unlockPassword);

		return {
			name: keyData.name,
			encryptedData: encryptedWalletData
		}
	}
}

export { KeyManager };