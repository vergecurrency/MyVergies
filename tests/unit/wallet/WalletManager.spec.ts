import WalletManager from '@/WalletManager/WalletManager'
import ManagerConfig, { WalletConfigItem } from '@/WalletManager/ManagerConfig'

let walletManager: WalletManager
const STATIC_TEST_WALLETS: WalletConfigItem[] = [
  {
    name: 'myWallet',
    color: '0x0fafa2',
    coin: 'xvg',
    network: 'livenet',
    paperkey:
      'twin senior seminar earn sight rebel muscle festival table mind control fantasy luxury mobile girl',
    passphrase: 'walletpass',
    singleAddress: false,
    vwsApi: 'http://localhost:3000'
  }
]

beforeEach(async () => {
  walletManager = new WalletManager()
  await walletManager.boot(new ManagerConfig(STATIC_TEST_WALLETS))
})

test('Wallet should be loaded after initialization', () => {
  expect(walletManager.getWallets()).toHaveLength(1)

  const { color } = walletManager.getWallet('myWallet') || {}
  expect(color).toBe('0x0fafa2')
})
