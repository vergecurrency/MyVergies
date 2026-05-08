// @ts-ignore
import Mnemonic from 'bitcore-mnemonic'
// @ts-ignore
import Bitcore from 'bitcore-lib'

const ACCOUNT_DERIVATION_PATH = "m/44'/77'/0'"

export interface DerivedElectrumAddress {
  address: string
  path: string
  publicKeys: string[]
  isChange: boolean
}

export interface DerivedElectrumPrivateKey {
  path: string
  privateKey: any
}

export const getElectrumAccountDerivationPath = (): string => {
  return ACCOUNT_DERIVATION_PATH
}

export const createElectrumAccountPrivateKey = (mnemonic: string, mnemonicPassphrase: string = '') => {
  const words = String(mnemonic || '').trim()
  const code = new Mnemonic(words)
  return code.toHDPrivateKey(mnemonicPassphrase || '', 'livenet').deriveChild(ACCOUNT_DERIVATION_PATH)
}

export const deriveElectrumAddressAt = (
  mnemonic: string,
  mnemonicPassphrase: string,
  change: 0 | 1,
  index: number
): DerivedElectrumAddress => {
  const accountXPriv = createElectrumAccountPrivateKey(mnemonic, mnemonicPassphrase)
  const childPath = `m/${change}/${index}`
  const childKey = accountXPriv.deriveChild(childPath)
  const publicKey = childKey.publicKey
  const address = Bitcore.Address.fromPublicKey(publicKey, 'livenet').toString()

  return {
    address,
    path: childPath,
    publicKeys: [publicKey.toString()],
    isChange: change === 1
  }
}

export const deriveElectrumPrivateKeyAt = (
  mnemonic: string,
  mnemonicPassphrase: string,
  change: 0 | 1,
  index: number
): DerivedElectrumPrivateKey => {
  const accountXPriv = createElectrumAccountPrivateKey(mnemonic, mnemonicPassphrase)
  const childPath = `m/${change}/${index}`
  const childKey = accountXPriv.deriveChild(childPath)

  return {
    path: childPath,
    privateKey: childKey.privateKey
  }
}

export const deriveElectrumPrivateKeyForPath = (
  mnemonic: string,
  mnemonicPassphrase: string,
  path: string
): DerivedElectrumPrivateKey => {
  const normalizedPath = String(path || '').trim()
  const relativePath = normalizedPath.startsWith('m/') ? normalizedPath : `m/${normalizedPath}`
  const childKey = createElectrumAccountPrivateKey(mnemonic, mnemonicPassphrase).deriveChild(relativePath)

  return {
    path: relativePath,
    privateKey: childKey.privateKey
  }
}

export const deriveElectrumAddresses = (
  mnemonic: string,
  mnemonicPassphrase: string,
  change: 0 | 1,
  count: number,
  startIndex: number = 0
): DerivedElectrumAddress[] => {
  const addresses: DerivedElectrumAddress[] = []

  for (let index = startIndex; index < startIndex + count; index++) {
    addresses.push(deriveElectrumAddressAt(mnemonic, mnemonicPassphrase, change, index))
  }

  return addresses
}
