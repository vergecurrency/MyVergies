import Wallet from '@/walletManager/Wallet'

test('removeTxProposal resolves with refreshed proposals', async () => {
  const proposals = [{ id: 'remaining-txp' }]
  const vwc = {
    removeTxProposal: jest.fn((_proposal, callback) => callback(null)),
    getTxProposals: jest.fn((_options, callback) => callback(null, proposals))
  }
  const wallet = new Wallet('wallet-id', 'Wallet', 'blue', vwc as any)

  await expect(wallet.removeTxProposal({ id: 'stale-txp' } as any)).resolves.toBe(proposals)

  expect(vwc.removeTxProposal).toHaveBeenCalledWith({ id: 'stale-txp' }, expect.any(Function))
  expect(vwc.getTxProposals).toHaveBeenCalled()
  expect(wallet.txProposals).toBe(proposals)
})

test('status marks vws connection connected after successful api response', async () => {
  const info = {
    wallet: {
      coin: 'xvg',
      network: 'livenet',
      singleAddress: false
    },
    balance: {
      totalAmount: 0,
      byAddress: []
    }
  }
  const vwc = {
    getStatus: jest.fn((_options, callback) => callback(null, info))
  }
  const wallet = new Wallet('wallet-id', 'Wallet', 'blue', vwc as any)
  wallet.connectionStatus = 'disconnected'

  await expect(wallet.status()).resolves.toBe(info)

  expect(wallet.connectionStatus).toBe('connected')
})

test('status marks vws connection disconnected after failed api response', async () => {
  const vwc = {
    getStatus: jest.fn((_options, callback) => callback(new Error('offline')))
  }
  const wallet = new Wallet('wallet-id', 'Wallet', 'blue', vwc as any)
  wallet.connectionStatus = 'connected'

  await expect(wallet.status()).rejects.toThrow('offline')

  expect(wallet.connectionStatus).toBe('disconnected')
})
