import WalletManager from '@/Wallet/WalletManager'
import wallets from '@/assets/data/example/wallets.dist.json'
import ManagerConfig from '@/wallet/ManagerConfig'

let walletManager: WalletManager

beforeEach(() => {
  walletManager = new WalletManager(new ManagerConfig(wallets))
})

test('Wallet should be loaded after initialization', () => {
  expect(walletManager.getWallets()).toHaveLength(1)
})
