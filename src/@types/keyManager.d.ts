interface EncryptedWalletData {
	name: string
	encryptedData: string
}

interface WalletKeyData {
	name: string
	unlockPassword: string
	privatePassword: string
}

interface WalletData {
	publicKey: string
	encryptedMnemonic: string
}