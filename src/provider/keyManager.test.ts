import { KeyManager } from "./keyManager";

const testWalletKeyData: WalletKeyData = {
	name: "Wallet-1",
	unlockPassword: "ZengDa555",
	privatePassword: "DesmondTan555",
}

let walletData: WalletData;
let encryptedWalletData: EncryptedWalletData;

describe('Wallet Creation', () => {
	test('creates a random wallet should be successed', () => {
		// const keyManager = new KeyManager();
		encryptedWalletData = KeyManager.createEncryptedWalletData(testWalletKeyData);
		console.log("encrypted Wallet Data:: ", encryptedWalletData);
	})

	test("unlock wallet data should be successed", () => {
		walletData = KeyManager.unlockWalletData(encryptedWalletData, testWalletKeyData.unlockPassword);
		console.log("walletData:: ", walletData)
	})

	test("unlock mnemonic should be successed", () => {
		const mnemonic = KeyManager.unlockMnemonic(walletData.encryptedMnemonic, testWalletKeyData.privatePassword);
		console.log("mnemonic:: ", mnemonic)
	})
});